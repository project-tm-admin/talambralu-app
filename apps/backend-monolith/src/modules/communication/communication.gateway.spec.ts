import { Test, TestingModule } from '@nestjs/testing';
import { CommunicationGateway } from './communication.gateway';
import { Socket } from 'socket.io';

describe('CommunicationGateway', () => {
  let gateway: CommunicationGateway;
  let mockFirebaseApp;

  beforeEach(async () => {
    mockFirebaseApp = {
      auth: jest.fn().mockReturnValue({
        verifyIdToken: jest.fn(),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommunicationGateway,
        {
          provide: 'FIREBASE_APP',
          useValue: mockFirebaseApp,
        },
      ],
    }).compile();

    gateway = module.get<CommunicationGateway>(CommunicationGateway);
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
          query: {}
        } as any,
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
      mockFirebaseApp.auth().verifyIdToken.mockRejectedValue(new Error('Invalid token'));

      await gateway.handleConnection(client as Socket);

      expect(mockFirebaseApp.auth().verifyIdToken).toHaveBeenCalledWith('invalid-token');
      expect(client.disconnect).toHaveBeenCalledWith(true);
    });

    it('should allow connection and set userId if token is valid', async () => {
      client.handshake.auth.token = 'Bearer valid-token';
      mockFirebaseApp.auth().verifyIdToken.mockResolvedValue({ uid: 'test-user-id' });

      await gateway.handleConnection(client as Socket);

      expect(mockFirebaseApp.auth().verifyIdToken).toHaveBeenCalledWith('valid-token');
      expect(client.disconnect).not.toHaveBeenCalled();
      expect(client.data.userId).toBe('test-user-id');
    });
  });

  describe('handleJoinMatch', () => {
    it('should join the correct room', () => {
      const client = {
        join: jest.fn(),
        data: { userId: 'user1' },
      } as any;

      const result = gateway.handleJoinMatch(client, 'match123');

      expect(client.join).toHaveBeenCalledWith('match_match123');
      expect(result).toEqual({ event: 'joinedRoom', data: 'match123' });
    });
  });
});
