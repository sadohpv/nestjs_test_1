import { Injectable } from '@nestjs/common';
import { CreateComInComDto } from 'src/types/comments/create-com-in-com.dto';
import { NotifyService } from '../notify/notify.service';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ComincomService {
  constructor(
    private readonly databaseService: DatabaseService,
    private notifyServices: NotifyService,
  ) {}

  async createComInCom(createComInComDto: CreateComInComDto) {
    try {
      const result = await this.databaseService.comInCom.create({
        data: {
          userId: createComInComDto.userId,
          commentId: createComInComDto.commentId,
          content: createComInComDto.content,
          likeNumber: 0,
        },
      });
      const list = createComInComDto.content
        .split('@t@g')
        .map((item) => {
          if (item.includes('@')) {
            return item.substring(1);
          } else {
            return;
          }
        })
        .filter((item) => item);

      const find = await this.databaseService.user.findMany({
        where: {
          slug: {
            in: list,
          },
        },
        select: {
          id: true,
        },
      });
      await this.notifyServices.createNotifyComment(
        createComInComDto.userId,
        find,
        result.id,
        createComInComDto.postId,
      );
      await this.databaseService.post.update({
        where: {
          id: createComInComDto.postId,
        },
        data: {
          commentNumber: { increment: 1 },
        },
      });

      return result;
    } catch (e) {
      return false;
    }
  }

  async deleteComInCom(id: number) {
    try {  
      const comincom = await this.databaseService.comInCom.findUnique({
        where: {
          id,
        },
        include: {
          Comment: true,
        },
      });
      await this.databaseService.post.update({
        where: {
          id: +comincom.Comment.postId,
        },
        data: {
          commentNumber: { decrement: 1 },
        },
      });
      const list = comincom.content
        .split('@t@g')
        .map((item) => {
          if (item.includes('@')) {
            return item.substring(1);
          } else {
            return;
          }
        })
        .filter((item) => item);
      const find = await this.databaseService.user.findMany({
        where: {
          slug: {
            in: list,
          },
        },
        select: {
          id: true,
        },
      });
      await this.notifyServices.deleteNotifyComment(
        comincom.userId,
        find,
        id,
        comincom.Comment.postId,
      );
      const result = await this.databaseService.comInCom.delete({
        where: {
          id,
        },
      });
      return result;
    } catch (e) {
      return false;
    }
  }
}
