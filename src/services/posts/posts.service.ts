import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CreatePostDto } from 'src/types/posts/create-post.dto';
import { LikePostDto } from 'src/types/posts/like-post.dto';
import { UpdatePostDto } from 'src/types/posts/update-post-dto';
// import { cloudinary } from '../../../src/utils/cloudinary';
import cloudinary from 'src/utils/cloudinary';
@Injectable()
export class PostsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createPost(createPostDto: CreatePostDto) {
    if (await this.checkAuthor(createPostDto.userId)) {
      let storageImg: any = {};
      if (createPostDto.typeFile) {
        storageImg = await cloudinary.uploader.upload_large(createPostDto.img, {
          folder: 'social_data',
          resource_type: 'video',
        });
      } else {
        storageImg = await cloudinary.uploader.upload_large(createPostDto.img, {
          folder: 'social_data',
          resource_type: 'image',
        });
      }

      const result = await this.databaseService.post.create({
        data: {
          content: createPostDto.content,
          img: storageImg.url,
          userId: createPostDto.userId,
          commentNumber: 0,
          likeNumber: 0,
          shareNumber: 0,
          typeFile: createPostDto.typeFile,
          published: false,
          sharePostId: createPostDto.sharedPost,
        },
      });
      if (createPostDto.sharedPost) {
        await this.sharedPostNumber(createPostDto.sharedPost);
      }
      return result;
    } else {
      return false;
    }
  }

  async checkAuthor(id: number) {
    const result = await this.databaseService.user.findUnique({
      where: {
        id: id,
      },
    });
    if (result) {
      return true;
    } else {
      return false;
    }
  }

  async findOnePost(id: number) {
    return this.databaseService.post.findMany({
      where: {
        id: id,
      },
      include: {
        prevPost: true,
      },
    });
  }

  async findAllPost() {
    return this.databaseService.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            avatar: true,
            userName: true,
            slug: true,
          },
        },
      },
      orderBy: [
        {
          createdAt: 'desc',
        },
        {
          likeNumber: 'desc',
        },
      ],
    });
  }

  async updatePost(id: number, updatePostDto: UpdatePostDto) {
    const checkAuthor = await this.databaseService.post.findUnique({
      where: {
        id,
        userId: updatePostDto.userId,
      },
    });
    if (checkAuthor) {
      try {
        const result = await this.databaseService.post.update({
          where: {
            id,
            userId: updatePostDto.userId,
          },
          data: updatePostDto,
        });
        if (result) {
          return result;
        } else {
          return false;
        }
      } catch {
        return false;
      }
    } else {
      return false;
    }
  }
  async likeAndUnlikePost(id: number, like: LikePostDto) {
    const getPost = await this.databaseService.post.findUnique({
      where: {
        id,
      },
    });
    if (getPost) {
      try {
        const result = await this.databaseService.post.update({
          where: {
            id,
          },
          data: {
            likeNumber: like.like
              ? ++getPost.likeNumber
              : getPost.likeNumber > 0
                ? --getPost.likeNumber
                : 0,
          },
        });
        if (result) {
          return result;
        } else {
          return false;
        }
      } catch {
        return false;
      }
    } else {
      return false;
    }
  }

  async sharedPostNumber(id: number) {
    const getPost = await this.databaseService.post.findUnique({
      where: {
        id,
        published: false,
      },
    });
    if (getPost) {
      try {
        const result = await this.databaseService.post.update({
          where: {
            id,
          },
          data: {
            shareNumber: ++getPost.shareNumber,
          },
        });

        if (result) {
          return result;
        } else {
          return false;
        }
      } catch {
        return false;
      }
    } else {
      return false;
    }
  }

  async checkLikePost(id: number) {
    try {
      const result = await this.databaseService.likePost.findMany({
        where: {
          userId: id,
        },
        select: {
          postId: true,
        },
      });

      if (result) {
        return result.map((post) => post.postId);
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }
  async getGuestPost(slug: string) {
    const result = await this.databaseService.post.findMany({
      where: {
        author: {
          slug: slug,
        },
      },
    });
    return result;
  }
  async getListLikePost(idPost: number, idUser: number) {
    const result = await this.databaseService.likePost.findMany({
      where: {
        postId: idPost,
      },
      include: {
        User: {
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
                author: {
                  id: +idUser,
                },
              },
              select: {
                img: true,
                typeFile: true,
              },
              take: 3,
            },
            FollowTo: {
              where: {
                followFrom: +idUser,
              },
            },
          },
        },
      },
    });
    return result;
  }
}
