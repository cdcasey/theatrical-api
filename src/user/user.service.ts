import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { USER_SELECTION_OBJECT } from '../_constants/user';
import { EditUserDto } from './dto/edit-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(userId: string, dto: EditUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
      select: {
        ...USER_SELECTION_OBJECT,
      },
    });

    return user;
  }
}
