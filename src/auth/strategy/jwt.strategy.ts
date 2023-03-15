import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
// jwt becomes default name from lib, but can give any name. e.g.,
// export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh')
// *Magic nonsesnse
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  // validate function must be implemented
  // automatically attaches user info from token to request
  // *Magic nonsense
  async validate(payload: { sub: string; email: string }) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        id: payload.sub,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    // select is better than this dumb delete
    // also, the find should probably be in a service instead of a controller
    // delete user.password;
    return user;
  }
}
