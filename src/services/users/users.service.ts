import { Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { log } from 'console';
import { async, take } from 'rxjs';
import * as bcrypt from 'bcrypt';

import { DatabaseService } from 'src/database/database.service';
import {
  UpdateAvatarUserDto,
  UpdatePasswordUserDto,
  UpdateUserDto,
} from 'src/types/users/update-user.dto';
import cloudinary from 'src/utils/cloudinary';
const saltOrRounds = 2;

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

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      switch (updateUserDto.editId) {
        case 1:
          await this.databaseService.user.update({
            where: {
              id,
            },
            data: {
              userName: updateUserDto.data,
            },
          });
          break;
        case 2:
          await this.databaseService.user.update({
            where: {
              id,
            },
            data: {
              address: updateUserDto.data,
            },
          });
          break;

        case 3:
          await this.databaseService.user.update({
            where: {
              id,
            },
            data: {
              gender: updateUserDto.data,
            },
          });
          break;
        default:
          return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  async remove(id: number) {
    return this.databaseService.user.delete({
      where: {
        id,
      },
    });
  }

  async updatePassword(updatePassUserDto: UpdatePasswordUserDto) {
    try {
      const user = await this.databaseService.user.findUnique({
        where: {
          id: updatePassUserDto.idUser,
        },
      });
      const checkNotChange = await this.comparePassword(
        updatePassUserDto.newPass,
        user.password,
      );
      if (checkNotChange) {
        return { EC: 0 };
      }
      const checkPass = await this.comparePassword(
        updatePassUserDto.currentPass,
        user.password,
      );
      if (checkPass) {
        const newPass = await this.createHashPassword(
          updatePassUserDto.newPass,
        );
        const result = await this.databaseService.user.update({
          where: {
            id: updatePassUserDto.idUser,
          },
          data: {
            password: newPass,
          },
        });
        return result;
      } else {
        return {
          EC: 1,
        };
      }
    } catch (e) {
      return false;
    }
  }
  async createHashPassword(pass: string) {
    const hash = await bcrypt.hash(pass, saltOrRounds);
    return hash;
  }

  async comparePassword(pass: string, userPass: string) {
    const isMatch = await bcrypt.compare(pass, userPass);
    return isMatch;
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
          where: {
            OR: [
              {
                published: false,
              },
              {
                author: {
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
              },
            ],
          },
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
          Posts: {
            select: {
              img: true,
              typeFile: true,
            },
            take: 3,
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
  async getUserForSetting(id: number) {
    try {
      let result = await this.databaseService.user.findUnique({
        where: {
          id: id,
        },
        select: {
          avatar: true,
          email: true,
          userName: true,
          address: true,
          gender: true,
          phoneNumber: true,
          slug: true,
        },
      });
      return result;
    } catch (e) {
      return false;
    }
  }
  async updateAvatar(updateAvatarUserDto: UpdateAvatarUserDto) {
    try {
      const storageImg = await cloudinary.uploader.upload_large(
        updateAvatarUserDto.img,
        {
          folder: 'social_data',
          resource_type: 'image',
        },
      );
      const result = await this.databaseService.user.update({
        where: {
          id: updateAvatarUserDto.idUser,
        },
        data: {
          avatar: storageImg.url,
        },
      });

      return result;
    } catch (e) {
      return false;
    }
  }
}
