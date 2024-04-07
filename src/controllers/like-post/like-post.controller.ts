import { Controller } from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';
import { LikePostService } from 'src/services/like-post/like-post.service';

@Controller('like-post')
export class LikePostController {
  constructor(private readonly likePostService: LikePostService) {}
  private readonly logger = new LoggerService(LikePostController.name);
}
