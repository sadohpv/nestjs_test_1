import {
  Body,
  Controller,
  Get,
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
import { Response, Request } from 'express';
import { PublicRoute } from 'src/modules/auth/public.decorator';
import { JwtService } from '@nestjs/jwt';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}
  private readonly logger = new LoggerService(AuthController.name);

  @PublicRoute()
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
  @PublicRoute()
  @Post('login')
  @UsePipes(ValidationPipe)
  async loginUser(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    if (loginUserDto) {
      let result: any = {};
      if (loginUserDto.type === false) {
        result = await this.authService.handleLoginEmail(loginUserDto);
      } else {
        result = await this.authService.handleLoginPhone(loginUserDto);
      }
      if (result !== false) {
        this.logger.log(`Request for login user `, AuthController.name);
        res.cookie('accessToken', result.access_token, {
          expires: new Date(Date.now() + 10000 * 60 * 60 * 24 * 7),
          httpOnly: true,
        });
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

  @PublicRoute()
  @Get('checkToken')
  async CheckToken(@Res() res: Response, @Req() request: Request) {
    this.logger.log(
      `Request for refresh data and token user `,
      AuthController.name,
    );
    const token = request.cookies.accessToken;

    if (!token) {
      res.clearCookie('accessToken');
      return res.status(HttpStatus.UNAUTHORIZED).send({ EC: 401 });
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'KUSAKARI',
      });

      if (payload.id && typeof payload.id == 'number') {
        const result = await this.authService.handleRefreshToken(payload.id);

        if (result === false) {
          res.clearCookie('accessToken');
          return res.status(HttpStatus.UNAUTHORIZED).send({ EC: 401 });
        } else {
          res.cookie('accessToken', result.access_token, {
            expires: new Date(Date.now() + 10000 * 60 * 60 * 24 * 7),
            httpOnly: true,
          });
          const user = await this.authService.handleGetOwnerData(payload.id);
          return res.status(HttpStatus.ACCEPTED).send({ EC: 0, data: user });
        }
      } else {
        res.clearCookie('accessToken');
        return res.status(HttpStatus.UNAUTHORIZED).send({ EC: 401 });
      }
    } catch (e) {
      res.clearCookie('accessToken');
      return res.status(HttpStatus.UNAUTHORIZED).send({ EC: 401 });
    }
  }
}
