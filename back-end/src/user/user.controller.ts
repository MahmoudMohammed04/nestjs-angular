import { Controller,Get, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('users')
@ApiBearerAuth('Bearer')
@UseGuards(AuthGuard('firebase'))
@Controller('user')
export class UserController {
    constructor(private readonly userService:UserService) {}

    @Get("search-username")
    async searchUsersByUsername(@Req() req,@Query('username') username:string) {
        return await this.userService.SearchUsersByUsername(req.user.user_id,username);
    }

    @Get("search-email")
    async searchUsersByEmail(@Req() req,@Query('email') email:string) {
        return await this.userService.SearchUsersByEmail(req.user.user_id,email);
    }
}
