import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { LoggerService } from 'src/logger/logger.service';
import { PublicRoute } from 'src/modules/auth/public.decorator';
import { SavePostService } from 'src/services/save-post/save-post.service';
import { CreateSavePostDto } from 'src/types/savePost/create-savePost.dto';

@Controller('save-post')
export class SavePostController {

    constructor(private readonly savePostService: SavePostService) {}
  private readonly logger = new LoggerService(SavePostService.name);

  @PublicRoute()
  @Post('save')
  async savePost(@Body() savePost: CreateSavePostDto, @Res() res: Response) {
    const result = await this.savePostService.handleSavePost(savePost);
    if (result) {
      return res.status(HttpStatus.OK).send({ result });
    } else {
      return res.status(HttpStatus.FORBIDDEN).send({ result });
    }
  }
  @PublicRoute()
  @Post('unsave')
  async unsavePost(@Body() savePost: CreateSavePostDto, @Res() res: Response) {
    const result = await this.savePostService.handleDeleteSavePost(savePost);
    if (result) {
      return res.status(HttpStatus.OK).send({ result });
    } else {
      return res.status(HttpStatus.FORBIDDEN).send({ result });
    }
  }
}
