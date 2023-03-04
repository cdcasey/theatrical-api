import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    // generate hash
    const hashedPassword = await argon.hash(dto.password);

    // save user in db
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
      },
    });

    // quick & dirty temp solution
    // @ts-ignore
    delete user.password;

    // return user
    return user;
  }

  signin() {
    return {
      msg: 'I am signed in',
    };
  }
}
