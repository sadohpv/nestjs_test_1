import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ROLE } from './role.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsEmail()
  email: string;

  @IsEnum([ROLE.USER, ROLE.DEV, ROLE.ADMIN], {
    message: 'Valid role required',
  })
  role: Role;
}
