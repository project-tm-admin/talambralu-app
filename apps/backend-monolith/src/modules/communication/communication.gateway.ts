import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, Inject, UsePipes, ValidationPipe } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { MatchService } from '../match/match.service';
import { CommunicationService } from './communication.service';
import { SendMessageDto, MessageResponseDto } from './dto/message.dto';

@WebSocketGateway({
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
    credentials: true,
  },
})
export class CommunicationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(CommunicationGateway.name);

  constructor(
    @Inject('FIREBASE_APP') private firebaseApp: admin.app.App,
    private matchService: MatchService,
    private communicationService: CommunicationService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const authHeader =
        client.handshake.auth.token || client.handshake.headers.authorization;
      if (!authHeader) {
        this.logger.warn(`Disconnecting unauthenticated client: ${client.id}`);
        client.disconnect(true);
        return;
      }

      const token = authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : authHeader;

      const decodedToken = await this.firebaseApp.auth().verifyIdToken(token);

      // Store user id in socket instance
      client.data.userId = decodedToken.uid;
      this.logger.log(
        `Client connected: ${client.id}, User: ${decodedToken.uid}`,
      );
    } catch (error) {
      this.logger.warn(
        `Authentication failed for client: ${client.id}: ${error.message}`,
      );
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinMatch')
  async handleJoinMatch(
    @ConnectedSocket() client: Socket,
    @MessageBody() matchId: string,
  ) {
    if (!matchId || typeof matchId !== 'string') {
      throw new WsException('Invalid matchId');
    }

    const userId = client.data.userId;
    const isParticipant = await this.matchService.isUserInMatch(
      userId,
      matchId,
    );

    if (!isParticipant) {
      this.logger.warn(
        `User ${userId} attempted to join unauthorized match room: ${matchId}`,
      );
      throw new WsException('Unauthorized access to match room');
    }

    await client.join(`match_${matchId}`);
    this.logger.log(`User ${userId} joined room match_${matchId}`);
    return { event: 'joinedRoom', data: matchId };
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SendMessageDto,
  ) {
    const { matchId, content } = payload;
    const userId = client.data.userId;

    // 1. Validate participation
    const isParticipant = await this.matchService.isUserInMatch(
      userId,
      matchId,
    );
    if (!isParticipant) {
      throw new WsException('Unauthorized access to match room');
    }

    // 2. Persist message
    const message = await this.communicationService.saveMessage(
      matchId,
      userId,
      content,
    );

    const response: MessageResponseDto = {
      id: message.id,
      matchId: message.matchId,
      senderId: message.senderId,
      content: message.content,
      createdAt: message.createdAt,
    };

    // 3. Broadcast to room
    this.server.to(`match_${matchId}`).emit('newMessage', response);

    return { status: 'ok', messageId: message.id };
  }
}
