import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateCommentDto } from 'src/types/comments/create-comment.dto';
import { EditCommentDto } from 'src/types/comments/edit-comment.dto';
import { NotifyService } from '../notify/notify.service';

@Injectable()
export class CommentService {
  constructor(
    private readonly databaseService: DatabaseService,
    private notifyServices: NotifyService,
  ) {}

  async createComment(createCommentDto: CreateCommentDto) {
    try {
      const result = await this.databaseService.comment.create({
        data: {
          userId: createCommentDto.userId,
          postId: createCommentDto.postId,
          content: createCommentDto.content,
          likeNumber: 0,
        },
      });
      const list = createCommentDto.content
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
        createCommentDto.userId,
        find,
        result.id,
        createCommentDto.postId,
      );
      await this.databaseService.post.update({
        where: {
          id: createCommentDto.postId,
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
  async getComment(id: number) {
    try {
      const result = await this.databaseService.comment.findMany({
        where: {
          postId: id,
          author: {
            NOT: {
              ban: {
                contains: 'COMMENT',
              },
            },
          },
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
              slug: true,
              FollowTo: {
                where: {
                  followFrom: id,
                },
              },
              _count: {
                select: {
                  Posts: true,
                  FollowFrom: true,
                  FollowTo: true,
                },
              },
              Posts: {
                select: {
                  img: true,
                  typeFile: true,
                },
                take: 3,
              },
            },
          },
          ComInComs: {
            where: {
              author: {
                NOT: {
                  ban: {
                    contains: 'COMMENT',
                  },
                },
              },
            },
            include: {
              author: {
                select: {
                  id: true,
                  avatar: true,
                  userName: true,
                  slug: true,
                  FollowTo: {
                    where: {
                      followFrom: id,
                    },
                  },
                  _count: {
                    select: {
                      Posts: true,
                      FollowFrom: true,
                      FollowTo: true,
                    },
                  },
                  Posts: {
                    select: {
                      img: true,
                      typeFile: true,
                    },
                    take: 3,
                  },
                },
              },
            },
            orderBy: [
              {
                createdAt: 'desc',
              },
            ],
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
  async deleteComment(id: number) {
    try {
      const comment = await this.databaseService.comment.findUnique({
        where: {
          id,
        },
      });
      await this.databaseService.post.update({
        where: {
          id: comment.postId,
        },
        data: {
          commentNumber: { decrement: 1 },
        },
      });
      const list = comment.content
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
        comment.userId,
        find,
        id,
        comment.postId,
      );
      const result = await this.databaseService.comment.delete({
        where: {
          id,
        },
      });
      return result;
    } catch (e) {
      return false;
    }
  }
  async editComment(editCommentDto: EditCommentDto) {
    try {
      console.log(editCommentDto);
      return await this.databaseService.comment.update({
        where: {
          id: editCommentDto.id,
        },
        data: {
          content: editCommentDto.content,
        },
      });
    } catch (e) {
      return false;
    }
  }
}
