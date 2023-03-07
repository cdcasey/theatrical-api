import {
  ForbiddenException,
  Injectable,
  ConflictException,
  InternalServerErrorException,
  ImATeapotException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    try {
      // generate hash
      const hashedPassword = await argon.hash(dto.password);

      // save user in db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
        },
      });

      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email address already in use.');
        }
      }
      throw error;
      // throw new ImATeapotException('Something went wrong', {
      //   cause: error,
      //   description: error.code,
      // });
    }
  }

  async signin(dto: AuthDto) {
    // find user by email
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    // if no user, throw exception
    if (!user) {
      throw new ForbiddenException('Incorrect username or password.');
    }

    // compare password
    const pwMatches = await argon.verify(user.password, dto.password);

    // if password wrong, throw exception
    if (!pwMatches) {
      throw new ForbiddenException('Incorrect username or password.');
    }

    return this.signToken(user.id, user.email);
  }

  async signToken(userId: string, email: string): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const token = await this.jwt.signAsync(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: '15m',
    });
    return {
      access_token: token,
    };
  }
}
