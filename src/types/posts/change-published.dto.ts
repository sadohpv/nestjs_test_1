import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ChangePublishedPostDto {
  @IsBoolean()
  published: boolean;

  @IsNotEmpty()
  @IsNumber()
  postId: number;
}
