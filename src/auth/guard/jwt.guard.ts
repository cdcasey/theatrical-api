import { AuthGuard } from '@nestjs/passport';

// jwt is default, but can give any name where strategy is defined.
export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}
