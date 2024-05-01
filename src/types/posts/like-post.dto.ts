import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class LikePostDto {
  @IsBoolean()
  like: boolean;

  @IsNotEmpty()
  @IsNumber()
  userId: number;
  
  @IsNotEmpty()
  @IsNumber()
  postId: number;
}
