import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Ip,
  Param,
  Patch,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';
import { PublicRoute } from 'src/modules/auth/public.decorator';
import { PostsService } from 'src/services/posts/posts.service';
import { CreatePostDto } from 'src/types/posts/create-post.dto';
import { UpdatePostDto } from 'src/types/posts/update-post-dto';
import { Response } from 'express';
import { Prisma } from '@prisma/client';
import { LikePostDto } from 'src/types/posts/like-post.dto';
@Controller('post')
export class PostController {
  constructor(private readonly postsService: PostsService) {}
  private readonly logger = new LoggerService(PostController.name);
  @PublicRoute()
  @Get(':id')
  async findAllPost(@Ip() ip: string, @Param('id') id: string, @Res() res: Response) {
    this.logger.log(`Request for all post\t${ip}`, PostController.name);
    const dataPost = await this.postsService.findAllPost();
    const checkLike = await this.postsService.checkLikePost(+id);
    return res.status(HttpStatus.OK).send({ dataPost, checkLike });
  }

  @PublicRoute()
  @Get(':id')
  findOnePost(@Ip() ip: string, @Param('id') id: string) {
    this.logger.log(`Request for all post\t${ip}`, PostController.name);

    return this.postsService.findOnePost(+id);
  }

  @PublicRoute()
  @Post()
  // @UsePipes(ValidationPipe)
  async createPost(@Body() createPostDto: CreatePostDto, @Res() res: Response) {
    if (createPostDto) {
      const result = await this.postsService.createPost(createPostDto);
      this.logger.log(`Request for create post `, PostController.name);

      if (result) {
        return res.status(HttpStatus.CREATED).send({ result });
      } else {
        return res.status(HttpStatus.FORBIDDEN).send({ result });
      }
    } else {
      this.logger.log(`Loss data`, PostController.name);
      return res.status(HttpStatus.BAD_REQUEST).send();
    }
  }

  @PublicRoute()
  @Patch(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Res() res: Response,
  ) {
    const result = await this.postsService.updatePost(+id, updatePostDto);
    if (result) {
      return res.status(HttpStatus.OK).send({ result });
    } else {
      return res.status(HttpStatus.FORBIDDEN).send({ result });
    }
  }
  @PublicRoute()
  @Patch(':id/like')
  async likeAndUnlikePost(
    @Param('id') id: string,
    @Body() likePostDto: LikePostDto,
    @Res() res: Response,
  ) {
    const result = await this.postsService.likeAndUnlikePost(+id, likePostDto);
    if (result) {
      return res.status(HttpStatus.OK).send({ result });
    } else {
      return res.status(HttpStatus.FORBIDDEN).send({ result });
    }
  }
  @PublicRoute()
  @Patch(':id/like')
  async sharePost(@Param('id') id: string, @Res() res: Response) {
    // if (result) {
    //   return res.status(HttpStatus.OK).send({ result });
    // } else {
    //   return res.status(HttpStatus.FORBIDDEN).send({ result });
    // }
  }
}
