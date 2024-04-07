import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateLikePostDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  postId: number;

  @IsNotEmpty()
  @IsString()
  content: string;
}
