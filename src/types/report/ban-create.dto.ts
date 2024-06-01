import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBanDto {
  idUser: number;
  status: boolean;
  @IsNotEmpty()
  password: string;
}
