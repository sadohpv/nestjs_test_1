import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { LoggerService } from 'src/logger/logger.service';
import { PublicRoute } from 'src/modules/auth/public.decorator';
import { ReportService } from 'src/services/report/report.service';
import { CreateBanDto } from 'src/types/report/ban-create.dto';
import { CreateReportDto } from 'src/types/report/report-create.dto';

@Controller('report')
export class ReportController {
  constructor(private readonly reportServices: ReportService) {}
  private readonly logger = new LoggerService(ReportController.name);
  @PublicRoute()
  @Get('post/:id')
  async getReportPost(@Param('id') id: number, @Res() res: Response) {
    const result = await this.reportServices.handleGetPostReport(+id);
    if (result) {
      return res.status(HttpStatus.OK).send({ result });
    } else {
      return res.status(HttpStatus.FORBIDDEN).send({ result });
    }
  }
  @PublicRoute()
  @Get('adminPage')
  async getReportAdminPage(@Res() res: Response) {
    const result = await this.reportServices.getReportAdminPage();
    if (result) {
      return res.status(HttpStatus.OK).send({ result });
    } else {
      return res.status(HttpStatus.FORBIDDEN).send({ result });
    }
  }

  @PublicRoute()
  @Get('user/:id')
  async getReportUser(@Param('id') id: number, @Res() res: Response) {
    const result = await this.reportServices.handleGetUserReport(+id);
    if (result) {
      return res.status(HttpStatus.OK).send({ result });
    } else {
      return res.status(HttpStatus.FORBIDDEN).send({ result });
    }
  }
  @PublicRoute()
  @Post('')
  async handleCreateReport(
    @Body() createReportDto: CreateReportDto,
    @Res() res: Response,
  ) {
    const result =
      await this.reportServices.handleCreateReport(createReportDto);
    if (result) {
      return res.status(HttpStatus.OK).send({ result });
    } else {
      return res.status(HttpStatus.FORBIDDEN).send({ result });
    }
  }
  @PublicRoute()
  @Patch('ban/user')
  async handleBanUser(@Body() createBan: CreateBanDto, @Res() res: Response) {
    const result = await this.reportServices.handleBanUser(createBan);
    if (result) {
      return res.status(HttpStatus.OK).send({ result });
    } else if (result === null) {
      return res.status(HttpStatus.OK).send({ result });
    } else {
      return res.status(HttpStatus.FORBIDDEN).send({ result });
    }
  }

  @PublicRoute()
  @Patch('ban/post')
  async handleBanPost(@Body() createBan: CreateBanDto, @Res() res: Response) {
    const result = await this.reportServices.handleBanPost(createBan);
    if (result) {
      return res.status(HttpStatus.OK).send({ result });
    } else if (result === null) {
      return res.status(HttpStatus.OK).send({ result });
    } else {
      return res.status(HttpStatus.FORBIDDEN).send({ result });
    }
  }

  @PublicRoute()
  @Patch('ban/comment')
  async handleBanComment(
    @Body() createBan: CreateBanDto,
    @Res() res: Response,
  ) {
    const result = await this.reportServices.handleBanComment(createBan);
    if (result) {
      return res.status(HttpStatus.OK).send({ result });
    } else if (result === null) {
      return res.status(HttpStatus.OK).send({ result });
    } else {
      return res.status(HttpStatus.FORBIDDEN).send({ result });
    }
  }
}
