import { Test, TestingModule } from '@nestjs/testing';
import { SavePostService } from './save-post.service';

describe('SavePostService', () => {
  let service: SavePostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SavePostService],
    }).compile();

    service = module.get<SavePostService>(SavePostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
