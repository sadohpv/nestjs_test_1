import { Test, TestingModule } from '@nestjs/testing';
import { LikeCommentController } from './like-comment.controller';

describe('LikeCommentController', () => {
  let controller: LikeCommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LikeCommentController],
    }).compile();

    controller = module.get<LikeCommentController>(LikeCommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
