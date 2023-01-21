import { Controller, Get, Body, Post, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { EmployeeModel } from './modules/employee/employee.model';
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }

    @ApiTags('auth')
    @UseGuards(AuthGuard('local'))
    @Post('/auth/login')
    async login(@Request() req) {
        console.log(req.user);
        return req.user;
    }
}
