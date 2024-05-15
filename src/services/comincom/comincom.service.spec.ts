import { Test, TestingModule } from '@nestjs/testing';
import { ComincomService } from './comincom.service';

describe('ComincomService', () => {
  let service: ComincomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComincomService],
    }).compile();

    service = module.get<ComincomService>(ComincomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
