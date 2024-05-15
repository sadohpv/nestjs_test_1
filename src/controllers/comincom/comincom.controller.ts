import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { LoggerService } from 'src/logger/logger.service';
import { PublicRoute } from 'src/modules/auth/public.decorator';
import { ComincomService } from 'src/services/comincom/comincom.service';
import { CreateComInComDto } from 'src/types/comments/create-com-in-com.dto';

@Controller('comincom')
export class ComincomController {
  constructor(private readonly comincomService: ComincomService) {}
  private readonly logger = new LoggerService(ComincomController.name);

  @PublicRoute()
  @Post('')
  async createComInCom(
    @Body() createComInComDto: CreateComInComDto,
    @Res() res: Response,
  ) {
    const result = await this.comincomService.createComInCom(createComInComDto);
    if (result) {
      return res.status(HttpStatus.OK).send({ result });
    } else {
      return res.status(HttpStatus.FORBIDDEN).send({ result });
    }
  }

  @PublicRoute()
  @Delete(':id')
  async deleteComInCom(@Param('id') id: number, @Res() res: Response) {
    const result = await this.comincomService.deleteComInCom(+id);
    if (result) {
      return res.status(HttpStatus.OK).send({ result });
    } else {
      return res.status(HttpStatus.FORBIDDEN).send({ result });
    }
  }
}
