import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';
import { PublicRoute } from 'src/modules/auth/public.decorator';
import { LikePostService } from 'src/services/like-post/like-post.service';
import { LikePostDto } from 'src/types/posts/like-post.dto';
import { Response } from 'express';
@Controller('like-post')
export class LikePostController {
  constructor(private readonly likePostService: LikePostService) {}
  private readonly logger = new LoggerService(LikePostController.name);



  @PublicRoute()
  @Post('')
  async likeAndUnlikePost(
    @Body() likePost: LikePostDto,
    @Res() res: Response,
  ) {

    const result = await this.likePostService.handleToggleLike(likePost);
    if (result) {
      return res.status(HttpStatus.OK).send({ result });
    } else {
      return res.status(HttpStatus.FORBIDDEN).send({ result });
    }
  }
}
