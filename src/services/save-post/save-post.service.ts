import { Injectable } from '@nestjs/common';
import { response } from 'express';
import { DatabaseService } from 'src/database/database.service';
import { CreateSavePostDto } from 'src/types/savePost/create-savePost.dto';

@Injectable()
export class SavePostService {
  constructor(private readonly databaseService: DatabaseService) {}

  async handleSavePost(savePostDto: CreateSavePostDto) {
    try {
      const save = await this.databaseService.savePost.create({
        data: {
          postId: savePostDto.postId,
          userId: savePostDto.userId,
        },
      });
      return save;
    } catch (error) {
      return false;
    }
  }

  async handleDeleteSavePost(savePostDto: CreateSavePostDto) {
    try {
      const find = await this.databaseService.savePost.findFirst({
        where: {
          postId: savePostDto.postId,
          userId: savePostDto.userId,
        },
      });

      const result = await this.databaseService.savePost.delete({
        where: {
          id: find.id,
        },
      });
      return result;
    } catch (error) {
      return false;
    }
  }
}
