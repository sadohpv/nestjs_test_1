import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Ban, Prisma, Role } from '@prisma/client';

import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto, LoginUserDto } from 'src/types/users/create-user.dto';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
var slug = require('slug');
const saltOrRounds = 2;
@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const checkAccount = await this.findOneAccount(createUserDto.email);
    const checkPhone = await this.findOneAccount(createUserDto.phoneNumber);

    if (checkAccount === false) {
      if (checkPhone === false) {
        return {
          EC: 2,
          MS: 'Your phone number is already existed. Try another !',
        };
      } else {
        try {
          const checkSlug = await this.createSlug(createUserDto.userName);
          const passHash = await this.createHashPassword(
            createUserDto.password,
          );

          const result = await this.databaseService.user.create({
            data: {
              slug: checkSlug,
              email: createUserDto.email,
              password: passHash,
              userName: createUserDto.userName,
              phoneNumber: createUserDto.phoneNumber,
              gender: createUserDto.gender,
              address: createUserDto.address,
              avatar: '',
              ban: Ban.NONE,
              role: Role.USER,
            },
          });
          if (result) {
            return {
              EC: 0,
              MS: 'SUCCESS CREATE ACCOUNT !',
            };
          } else {
            return {
              EC: 4,
              MS: 'SOMETHING WRONG !',
            };
          }
        } catch (e) {
          return {
            EC: 4,
            MS: 'SOMETHING WRONG !',
          };
        }
      }
    } else {
      return {
        EC: 1,
        MS: 'Your account is already existed. Try another !',
      };
    }
  }

  async findOneAccount(email: string) {
    const result = await this.databaseService.user.findUnique({
      where: {
        email: email,
      },
    });

    if (result) {
      return true;
    } else {
      return false;
    }
  }
  async findOnePhone(phone: string) {
    const result = await this.databaseService.user.findUnique({
      where: {
        phoneNumber: phone,
      },
    });

    if (result) {
      return true;
    } else {
      return false;
    }
  }
  async findOneSlug(slug: string) {
    const result = await this.databaseService.user.findUnique({
      where: {
        slug: slug,
      },
    });
    if (result) {
      return true;
    } else {
      return false;
    }
  }

  async createSlug(value: string) {
    const random = Math.round(Math.random() * (0 - 100) + 1);
    const slugTemp = slug(`${value} ${random}`, '.');
    const checkSlug = await this.findOneSlug(slugTemp);
    if (checkSlug === false) {
      return slug(`${value} ${random}`, '.');
    } else {
      return this.createSlug(value);
    }
  }

  async createHashPassword(pass: string) {
    const hash = await bcrypt.hash(pass, saltOrRounds);
    return hash;
  }

  async comparePassword(pass: string, userPass: string) {
    const isMatch = await bcrypt.compare(pass, userPass);
    return isMatch;
  }
  async handleLoginEmail(loginUserDto: LoginUserDto) {
    const result = await this.databaseService.user.findUnique({
      where: {
        email: loginUserDto.account,
      },
    });

    if (result) {
      if (
        (await this.comparePassword(loginUserDto.password, result.password)) ===
        true
      ) {
        const payload = {
          id: result.id,
          slug: result.slug,
        };
        return {
          access_token: await this.jwtService.signAsync(payload),
        };
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  async handleLoginPhone(loginUserDto: LoginUserDto) {
    const result = await this.databaseService.user.findUnique({
      where: {
        phoneNumber: loginUserDto.account,
      },
    });
    if (result) {
      if (result.password) {
      }
    } else {
      return false;
    }
  }

  async handleRefreshToken(id: number) {
    const result = await this.databaseService.user.findUnique({
      where: {
        id: id,
      },
    });

    if (result) {
      const payload = {
        id: result.id,
        slug: result.slug,
      };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } else {
      return false;
    }
  }
  async handleGetOwnerData(id: number) {
    const result = await this.databaseService.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id:true,
        slug:true,
        userName:true,
        phoneNumber:true,
        gender:true,
        createdAt:true,
        avatar:true,
        address:true,
        email:true,
      },
    });
    
    return result;
  }
}
