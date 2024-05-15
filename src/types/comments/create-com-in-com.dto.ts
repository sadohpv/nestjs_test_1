import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateComInComDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  commentId: number;


  @IsNotEmpty()
  postId: number;

  @IsNotEmpty()
  @IsString()
  content: string;
}
