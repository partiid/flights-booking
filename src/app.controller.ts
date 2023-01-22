import { Controller, Get, Body, Post, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiCookieAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { EmployeeModel } from './modules/employee/employee.model';
import { LocalAuthGuard } from './modules/auth/localAuth.guard';
import { AuthenticatedGuard } from './modules/auth/authenticated.guard';
import { LoginModel } from './modules/auth/login.model';


@ApiCookieAuth()
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }

    @ApiTags('auth')
    @UseGuards(LocalAuthGuard)
    @Post('/auth/login')
    async login(@Body() dto: LoginModel, @Request() req) {
        if (req.referer === process.env.SWAGGER_REFFERER) {
            return req.sessionID;
        } else {

            return req.user;
        }

    }


}

