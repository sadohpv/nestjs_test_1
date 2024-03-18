import { NestFactory,HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './logger/logger.service';
import { AllExceptionsFilter } from './all-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  // const app = await NestFactory.create(AppModule, {
  //   bufferLogs: true,
  // });

  // app.useLogger(app.get(LoggerService));
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  const {httpAdapter} = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter))


  app.enableCors();
  await app.listen(2110);
}
bootstrap();
