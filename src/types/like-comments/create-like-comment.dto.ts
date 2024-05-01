import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateLikeCommentDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  comId: number;

  @IsBoolean()
  like: boolean;
}
