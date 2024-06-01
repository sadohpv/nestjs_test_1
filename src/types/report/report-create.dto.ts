import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReportDto {
  userId: number;
  postId: number;
  commentId: number;
  content: number[];
  userReport: number;
}
