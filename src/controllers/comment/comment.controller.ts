import { Controller } from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';
import { CommentService } from 'src/services/comment/comment.service';

@Controller('comment')
export class CommentController {
  constructor(private readonly usersService: CommentService) {}
  private readonly logger = new LoggerService(CommentController.name);
}
