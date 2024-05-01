import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateCommentDto } from 'src/types/comments/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createComment(createCommentDto: CreateCommentDto) {
    try {
      await this.databaseService.post.update({
        where: {
          id: createCommentDto.postId,
        },
        data: {
          commentNumber: { increment: 1 },
        },
      });
      const result = await this.databaseService.comment.create({
        data: {
          userId: createCommentDto.userId,
          postId: createCommentDto.postId,
          content: createCommentDto.content,
          likeNumber: 0,
        },
      });
      return result;
    } catch (e) {
      return false;
    }
  }
  async getComment(id: number) {
    try {
      const result = await this.databaseService.comment.findMany({
        where: {
          postId: id,
        },
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
        include: {
          author: {
            select: {
              id: true,
              avatar: true,
              userName: true,
            },
          },
        },
      });

      return result;
    } catch (e) {
      return false;
    }
  }
  async getLikeComment(id: number) {
    try {
      const result = await this.databaseService.likeComment.findMany({
        where: {
          userId: id,
        },
      });

      return result.map((item) => item.commentId);
    } catch (e) {
      return false;
    }
  }
}
