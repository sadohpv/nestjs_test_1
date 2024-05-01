import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { LoggerService } from 'src/logger/logger.service';
import { PublicRoute } from 'src/modules/auth/public.decorator';
import { LikeCommentService } from 'src/services/like-comment/like-comment.service';
import { CreateLikeCommentDto } from 'src/types/like-comments/create-like-comment.dto';

@Controller('like-comment')
export class LikeCommentController {
  constructor(private readonly likeCommentService: LikeCommentService) {}
  private readonly logger = new LoggerService(LikeCommentController.name);
  @PublicRoute()
  @Post('')
  async likeAndUnlikeComment(
    @Body() createLikeCommentDto: CreateLikeCommentDto,
    @Res() res: Response,
  ) {
    // console.log(createLikeCommentDto);
    const result = await this.likeCommentService.handleToggleLikeComment(createLikeCommentDto);
 
    if (result) {
      return res.status(HttpStatus.OK).send({ result });
    } else {
      return res.status(HttpStatus.FORBIDDEN).send({ result });
    }
  }
}
