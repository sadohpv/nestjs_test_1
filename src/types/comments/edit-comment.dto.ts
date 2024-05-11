import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EditCommentDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  content: string;
}
