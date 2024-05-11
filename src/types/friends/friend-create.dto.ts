import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateFriendDto {
  @IsNotEmpty()
  userFrom: number;

  @IsNotEmpty()
  userTo: number;

  @IsBoolean()
  status: boolean;
}
