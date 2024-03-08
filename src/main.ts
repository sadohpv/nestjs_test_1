import { NestFactory,HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './logger/logger.service';
import { AllExceptionsFilter } from './all-exception.filter';
async function bootstrap() {
  // const app = await NestFactory.create(AppModule, {
  //   bufferLogs: true,
  // });

  // app.useLogger(app.get(LoggerService));
  const app = await NestFactory.create(AppModule);

  const {httpAdapter} = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter))


  app.enableCors();
  await app.listen(2110);
}
bootstrap();
