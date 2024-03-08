import { Module } from '@nestjs/common';
import { UsersService } from 'src/services/users/users.service';
import { UsersController } from 'src/controllers/users/users.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
