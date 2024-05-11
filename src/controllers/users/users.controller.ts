import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Ip,
  UsePipes,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import { UsersService } from 'src/services/users/users.service';
import { Prisma, Role } from '@prisma/client';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { LoggerService } from 'src/logger/logger.service';
import { CreateUserDto } from 'src/types/users/create-user.dto';
import { Request } from 'express';

@SkipThrottle() // skip limit request per time
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  private readonly logger = new LoggerService(UsersController.name);

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createUserDto: CreateUserDto) {}

  @SkipThrottle({ default: false }) // skip limit request per time
  @Get()
  findAll(@Ip() ip: string, @Query('role') role?: Role) {
    this.logger.log(`Request for all users\t${ip}`, UsersController.name);

    return this.usersService.findAll(role);
  }

  @Throttle({
    short: {
      ttl: 1000,
      limit: 3,
    },
  }) // Overwrite throttle or create a new throttle
  @Get('owner')
  findOne(@Req() request: Request) {
    console.log(request);
    // return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: Prisma.UserUpdateInput,
  ) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Get('suggested/:id')
  getSuggestedFriend(@Param('id') id: string) {
    return this.usersService.suggestedFriend(+id);
  }

  @Get('userPage/:slug/:id')
  getDataForUserPage(@Param('id') id: number, @Param('slug') slug: string) {
    return this.usersService.getDataForUserPage(slug, +id);
  }

  @Get('search/:id/:keyword')
  getSearchUser(@Param('keyword') keyword: string, @Param('id') id: number) {
    return this.usersService.getSearchUser(keyword,+id);
  }
}
