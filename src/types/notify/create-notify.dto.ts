import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateNotifyDto {
  @IsNotEmpty()
  userFrom: number;

  @IsNotEmpty()
  userTo: number;

  @IsNotEmpty()
  type: string;

  content?: string;
}
