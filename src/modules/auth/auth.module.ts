import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmployeeModule } from '../employee/employee.module';
import { PassportModule } from '@nestjs/passport/dist';
import { LocalStrategy } from './strategy/local.strategy';
@Module({
  providers: [AuthService, LocalStrategy],
  imports: [EmployeeModule, PassportModule]
})
export class AuthModule { }
