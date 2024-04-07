import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { LoggerModule } from './logger/logger.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthService } from './services/auth/auth.service';
import { AuthController } from './controllers/auth/auth.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from './modules/auth/auth.guard';
import { PostController } from './controllers/post/post.controller';
import { PostsService } from './services/posts/posts.service';
import { CommentController } from './controllers/comment/comment.controller';
import { CommentService } from './services/comment/comment.service';
import { LikePostController } from './controllers/like-post/like-post.controller';
import { LikeCommentController } from './controllers/like-comment/like-comment.controller';
import { LikeCommentController } from './services/like-comment/like-comment.controller';
import { LikePostController } from './services/like-post/like-post.controller';
import { LikePostService } from './services/like-post/like-post.service';
import { LikeCommentService } from './services/like-comment/like-comment.service';
@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot(),
    DatabaseModule,

    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 100000, // allow 3 request in 1minute
      },
    ]),

    LoggerModule,

    AuthModule,
  ],
  controllers: [AppController, AuthController, PostController, CommentController, LikePostController, LikeCommentController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
    AuthService,
    PostsService,
    CommentService,
    LikePostService,
    LikeCommentService,
  ],
})
export class AppModule {}
