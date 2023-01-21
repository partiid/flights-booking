import { Body, Controller, Get } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { Employee } from './employee.model';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('employee')
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) { }

  @Get('/')
  async findOne(@Body('login') login: string): Promise<Employee> {
    return this.employeeService.findOne(login);
  }
}
