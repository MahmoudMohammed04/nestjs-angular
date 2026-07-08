import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma/browser';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private readonly prismaService:PrismaService) {}


    async SearchUsersByUsername(userId : string,username:string) {

        if(username.length<=0) return [];

        const normalizedData = username.trim().toUpperCase();

        return await this.prismaService.user.findMany({where:{
            id:{not:userId},
            normalizedUsername:{contains:normalizedData}
        },
        select:{
            id:true,
            username:true,
            pictureUrl:true,
            email:true
        }});
    }

    async SearchUsersByEmail(userId : string,email:string) {

        if(email.length<=0) return [];
        
        const normalizedData = email.trim().toUpperCase();

        return await this.prismaService.user.findMany({where:{
            id:{not:userId},
            normalizedEmail:{contains:normalizedData}
            
        },
        select:{
            id:true,
            username:true,
            pictureUrl:true,
            email:true
        }});
    }
}
