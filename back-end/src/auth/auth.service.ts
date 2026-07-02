import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateAccountDto } from './dtos/create-account.dto';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) {}
    
  
    async createAccount(req:{id: string , email: string , pictureUrl: string},dto: CreateAccountDto) {
        const user = await this.prisma.user.create(
            {
                data: {
                    id: req.id,
                    email: req.email,
                    username: dto.username,
                    normalizedUsername: dto.username.trim().toUpperCase(),
                    phone: dto.phone,
                    pictureUrl: req.pictureUrl,
                }
            }
        );

        return user;
    }


}
