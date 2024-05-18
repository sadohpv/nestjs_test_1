import { Injectable } from '@nestjs/common';
import slug from 'slug';
import { DatabaseService } from 'src/database/database.service';
import { CreateFriendDto } from 'src/types/friends/friend-create.dto';
import { NotifyService } from '../notify/notify.service';
import { retry } from 'rxjs';

@Injectable()
export class FriendService {
  constructor(
    private readonly databaseService: DatabaseService,
    private notifyService: NotifyService,
  ) {}

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
        const notifyMake = this.notifyService.createNotifyAddFriend({
          userFrom: createFriendDto.userFrom,
          userTo: createFriendDto.userTo,
          type: 'ADDFRIEND',
          content: 'REQUIRED',
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
        await this.notifyService.deleteNotifyFriend(
          createFriendDto.userFrom,
          createFriendDto.userTo,
        );
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

  async getAllFriend(id: number) {
    try {
      const friend = await this.databaseService.friend.findMany({
        where: {
          OR: [
            {
              userTo: id,
            },
            {
              userFrom: id,
            },
          ],
        },
        include: {
          UserFrom: {
            where: {
              NOT: {
                id: id,
              },
            },
            select: {
              id: true,
              slug: true,
              email: true,
              avatar: true,
              address: true,
              userName: true,
              FollowTo: {
                where: {
                  followFrom: id,
                },
              },
            },
          },
          UserTo: {
            where: {
              NOT: {
                id: id,
              },
            },
            select: {
              id: true,
              slug: true,
              email: true,
              avatar: true,
              address: true,
              userName: true,
              FollowTo: {
                where: {
                  followFrom: id,
                },
              },
            },
          },
        },
      });

      return friend;
    } catch (error) {
      return false;
    }
  }
}
