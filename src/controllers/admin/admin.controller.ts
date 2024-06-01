import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { LoggerService } from 'src/logger/logger.service';
import { PublicRoute } from 'src/modules/auth/public.decorator';
import { AdminService } from 'src/services/admin/admin.service';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}
    private readonly logger = new LoggerService(AdminController.name);
    @PublicRoute()
    @Get('post')
    async getReportPost(@Res() res: Response) {
      const result = await this.adminService.handleGetPostReport();
      if (result) {
        return res.status(HttpStatus.OK).send({ result });
      } else {
        return res.status(HttpStatus.FORBIDDEN).send({ result });
      }
    }

    @PublicRoute()
    @Get('comment')
    async getReportComment(@Res() res: Response) {
      const result = await this.adminService.handleGetCommentReport();
      if (result) {
        return res.status(HttpStatus.OK).send({ result });
      } else {
        return res.status(HttpStatus.FORBIDDEN).send({ result });
      }
    }
}
