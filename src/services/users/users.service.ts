import { Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { log } from 'console';
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
    const listUser = [2];
    const listSuggested = await this.databaseService.user.findMany({
      where: {
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
      },
      take: 4,
    });
    const result = [];
    await Promise.all(
      listSuggested.map(async (item: any) => {
        item.countPost = await this.getCountPost(item.id);
        item.countFollowing = await this.getCountFollowing(item.id);
        item.countFollower = await this.getCountFollower(item.id);
        return result.push(item);
      }),
    );
    console.log(result);
    return result;
  }
  async getCountPost(id: number) {
    let countPost = await this.databaseService.post.count({
      where: {
        userId: id,
      },
    });
    return countPost;
  }
  async getCountFollower(id: number) {
    let countFollower = await this.databaseService.follow.count({
      where: {
        followTo: id,
      },
    });
    return countFollower;
  }
  async getCountFollowing(id: number) {
    let countFollowing = await this.databaseService.follow.count({
      where: {
        followFrom: id,
      },
    });
    return countFollowing;
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
        },
      });
      const result: any = dataUserPage;
      await Promise.all([
        this.getCountPost(dataUserPage.id).then(
          (count) => (result.countPost = count),
        ),
        this.getCountFollowing(dataUserPage.id).then(
          (count) => (result.countFollowing = count),
        ),
        this.getCountFollower(dataUserPage.id).then(
          (count) => (result.countFollower = count),
        ),
      ]);
    
      return result;
    } catch (e) {
      return false;
    }
  }
}
