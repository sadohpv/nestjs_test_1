import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateLikeCommentDto } from 'src/types/like-comments/create-like-comment.dto';

@Injectable()
export class LikeCommentService {
  constructor(private readonly databaseService: DatabaseService) {}

  async handleToggleLikeComment(createLikeCommentDto: CreateLikeCommentDto) {
    try {
      if (createLikeCommentDto.like) {
        await this.databaseService.comment.update({
          where: {
            id: createLikeCommentDto.comId,
          },
          data: {
            likeNumber: { increment: 1 },
          },
        });
    
        const result = await this.databaseService.likeComment.create({
          data: {
            userId: createLikeCommentDto.userId,
            commentId: createLikeCommentDto.comId,
          },
        });
        return result;
      } else {
        await this.databaseService.comment.update({
          where: {
            id: createLikeCommentDto.comId,
          },
          data: {
            likeNumber: { decrement: 1 },
          },
        });
        const result = await this.databaseService.likeComment.findFirst({
          where: {
            commentId: createLikeCommentDto.comId,
            userId: createLikeCommentDto.userId,
          },
        });
        const deleteResult = await this.databaseService.likeComment.delete({
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
