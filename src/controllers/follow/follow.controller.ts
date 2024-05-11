
import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';
import { PublicRoute } from 'src/modules/auth/public.decorator';

import { Response } from 'express';
import { CreateFollowDto } from 'src/types/follows/follow.dto';
import { FollowService } from 'src/services/follow/follow.service';
@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}
  private readonly logger = new LoggerService(FollowController.name);

  @PublicRoute()
  @Post('')
  async followAndUnfollow(
    @Body() followData: CreateFollowDto,
    @Res() res: Response,
  ) {
    const result = await this.followService.followAndUnfollow(followData);
    if (result) {
      return res.status(HttpStatus.OK).send({ result });
    } else {
      return res.status(HttpStatus.FORBIDDEN).send({ result });
    }
  }
}
