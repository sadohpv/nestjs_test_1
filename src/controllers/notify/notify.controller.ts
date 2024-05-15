import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { LoggerService } from 'src/logger/logger.service';
import { PublicRoute } from 'src/modules/auth/public.decorator';
import { NotifyService } from 'src/services/notify/notify.service';

@Controller('notify')
export class NotifyController {
  constructor(private readonly notifyService: NotifyService) {}
  private readonly logger = new LoggerService(NotifyService.name);

  @PublicRoute()
  @Get(':id')
  async getAllNotify(@Res() res: Response, @Param('id') id: number) {
    const result = await this.notifyService.getAllNotify(+id);
    if (result) {
      return res.status(HttpStatus.OK).send({ result });
    } else {
      return res.status(HttpStatus.FORBIDDEN).send({ result });
    }
  }
  @PublicRoute()
  @Get('read/:id')
  async readNotify(@Res() res: Response, @Param('id') id: number) {
    const result = await this.notifyService.readNotify(+id);
    if (result) {
      return res.status(HttpStatus.OK).send({ result });
    } else {
      return res.status(HttpStatus.FORBIDDEN).send({ result });
    }
  }
}
