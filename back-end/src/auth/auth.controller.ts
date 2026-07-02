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

    @UseGuards(AuthGuard('jwt'))
    @Post('register')
    @ApiBody({ type: CreateAccountDto })
    async createAccount(@Req() req,@Body() dto: CreateAccountDto) {
       return  await this.AuthService.createAccount({id: req.user.id,email: req.user.email,pictureUrl: req.user.pictureUrl},dto);
    }

    
}   
