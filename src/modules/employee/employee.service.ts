import { Injectable } from '@nestjs/common';
import { Employee } from './employee.model';
import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class EmployeeService {
    constructor(private readonly prismaService: PrismaService) { }

    async findOne(login: string): Promise<Employee> {
        return await this.prismaService.employee.findUnique({
            where: {
                login
            }
        });
    }


}
