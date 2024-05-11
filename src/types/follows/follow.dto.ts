import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateFollowDto {
  @IsNotEmpty()
  followFrom: number;

  @IsNotEmpty()
  followTo: number;

  @IsNotEmpty()
  @IsString()
  status: boolean;
}
