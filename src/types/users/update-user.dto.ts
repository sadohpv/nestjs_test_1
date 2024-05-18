import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsNumber()
  editId: number;

  @IsNotEmpty()
  data: any;
}

export class UpdatePasswordUserDto {
  @IsNotEmpty()
  currentPass: any;

  @IsNotEmpty()
  newPass: any;

  @IsNotEmpty()
  @IsNumber()
  idUser: number;
}

export class UpdateAvatarUserDto {
  @IsNotEmpty()
  @IsNumber()
  idUser: number;
  @IsNotEmpty()
  @IsString()
  img: string;
}
