import { IsString, IsEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Employee {
    @ApiProperty()
    @IsString()
    @IsEmpty()
    login: string;

    @ApiProperty()
    @IsString()
    @IsEmpty()
    password: string;
}
export class EmployeeModel extends Employee { }