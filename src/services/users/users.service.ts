import { Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { log } from 'console';
import { take } from 'rxjs';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createUserDto: Prisma.UserCreateInput) {
    return this.databaseService.user.create({
      data: createUserDto,
    });
  }

  async findAll(role?: Role) {
    if (role) {
      return this.databaseService.user.findMany({
        where: {
          role: role,
        },
      });
    }
    return this.databaseService.user.findMany();
  }

  async findOne(id: number) {
    return this.databaseService.user.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateUserDto: Prisma.UserUpdateInput) {
    return this.databaseService.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    return this.databaseService.user.delete({
      where: {
        id,
      },
    });
  }

  async suggestedFriend(id: number) {
    const listSuggested = await this.databaseService.user.findMany({
      where: {
        // NOT: {
        FollowTo: {
          every: {
            followFrom: {
              not: id,
            },
          },
          // }
        },
        NOT: {
          id: id,
        },
      },
      select: {
        email: true,
        id: true,
        slug: true,
        avatar: true,
        userName: true,
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

        FollowTo: {
          where: {
            followFrom: id,
          },
        },
      },
      take: 4,
    });

    return listSuggested;
  }

  async getDataForUserPage(slug: string, id: number) {
    try {
      let dataUserPage = await this.databaseService.user.findUnique({
        where: {
          slug: slug,
        },

        select: {
          email: true,
          id: true,
          slug: true,
          avatar: true,
          userName: true,
          address: true,
          gender: true,
          createdAt: true,
          phoneNumber: true,
          _count: {
            select: {
              FollowFrom: true,
              FollowTo: true,
              Posts: true,
            },
          },
          FollowTo: {
            where: {
              followFrom: id,
            },
          },
          FriendTo: {
            where: {
              userFrom: id,
            },
          },
          FriendFrom: {
            where: {
              userTo: id,
            },
          },
        },
      });

      return dataUserPage;
    } catch (e) {
      return false;
    }
  }
  async getSearchUser(keyword: string, id: number) {
    try {
      const keyList = keyword.split(' ');
      const listSearch = [];
      keyList.map((item) => {
        listSearch.push(
          {
            slug: {
              contains: item,
            },
          },
          {
            address: {
              contains: item,
            },
          },
          {
            email: {
              contains: item,
            },
          },
          {
            userName: {
              contains: item,
            },
          },
        );
      });
      let result = await this.databaseService.user.findMany({
        where: {
          OR: [
            ...listSearch,
            {
              slug: {
                contains: keyword,
                // in: keyList,
              },
            },
            {
              address: {
                contains: keyword,
              },
            },
            {
              email: {
                contains: keyword,
              },
            },
            {
              userName: {
                contains: keyword,
              },
            },
          ],
        },
        select: {
          email: true,
          id: true,
          slug: true,
          avatar: true,
          userName: true,
          address: true,
          gender: true,
          phoneNumber: true,
          FollowTo: {
            where: {
              followFrom: id,
            },
          },
        },
      });

      return result;
    } catch (e) {
      return [];
    }
  }
}
