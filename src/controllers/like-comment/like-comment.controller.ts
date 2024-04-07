import { Controller } from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';
import { LikeCommentService } from 'src/services/like-comment/like-comment.service';

@Controller('like-comment')
export class LikeCommentController {
  constructor(private readonly likeCommentService: LikeCommentService) {}
  private readonly logger = new LoggerService(LikeCommentController.name);
}
