import { Test, TestingModule } from '@nestjs/testing';
import { ComincomController } from './comincom.controller';

describe('ComincomController', () => {
  let controller: ComincomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComincomController],
    }).compile();

    controller = module.get<ComincomController>(ComincomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
