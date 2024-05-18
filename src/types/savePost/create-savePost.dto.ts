import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSavePostDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  postId: number;

}
