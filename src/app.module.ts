import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookamrkModule } from './bookamrk/bookamrk.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    BookamrkModule,
    PrismaModule,
  ],
  // controllers: [],
  // providers: [],
})
export class AppModule {}
