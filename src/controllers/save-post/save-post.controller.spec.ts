import { Test, TestingModule } from '@nestjs/testing';
import { SavePostController } from './save-post.controller';

describe('SavePostController', () => {
  let controller: SavePostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SavePostController],
    }).compile();

    controller = module.get<SavePostController>(SavePostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
