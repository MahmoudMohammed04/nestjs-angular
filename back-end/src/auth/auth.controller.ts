import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateAccountDto } from './dtos/create-account.dto';
import { AuthGuard } from '@nestjs/passport';
import { waitForDebugger } from 'inspector';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    
    constructor(private readonly AuthService: AuthService) {}


    // @UseGuards(AuthGuard('firebase'))
    // @Post('test')
    // async test(@Req() req) {
    //    return  req.user;
    // }

    @UseGuards(AuthGuard('firebase'))
    @Post('register')
    @ApiBody({ type: CreateAccountDto })
    async createAccount(@Req() req,@Body() dto: CreateAccountDto) {
        
        const pictureUrl = `${req.protocol}://${req.headers.host}/uploads/images/default.jpg`;
        
       return  await this.AuthService.createAccount({id: req.user.user_id,email: req.user.email,pictureUrl:pictureUrl},dto);
    }

    
}   
