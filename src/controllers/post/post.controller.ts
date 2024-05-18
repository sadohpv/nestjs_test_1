import {
  Body,
  Controller,
  Delete,
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
import { ChangePublishedPostDto } from 'src/types/posts/change-published.dto';
@Controller('post')
export class PostController {
  constructor(private readonly postsService: PostsService) {}
  private readonly logger = new LoggerService(PostController.name);
  @PublicRoute()
  @Get(':id')
  async findAllPost(
    @Ip() ip: string,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    this.logger.log(`Request for all post\t${ip}`, PostController.name);
    const dataPost = await this.postsService.findAllPost(+id);
    const checkLike = await this.postsService.checkLikePost(+id);
    const checkSave = await this.postsService.checkSavePost(+id);

    return res.status(HttpStatus.OK).send({ dataPost, checkLike, checkSave });
  }

  @PublicRoute()
  @Get('all/:id')
  async findAllPostSetting(
    @Ip() ip: string,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    this.logger.log(`Request for all post\t${ip}`, PostController.name);
    const dataPost = await this.postsService.findAllPostSetting(+id);
    // const checkLike = await this.postsService.checkLikePost(+id);
    return res.status(HttpStatus.OK).send({ dataPost });
  }

  @PublicRoute()
  @Get('page/:page/:id')
  async findPostPage(
    @Ip() ip: string,
    @Param('id') id: number,

    @Param('page') page: number,
    @Res() res: Response,
  ) {
    this.logger.log(`Request for page post\t${ip}`, PostController.name);
    const dataPost = await this.postsService.findPostPage(+page, +id);
    return res.status(HttpStatus.OK).send({ dataPost });
  }

  @PublicRoute()
  @Get('one/:idPost/:idUser')
  async findOnePost(
    @Ip() ip: string,
    @Param('idPost') idPost: number,
    @Param('idUser') idUser: number,
    @Res() res: Response,
  ) {
    this.logger.log(`Request for all post\t${ip}`, PostController.name);

    const dataPost = await this.postsService.findOnePost(+idPost, +idUser);
    const checkLike = await this.postsService.checkLikePost(+idUser);

    console.log(checkLike);
    return res.status(HttpStatus.OK).send({ dataPost, checkLike });
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
  @Patch('')
  async updatePost(@Body() updatePostDto: UpdatePostDto, @Res() res: Response) {
    const result = await this.postsService.updatePost(updatePostDto);
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
  @PublicRoute()
  @Get('guest/:slug/:id')
  async getGuestPost(
    @Param('slug') slug: string,
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    const dataPost = await this.postsService.getGuestPost(slug);

    const checkLike = await this.postsService.checkLikePost(+id);
    return res.status(HttpStatus.OK).send({ dataPost, checkLike });
  }
  @PublicRoute()
  @Get('save/:slug/:id')
  async getSavePost(
    @Param('slug') slug: string,
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    const dataPost = await this.postsService.getSavePost(slug, +id);
    const checkLike = await this.postsService.checkLikePost(+id);
    return res.status(HttpStatus.OK).send({ dataPost, checkLike });
  }
  @PublicRoute()
  @Get('listLike/:idPost/:idUser')
  async getListLikePost(
    @Param('idPost') idPost: number,
    @Param('idUser') idUser: number,
    @Res() res: Response,
  ) {
    const data = await this.postsService.getListLikePost(+idPost, idUser);

    return res.status(HttpStatus.OK).send({ data });
  }

  @PublicRoute()
  @Post('published')
  async changePublished(
    @Body() changePublishedDto: ChangePublishedPostDto,

    @Res() res: Response,
  ) {
    const data = await this.postsService.changePublished(changePublishedDto);

    return res.status(HttpStatus.OK).send({ data });
  }

  @PublicRoute()
  @Delete(':id')
  async deletePost(
    @Ip() ip: string,
    @Param('id') id: number,

    @Param('page') page: number,
    @Res() res: Response,
  ) {
    this.logger.log(`Request for page post\t${ip}`, PostController.name);
    const dataPost = await this.postsService.deletePost(+id);
    return res.status(HttpStatus.OK).send({ dataPost });
  }
}
