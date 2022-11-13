import { ConflictException, HttpCode, Injectable } from '@nestjs/common';
import { ServiceInterface } from 'src/interfaces/service.interface';
import { Customer, Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';


@Injectable()
export class CustomerService implements ServiceInterface<Customer> {
    constructor(private readonly prismaService: PrismaService) { }
    async findOne(where: Prisma.CustomerWhereUniqueInput) {
        return this.prismaService.customer.findUnique({
            where,
        });
    }

    async findAll(): Promise<Customer[]> {
        return this.prismaService.customer.findMany();
    }
    async findMany(where: Prisma.CustomerWhereInput): Promise<Customer[]> {
        return this.prismaService.customer.findMany({
            where,
        });
    }
    async create(data: Prisma.CustomerCreateInput): Promise<Customer> {
        return this.prismaService.customer.create({
            data,
        });
    }

    async createIfNotExists(data: Prisma.CustomerCreateInput): Promise<Customer | Error> {
        const customer: Customer = await this.prismaService.customer.findFirst({
            where: {
                identification_number: data.identification_number,
            }
        });
        if (customer === null || Object.keys(customer).length === 0) {
            return this.create(data);
        }
        throw new ConflictException("Customer already exists, update instead");

    }
    async update(params: {
        where: Prisma.CustomerWhereUniqueInput;
        data: Prisma.CustomerUpdateInput;
    }): Promise<Customer> {
        const { where, data } = params;
        return this.prismaService.customer.update({
            data,
            where,
        });
    }
    async delete(where: Prisma.CustomerWhereUniqueInput): Promise<Customer> {
        return this.prismaService.customer.delete({
            where,
        });
    }



}