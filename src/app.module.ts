import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    UsersModule,

    DatabaseModule,

    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000,
        limit: 3, // allow 3 request in 1minute
      },
      // {
      //   name: 'long',
      //   ttl: 60000,
      //   limit: 100, // allow 100 request in 1minute
      // },
    ]),

    LoggerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
