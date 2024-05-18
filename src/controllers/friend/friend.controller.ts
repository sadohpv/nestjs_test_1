import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { LoggerService } from 'src/logger/logger.service';
import { PublicRoute } from 'src/modules/auth/public.decorator';
import { FriendService } from 'src/services/friend/friend.service';
import { CreateFriendDto } from 'src/types/friends/friend-create.dto';

@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}
  private readonly logger = new LoggerService(FriendService.name);

  @PublicRoute()
  @Post('')
  async createFriendRequest(
    @Body() friendData: CreateFriendDto,
    @Res() res: Response,
  ) {
    const result = await this.friendService.createFriendRequest(friendData);
    if (result) {
      return res.status(HttpStatus.OK).send({ result });
    } else {
      return res.status(HttpStatus.FORBIDDEN).send({ result });
    }
  }
  @PublicRoute()
  @Post('/accept')
  async acceptFriend(
    @Body() friendData: CreateFriendDto,
    @Res() res: Response,
  ) {
    const result = await this.friendService.acceptFriend(friendData);
    if (result) {
      return res.status(HttpStatus.OK).send({ result });
    } else {
      return res.status(HttpStatus.FORBIDDEN).send({ result });
    }
  }
  @PublicRoute()
  @Get('/mention/:id')
  async getFriendForMentionComment(
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    const result = await this.friendService.getFriendForMentionComment(+id);
    if (result) {
      return res.status(HttpStatus.OK).send({ result });
    } else {
      return res.status(HttpStatus.FORBIDDEN).send({ result });
    }
  }

  @PublicRoute()
  @Get('/all/:id')
  async getAllFriend(@Param('id') id: number, @Res() res: Response) {
    const result = await this.friendService.getAllFriend(+id);
    if (result) {
      return res.status(HttpStatus.OK).send({ result });
    } else {
      return res.status(HttpStatus.FORBIDDEN).send({ result });
    }
  }
}
