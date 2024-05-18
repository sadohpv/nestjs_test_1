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
import { LikePostService } from './services/like-post/like-post.service';
import { LikeCommentService } from './services/like-comment/like-comment.service';
import { LikePostController } from './controllers/like-post/like-post.controller';
import { LikeCommentController } from './controllers/like-comment/like-comment.controller';
import { FollowController } from './controllers/follow/follow.controller';
import { FollowService } from './services/follow/follow.service';
// import { FollowController } from './controllers/follows/follow.controller';
import { FriendController } from './controllers/friend/friend.controller';
import { FriendService } from './services/friend/friend.service';
import { NotifyService } from './services/notify/notify.service';
import { NotifyController } from './controllers/notify/notify.controller';
import { ComincomService } from './services/comincom/comincom.service';
import { ComincomController } from './controllers/comincom/comincom.controller';
import { SavePostController } from './controllers/save-post/save-post.controller';
import { SavePostService } from './services/save-post/save-post.service';

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
  controllers: [
    AppController,
    AuthController,
    PostController,
    CommentController,
    LikePostController,
    LikeCommentController,
    FollowController,
    FriendController,
    NotifyController,
    ComincomController,
    SavePostController,
  ],
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
    FollowService,
    FriendService,
    NotifyService,
    ComincomService,
    SavePostService,
  ],
})
export class AppModule {}
