import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { LoggerService } from 'src/logger/logger.service';
import { PublicRoute } from 'src/modules/auth/public.decorator';
import { CommentService } from 'src/services/comment/comment.service';
import { CreateCommentDto } from 'src/types/comments/create-comment.dto';
import { EditCommentDto } from 'src/types/comments/edit-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  private readonly logger = new LoggerService(CommentController.name);

  @PublicRoute()
  @Post('')
  async likeAndUnlikePost(
    @Body() createCommentDto: CreateCommentDto,
    @Res() res: Response,
  ) {
    const result = await this.commentService.createComment(createCommentDto);
    if (result) {
      return res.status(HttpStatus.OK).send({ result });
    } else {
      return res.status(HttpStatus.FORBIDDEN).send({ result });
    }
  }

  @PublicRoute()
  @Get(':id/:idUser')
  async getCommentForPost(
    @Res() res: Response,
    @Param('id') id: string,
    @Param('idUser') idUser: string,
  ) {
    const result = await this.commentService.getComment(+id);
    const likeCommentList = await this.commentService.getLikeComment(+idUser);
    if (result) {
      return res.status(HttpStatus.OK).send({ result, likeCommentList });
    } else {
      return res.status(HttpStatus.FORBIDDEN).send({ result });
    }
  }
  @PublicRoute()
  @Delete(':id')
  async deleteComment(@Res() res: Response, @Param('id') id: string) {
    const result = await this.commentService.deleteComment(+id);

    if (result) {
      return res.status(HttpStatus.OK).send({ result });
    } else {
      return res.status(HttpStatus.FORBIDDEN).send({ result });
    }
  }

  @PublicRoute()
  @Patch('/edit')
  async editComment(
    @Res() res: Response,
    @Body() editCommentDto: EditCommentDto,
  ) {
    const result = await this.commentService.editComment(editCommentDto);

    if (result) {
      return res.status(HttpStatus.OK).send({ result });
    } else {
      return res.status(HttpStatus.FORBIDDEN).send({ result });
    }
  }
}
