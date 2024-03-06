import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { UsersService } from './users.service';

@Controller('users') // /users routes
export class UsersController {
  /*
 GET /users
 GET /users/:slug
 POST /users
 PUT /users/:id  => Update toàn bộ 
 PATCH /users/:id => Update một phần
 DELETE /users/:id
 */

  constructor(private readonly usersService: UsersService) {}

  @Get() // GET /?role=SOMETHING => Query
  findAll(@Query('role') role?: 'INTERN' | 'ENGINEER' | 'ADMIN') {
    return this.usersService.findAll(role);
  }
  //   @Get('/something') // GET /users/something
  //   getSomething() {
  //     return [];
  //   }
  @Get(':id') // GET /users/:slug
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Post() //POST /users
  create(
    @Body()
    user: {
      name: string;
      email: string;
      role: 'INTERN' | 'ENGINEER' | 'ADMIN';
    },
  ) {
    return this.usersService.create(user);
  }

  @Patch(':id') // PATCH /users/:id
  update(
    @Param('id') id: string,
    @Body()
    userUpdate: {
      name?: string;
      email?: string;
      role?: 'INTERN' | 'ENGINEER' | 'ADMIN';
    },
  ) {
    return this.usersService.update(+id, userUpdate);
  }
  @Delete(':id') //DELETE /users/:id
  delete(@Param() id: string) {
    return this.usersService.delete(+id);
  }
}
