import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateFollowDto } from 'src/types/follows/follow.dto';
import { CreateLikeCommentDto } from 'src/types/like-comments/create-like-comment.dto';

@Injectable()
export class FollowService {
  constructor(private readonly databaseService: DatabaseService) {}

  async followAndUnfollow(createFollowDto: CreateFollowDto) {
    try {
      if (createFollowDto.status) {
        const result = await this.databaseService.follow.create({
          data: {
            followFrom: createFollowDto.followFrom,
            followTo: createFollowDto.followTo,
          },
        });
        return result;
      } else {
        const result = await this.databaseService.follow.findFirst({
          where: {
            followFrom: createFollowDto.followFrom,
            followTo: createFollowDto.followTo,
          },
        });
        return await this.databaseService.follow.delete({
          where: {
            id: result.id,
          },
        });
      }
    } catch (e) {
      return false;
    }
  }
}
