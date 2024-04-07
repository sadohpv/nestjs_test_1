import { Test, TestingModule } from '@nestjs/testing';
import { LikePostController } from './like-post.controller';

describe('LikePostController', () => {
  let controller: LikePostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LikePostController],
    }).compile();

    controller = module.get<LikePostController>(LikePostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
