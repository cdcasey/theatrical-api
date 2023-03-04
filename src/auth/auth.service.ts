import {
  ForbiddenException,
  Injectable,
  ConflictException,
  InternalServerErrorException,
  ImATeapotException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

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

      // quick & dirty temp solution
      // @ts-ignore
      delete user.password;

      // return user
      return user;
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

    // return user
    // quick & dirty temp solution
    // @ts-ignore
    delete user.password;
    return user;
  }
}
