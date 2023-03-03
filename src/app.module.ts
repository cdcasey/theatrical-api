import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookamrkModule } from './bookamrk/bookamrk.module';

@Module({
  imports: [AuthModule, UserModule, BookamrkModule],
  // controllers: [],
  // providers: [],
})
export class AppModule {}
