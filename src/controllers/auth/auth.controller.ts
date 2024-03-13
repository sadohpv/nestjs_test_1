import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';
import { AuthService } from 'src/services/auth/auth.service';
import { CreateUserDto } from 'src/types/users/create-user.dto';
import {Response} from "express"
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  private readonly logger = new LoggerService(AuthController.name);

  @Post("register")
//   @UsePipes(ValidationPipe)
  createUser(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
   
  ) {
   
    console.log("body",createUserDto);

    this.logger.log(`Request for register user `, AuthController.name);
    return res.status(HttpStatus.CREATED).send();
  }
}
