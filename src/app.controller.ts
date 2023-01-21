import { Controller, Get, Body, Post, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { EmployeeModel } from './modules/employee/employee.model';
import { LocalAuthGuard } from './modules/auth/localAuth.guard';
import { AuthenticatedGuard } from './modules/auth/authenticated.guard';
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }

    @ApiTags('auth')
    @UseGuards(LocalAuthGuard)
    @Post('/auth/login')
    async login(@Request() req) {
        console.log(req.user);
        return req.user;
    }
    @Get('/chuj')
    @UseGuards(AuthenticatedGuard)
    async chuj() {
        console.log("chuj");
    }

}
