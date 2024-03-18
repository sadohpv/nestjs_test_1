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
import { CreateUserDto, LoginUserDto } from 'src/types/users/create-user.dto';
import { Response } from 'express';
// import { Public } from 'src/modules/auth/auth.module';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  private readonly logger = new LoggerService(AuthController.name);

  // @Public()
  @Post('register')
  @UsePipes(ValidationPipe)
  async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    if (createUserDto) {
      const result = await this.authService.create(createUserDto);
      this.logger.log(`Request for register user `, AuthController.name);
      return res.status(HttpStatus.CREATED).send({ result });
    } else {
      this.logger.log(`Loss data`, AuthController.name);
      return res.status(HttpStatus.BAD_REQUEST).send();
    }
  }
  // @Public()
  @Post('login')
  @UsePipes(ValidationPipe)
  async loginUser(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    if (loginUserDto) {
      let result = {};
      if (loginUserDto.type === false) {
        result = await this.authService.handleLoginEmail(loginUserDto);
      } else {
        result = await this.authService.handleLoginPhone(loginUserDto);
      }
      if (result !== false) {
        this.logger.log(`Request for register user `, AuthController.name);
        return res.status(HttpStatus.CREATED).send({ result });
      } else {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .send({ EC: 1, MS: 'WRONG EMAIL OR PASSWORD!' });
      }
    } else {
      this.logger.log(`Loss data`, AuthController.name);
      return res.status(HttpStatus.BAD_REQUEST).send();
    }
  }
}
