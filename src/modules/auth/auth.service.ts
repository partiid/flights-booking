import { Injectable } from '@nestjs/common';
import { EmployeeService } from '../employee/employee.service';
@Injectable()
export class AuthService {
    constructor(private employeeService: EmployeeService) { }

    async validateEmployee(username: string, password: string): Promise<any> {

        const employee = await this.employeeService.findOne(username);
        if (employee && employee.password === password) {
            const { password, ...result } = employee;
            return result;
        }
        return null;
    }


}
