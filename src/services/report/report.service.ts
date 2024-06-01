import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CreateBanDto } from 'src/types/report/ban-create.dto';
import { CreateReportDto } from 'src/types/report/report-create.dto';
import * as bcrypt from 'bcrypt';
import { NotifyService } from '../notify/notify.service';
var slug = require('slug');
const saltOrRounds = 2;

const prisma = new PrismaClient();
@Injectable()
export class ReportService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly notifyServices: NotifyService,
  ) {}
  async handleCreateReport(createReportDto: CreateReportDto) {
    try {
      const list = [];
      createReportDto.content.map((text: number) => {
        list.push({
          userId: createReportDto.userId || null,
          content: text.toString(),
          postId: createReportDto.postId || null,
          commentId: createReportDto.commentId || null,
          userReport: createReportDto.userReport || null,
        });
      });
      if (
        createReportDto.userId ||
        createReportDto.postId ||
        createReportDto.commentId
      ) {
        return await this.databaseService.report.createMany({
          data: [...list],
        });
      } else {
        return null;
      }
    } catch (error) {
      return false;
    }
  }

  async handleGetPostReport(id: number) {
    try {
      const reportActions = prisma.report.findMany({
        where: { postId: id },
      });

      const countActions = Array.from({ length: 5 }, (_, i) =>
        prisma.report.count({
          where: { content: String(i + 1) },
        }),
      );

      const [report, ...counts] = await prisma.$transaction([
        reportActions,
        ...countActions,
      ]);

      const count = counts.reduce((acc, currentCount, index) => {
        acc[`reason${index + 1}`] = currentCount;
        return acc;
      }, {});

      return { report, count };
    } catch (error) {
      return false;
    }
  }
  async handleGetUserReport(id: number) {
    try {
      const reportActions = prisma.report.findMany({
        where: { userId: id },
        include: {
          UserReport: {
            select: {
              avatar: true,
              slug: true,
              id: true,
              userName: true,
            },
          },
        },
      });
      const userReportDetail = prisma.user.findUnique({
        where: { id: id },
        select: {
          avatar: true,
          slug: true,
          id: true,
          userName: true,
          email: true,
          gender: true,
          ban: true,
          createdAt: true,
        },
      });
      const countActions = Array.from({ length: 5 }, (_, i) =>
        prisma.report.count({
          where: {
            userId: id,
            content: String(i + 1),
          },
        }),
      );

      const [report, user, ...counts] = await prisma.$transaction([
        reportActions,
        userReportDetail,
        ...countActions,
      ]);

      const count = counts.reduce((acc, currentCount, index) => {
        acc[`reason${index + 1}`] = currentCount;
        return acc;
      }, {});

      return { report, user, count };
    } catch (error) {
      return false;
    }
  }
  async getReportAdminPage() {
    try {
      const usersWithSumOfReports = await prisma.user.findMany({
        select: {
          avatar: true,
          id: true,
          userName: true,
          slug: true,
          gender: true,
          ban: true,
          _count: {
            select: {
              FollowFrom: true,
              FollowTo: true,
              Posts: true,
              Reports: true,
            },
          },
          Posts: {
            select: {
              _count: {
                select: {
                  Reports: true,
                },
              },
            },
          },
          Comments: {
            select: {
              _count: {
                select: {
                  Reports: true,
                },
              },
            },
          },
        },
      });

      const usersWithSumOfPostReports = usersWithSumOfReports.map(
        (user: {
          id: any;
          slug: any;
          userName: any;
          avatar: any;
          ban: any;
          gender: any;
          _count: { Posts: any; FollowTo: any; FollowFrom: any; Reports: any };
          Posts: any[];
          Comments: any[];
        }) => ({
          id: user.id,
          slug: user.slug,
          userName: user.userName,
          avatar: user.avatar,
          countPost: user._count.Posts,
          countFollowed: user._count.FollowTo,
          countFollowing: user._count.FollowFrom,
          gender: user.gender,
          reportUserNumber: user._count.Reports,
          ban: user.ban,
          reportPostNumber: user.Posts.reduce(
            (sum: any, post: { _count: { Reports: any } }) =>
              sum + post._count.Reports,
            0,
          ),
          reportCommentNumber: user.Comments.reduce(
            (sum: any, post: { _count: { Reports: any } }) =>
              sum + post._count.Reports,
            0,
          ),
        }),
      );

      return usersWithSumOfPostReports;
    } catch (error) {
      return false;
    }
  }

  async handleBanUser(createBan: CreateBanDto) {
    if ((await this.comparePass(createBan.password)) === true) {
      try {
        const result = await this.databaseService.user.findUnique({
          where: {
            id: createBan.idUser,
          },
          select: {
            ban: true,
          },
        });
        if (!result.ban.includes('ACCOUNT')) {
          const update = await this.databaseService.user.update({
            where: {
              id: createBan.idUser,
            },
            data: {
              ban: result.ban.concat(' ACCOUNT').trim(),
            },
          });
          if (update) {
            return true;
          }
        } else {
          const update = await this.databaseService.user.update({
            where: {
              id: createBan.idUser,
            },
            data: {
              ban: result.ban.replace('ACCOUNT', ''),
            },
          });
          if (update) {
            return true;
          }
        }
      } catch (error) {
        return false;
      }
    } else {
      return null;
    }
  }
  async handleBanPost(createBan: CreateBanDto) {
    if ((await this.comparePass(createBan.password)) === true) {
      try {
        const result = await this.databaseService.user.findUnique({
          where: {
            id: createBan.idUser,
          },
          select: {
            ban: true,
          },
        });
        if (createBan.status) {
          const update = await this.databaseService.user.update({
            where: {
              id: createBan.idUser,
            },
            data: {
              ban: result.ban.concat(' POST').trim(),
            },
          });
          if (update) {
            await this.notifyServices.createNotifyBanPost(createBan.idUser);
            return true;
          }
        } else {
          const update = await this.databaseService.user.update({
            where: {
              id: createBan.idUser,
            },
            data: {
              ban: result.ban.replace('POST', ''),
            },
          });
          if (update) {
            await this.notifyServices.deleteNotifyBanPost(createBan.idUser);
            return true;
          }
        }
      } catch (error) {
        return false;
      }
    } else {
      return null;
    }
  }

  async handleBanComment(createBan: CreateBanDto) {
    if ((await this.comparePass(createBan.password)) === true) {
      try {
        const result = await this.databaseService.user.findUnique({
          where: {
            id: createBan.idUser,
          },
          select: {
            ban: true,
          },
        });
        if (createBan.status) {
          const update = await this.databaseService.user.update({
            where: {
              id: createBan.idUser,
            },
            data: {
              ban: result.ban.concat(' COMMENT').trim(),
            },
          });
          if (update) {
            await this.notifyServices.createNotifyBanCom(createBan.idUser);
            return true;
          }
        } else {
          const update = await this.databaseService.user.update({
            where: {
              id: createBan.idUser,
            },
            data: {
              ban: result.ban.replace('COMMENT', ''),
            },
          });
          if (update) {
            await this.notifyServices.deleteNotifyBanCom(createBan.idUser);

            return true;
          }
        }
      } catch (error) {
        return error;
      }
    } else {
      return null;
    }
  }
  async comparePass(pass: string) {
    const result = await this.databaseService.user.findUnique({
      where: {
        id: 2,
      },
    });
    const isMatch = await bcrypt.compare(pass, result.password);
    return isMatch;
  }
}
