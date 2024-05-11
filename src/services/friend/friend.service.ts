import { Injectable } from '@nestjs/common';
import slug from 'slug';
import { DatabaseService } from 'src/database/database.service';
import { CreateFriendDto } from 'src/types/friends/friend-create.dto';

@Injectable()
export class FriendService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createFriendRequest(createFriendDto: CreateFriendDto) {
    try {
      if (createFriendDto.status) {
        const result = await this.databaseService.friend.create({
          data: {
            userFrom: createFriendDto.userFrom,
            userTo: createFriendDto.userTo,
            status: 'REQUIRED',
          },
        });
        return result;
      } else {
        const result = await this.databaseService.friend.findFirst({
          where: {
            OR: [
              {
                userFrom: createFriendDto.userFrom,
                userTo: createFriendDto.userTo,
              },
              {
                userFrom: createFriendDto.userTo,
                userTo: createFriendDto.userFrom,
              },
            ],
          },
        });

        return await this.databaseService.friend.delete({
          where: {
            id: result.id,
          },
        });
      }
    } catch (e) {
      return false;
    }
  }
  async acceptFriend(createFriendDto: CreateFriendDto) {
    try {
      const result = await this.databaseService.friend.updateMany({
        where: {
          OR: [
            {
              userFrom: createFriendDto.userFrom,
              userTo: createFriendDto.userTo,
            },
            {
              userFrom: createFriendDto.userTo,
              userTo: createFriendDto.userFrom,
            },
          ],
        },
        data: {
          status: 'ACCEPTED',
        },
      });

      return result;
    } catch (e) {
      return false;
    }
  }
  async getFriendForMentionComment(id: any) {
    try {
      console.log(id);
      const result = await this.databaseService.user.findMany({
        where: {
          OR: [
            {
              FriendFrom: {
                some: {
                  userTo: id,
                  status: 'ACCEPTED',
                },
              },
            },
            {
              FriendTo: {
                some: {
                  userFrom: id,
                  status: 'ACCEPTED',
                },
              },
            },
          ],
        },
        select: {
          id: true,
          slug: true,
          email: true,
          avatar: true,
          address: true,
          userName: true,
        },
      });
      return result;
    } catch (e) {
      return false;
    }
  }
}
