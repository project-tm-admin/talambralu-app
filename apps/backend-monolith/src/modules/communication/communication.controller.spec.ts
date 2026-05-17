import { Test, TestingModule } from '@nestjs/testing';
import { CommunicationController } from './communication.controller';
import { CommunicationService } from './communication.service';
import { MatchService } from '../match/match.service';

describe('CommunicationController', () => {
  let controller: CommunicationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommunicationController],
      providers: [
        {
          provide: CommunicationService,
          useValue: {},
        },
        {
          provide: MatchService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<CommunicationController>(CommunicationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
