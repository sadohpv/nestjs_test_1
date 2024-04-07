import { Controller } from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';
import { PostsService } from 'src/services/posts/posts.service';

@Controller('post')
export class PostController {
  constructor(private readonly usersService: PostsService) {}
  private readonly logger = new LoggerService(PostController.name);
}
