import { Injectable } from '@nestjs/common';
import { EmployeeService } from '../employee/employee.service';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
    constructor(private employeeService: EmployeeService,
        private JwtService: JwtService) { }

    async validateEmployee(username: string, password: string): Promise<any> {

        const employee = await this.employeeService.findOne(username);
        if (employee && employee.password === password) {
            const { password, ...result } = employee;
            return result;
        }
        return null;
    }

    async login(employee: any) {
        const payload = { username: employee.username, sub: employee.id };
        return {
            access_token: this.JwtService.sign(payload),
        };
    }

}
