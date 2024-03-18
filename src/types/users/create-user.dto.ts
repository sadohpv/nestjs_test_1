import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsBoolean()
  gender: boolean;
}

export class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  account: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsBoolean()
  type: boolean;
}