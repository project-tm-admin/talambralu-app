import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class CommunicationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(CommunicationGateway.name);

  constructor(@Inject('FIREBASE_APP') private firebaseApp: admin.app.App) {}

  async handleConnection(client: Socket) {
    try {
      const authHeader = client.handshake.auth.token || client.handshake.headers.authorization;
      if (!authHeader) {
        this.logger.warn(`Disconnecting unauthenticated client: ${client.id}`);
        client.disconnect(true);
        return;
      }

      const token = authHeader.replace('Bearer ', '');
      const decodedToken = await this.firebaseApp.auth().verifyIdToken(token);
      
      // Store user id in socket instance
      client.data.userId = decodedToken.uid;
      this.logger.log(`Client connected: ${client.id}, User: ${decodedToken.uid}`);
    } catch (error) {
      this.logger.warn(`Authentication failed for client: ${client.id}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinMatch')
  handleJoinMatch(
    @ConnectedSocket() client: Socket,
    @MessageBody() matchId: string,
  ) {
    if (!matchId) return;

    // TODO in Story 4.2: Verify that the user is actually part of this match before joining
    client.join(`match_${matchId}`);
    this.logger.log(`User ${client.data.userId} joined room match_${matchId}`);
    return { event: 'joinedRoom', data: matchId };
  }
}
