import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { LikePostDto } from 'src/types/posts/like-post.dto';

@Injectable()
export class LikePostService {
  constructor(private readonly databaseService: DatabaseService) {}

  async handleToggleLike(likePostDto: LikePostDto) {
    try {
      if (likePostDto.like === true) {
        await this.databaseService.post.update({
          where: {
            id: likePostDto.postId,
          },
          data: {
            likeNumber: { increment: 1 },
          },
        });
        const result = await this.databaseService.likePost.create({
          data: {
            userId: likePostDto.userId,
            postId: likePostDto.postId,
          },
        });
        return result;
      } else {
        await this.databaseService.post.update({
          where: {
            id: likePostDto.postId,
          },
          data: {
            likeNumber: { decrement: 1 },
          },
        });
        const result = await this.databaseService.likePost.findFirst({
          where: {
            postId: likePostDto.postId,
            userId: likePostDto.userId,
          },
        });
        const deleteResult = await this.databaseService.likePost.delete({
          where: {
            id: result.id,
          },
        });
        return deleteResult;
      }
    } catch (e) {
      return false;
    }
  }
}
