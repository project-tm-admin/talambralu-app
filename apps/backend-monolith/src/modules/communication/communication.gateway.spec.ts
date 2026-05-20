import { Test, TestingModule } from '@nestjs/testing';
import { CommunicationGateway } from './communication.gateway';
import { Socket, Server } from 'socket.io';
import { MatchService } from '../match/match.service';
import { CommunicationService } from './communication.service';
import { WsException } from '@nestjs/websockets';

describe('CommunicationGateway', () => {
  let gateway: CommunicationGateway;
  let mockFirebaseApp;
  let mockMatchService;
  let mockCommunicationService;

  beforeEach(async () => {
    mockFirebaseApp = {
      auth: jest.fn().mockReturnValue({
        verifyIdToken: jest.fn(),
      }),
    };

    mockMatchService = {
      isUserInMatch: jest.fn(),
    };

    mockCommunicationService = {
      saveMessage: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommunicationGateway,
        {
          provide: 'FIREBASE_APP',
          useValue: mockFirebaseApp,
        },
        {
          provide: MatchService,
          useValue: mockMatchService,
        },
        {
          provide: CommunicationService,
          useValue: mockCommunicationService,
        },
      ],
    }).compile();

    gateway = module.get<CommunicationGateway>(CommunicationGateway);
    gateway.server = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    } as any;
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleConnection', () => {
    let client: Partial<Socket>;

    beforeEach(() => {
      client = {
        id: 'test-socket-id',
        handshake: {
          auth: {},
          headers: {},
          time: '',
          address: '',
          xdomain: false,
          secure: false,
          issued: 0,
          url: '',
          query: {},
        },
        disconnect: jest.fn(),
        data: {},
      };
    });

    it('should disconnect if no token is provided', async () => {
      await gateway.handleConnection(client as Socket);
      expect(client.disconnect).toHaveBeenCalledWith(true);
    });

    it('should disconnect if token is invalid', async () => {
      client.handshake.auth.token = 'invalid-token';
      mockFirebaseApp
        .auth()
        .verifyIdToken.mockRejectedValue(new Error('Invalid token'));

      await gateway.handleConnection(client as Socket);

      expect(mockFirebaseApp.auth().verifyIdToken).toHaveBeenCalledWith(
        'invalid-token',
      );
      expect(client.disconnect).toHaveBeenCalledWith(true);
    });

    it('should allow connection and set userId if token is valid', async () => {
      client.handshake.auth.token = 'Bearer valid-token';
      mockFirebaseApp
        .auth()
        .verifyIdToken.mockResolvedValue({ uid: 'test-user-id' });

      await gateway.handleConnection(client as Socket);

      expect(mockFirebaseApp.auth().verifyIdToken).toHaveBeenCalledWith(
        'valid-token',
      );
      expect(client.disconnect).not.toHaveBeenCalled();
      expect(client.data.userId).toBe('test-user-id');
    });
  });

  describe('handleJoinMatch', () => {
    it('should join the correct room if user is in match', async () => {
      const client = {
        join: jest.fn(),
        data: { userId: 'user1' },
      } as any;

      mockMatchService.isUserInMatch.mockResolvedValue(true);

      const result = await gateway.handleJoinMatch(client, 'match123');

      expect(mockMatchService.isUserInMatch).toHaveBeenCalledWith(
        'user1',
        'match123',
      );
      expect(client.join).toHaveBeenCalledWith('match_match123');
      expect(result).toEqual({ event: 'joinedRoom', data: 'match123' });
    });

    it('should throw WsException if user is not in match', async () => {
      const client = {
        join: jest.fn(),
        data: { userId: 'user1' },
      } as any;

      mockMatchService.isUserInMatch.mockResolvedValue(false);

      await expect(gateway.handleJoinMatch(client, 'match123')).rejects.toThrow(
        WsException,
      );
      expect(client.join).not.toHaveBeenCalled();
    });

    it('should throw WsException if matchId is missing', async () => {
      const client = {
        join: jest.fn(),
        data: { userId: 'user1' },
      } as any;

      await expect(gateway.handleJoinMatch(client, null)).rejects.toThrow(
        WsException,
      );
    });
  });

  describe('handleSendMessage', () => {
    it('should save and broadcast message if user is in match', async () => {
      const client = {
        data: { userId: 'user1' },
      } as any;
      const payload = { matchId: 'match123', content: 'hello' };
      const savedMessage = { id: 'msg1', ...payload, senderId: 'user1' };

      mockMatchService.isUserInMatch.mockResolvedValue(true);
      mockCommunicationService.saveMessage.mockResolvedValue(savedMessage);

      const result = await gateway.handleSendMessage(client, payload);

      expect(mockMatchService.isUserInMatch).toHaveBeenCalledWith(
        'user1',
        'match123',
      );
      expect(mockCommunicationService.saveMessage).toHaveBeenCalledWith(
        'match123',
        'user1',
        'hello',
      );
      expect(gateway.server.to).toHaveBeenCalledWith('match_match123');
      expect(gateway.server.emit).toHaveBeenCalledWith(
        'newMessage',
        savedMessage,
      );
      expect(result).toEqual({ status: 'ok', messageId: 'msg1' });
    });

    it('should throw WsException if user is not in match', async () => {
      const client = {
        data: { userId: 'user1' },
      } as any;
      const payload = { matchId: 'match123', content: 'hello' };

      mockMatchService.isUserInMatch.mockResolvedValue(false);

      await expect(gateway.handleSendMessage(client, payload)).rejects.toThrow(
        WsException,
      );
    });
  });
});
