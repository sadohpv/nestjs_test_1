import { Injectable } from '@nestjs/common';
import { from } from 'rxjs';
import { DatabaseService } from 'src/database/database.service';
import { CreateNotifyDto } from 'src/types/notify/create-notify.dto';

@Injectable()
export class NotifyService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createNotifyAddFriend(createNotifyDto: CreateNotifyDto) {
    try {
      const result = await this.databaseService.notify.create({
        data: {
          userFrom: createNotifyDto.userFrom,
          userTo: createNotifyDto.userTo,
          type: 'ADDFRIEND',
          content: createNotifyDto.content,
        },
      });

      return result;
    } catch (e) {
      return false;
    }
  }
  async getAllNotify(id: number) {
    try {
      console.log(id);
      const result = await this.databaseService.notify.findMany({
        where: {
          userTo: id,
        },
        include: {
          UserFrom: {
            select: {
              id: true,
              email: true,
              slug: true,
              avatar: true,
              userName: true,
            },
          },
        },
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
      });

      return result;
    } catch (e) {
      return false;
    }
  }

  async createNotifyComment(
    userFrom: any,
    userTo: any,
    idComment: number,
    idPost: number,
  ) {
    try {
      const list = [];
      userTo.map((item: any) => {
        list.push({
          userFrom: userFrom,
          userTo: item.id,
          type: 'COMMENT',
          status: 'UNREAD',
          content: `${idComment} ${idPost}`,
        });
      });
      // console.log(list);
      const result = await this.databaseService.notify.createMany({
        data: [...list],
      });

      return result;
    } catch (e) {
      return false;
    }
  }

  async readNotify(id: any) {
    try {
      const result = await this.databaseService.notify.update({
        where: {
          id: id,
        },
        data: {
          status: 'READ',
        },
      });
      return result;
    } catch (e) {
      return false;
    }
  }
  async deleteNotifyFriend(userFrom: any, userTo: any) {
    try {
      const find = await this.databaseService.notify.findFirst({
        where: {
          userFrom: userFrom,
          userTo: userTo,
          type: 'ADDFRIEND',
        },
      });
      const result = await this.databaseService.notify.delete({
        where: {
          id: find.id,
        },
      });
      return result;
    } catch (e) {
      return false;
    }
  }

  async deleteNotifyComment(
    userFrom: any,
    userTo: any,
    idComment: any,
    idPost: any,
  ) {
    try {
      const list = [];
      userTo.map((item: any) => {
        list.push(item.id);
      });
      const userArray = [];
      await this.databaseService.notify
        .findMany({
          where: {
            userFrom: userFrom,
            userTo: {
              in: list,
            },
            type: 'COMMENT',
            content: `${idComment} ${idPost}`,
          },
          select: {
            id: true,
          },
        })
        .then((response) => {
          response.map((item) => {
            userArray.push(item.id);
          });
        });

      const result = await this.databaseService.notify.deleteMany({
        where: {
          id: { in: userArray },
        },
      });
      return result;
    } catch (e) {
      return false;
    }
  }
  async deletePostNotifyComment(listIdComment: any, idPost: any) {
    try {
      const checkNotify = [];
      listIdComment.map((comment: any) => {
        checkNotify.push(`${comment} ${idPost}`);
      });
      const listNotifyDelete = await this.databaseService.notify
        .findMany({
          where: {
            type: 'COMMENT',
            content: {
              in: checkNotify,
            },
          },
        })
        .then((notifies) => {
          return notifies.map((notify) => notify.id);
        });
      const result = await this.databaseService.notify.deleteMany({
        where: {
          id: {
            in: listNotifyDelete,
          },
        },
      });
      return result;
    } catch (e) {
      return false;
    }
  }
}
