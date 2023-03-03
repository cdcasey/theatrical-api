import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookamrkModule } from './bookamrk/bookamrk.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, UserModule, BookamrkModule, PrismaModule],
  // controllers: [],
  // providers: [],
})
export class AppModule {}
