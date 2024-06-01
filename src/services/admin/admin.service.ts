import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AdminService {
  constructor(private readonly databaseService: DatabaseService) {}
  async handleGetPostReport() {
    try {
      const posts = await this.databaseService.user.findMany({
        select: {
          avatar: true,
          id: true,
          userName: true,
          email: true,
          ban: true,
          slug: true,
          Posts: {
            include: {
              Reports: true,
            },
          },
        },
      });
      return posts;
    } catch (error) {
      return false;
    }
  }
  async handleGetCommentReport() {
    try {
      const posts = await this.databaseService.user.findMany({
        select: {
          avatar: true,
          id: true,
          userName: true,
          email: true,
          ban: true,
          slug: true,
          Comments: {
            include: {
              Reports: true,
            },
          },
        
        },
      });
      return posts;
    } catch (error) {
      return false;
    }
  }
}
