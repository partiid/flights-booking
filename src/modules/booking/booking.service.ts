import { Injectable } from '@nestjs/common';
import { CustomerService } from 'src/shared/services/customer.service';
import { PrismaService } from 'src/prisma.service';
import { ServiceInterface } from 'src/interfaces/service.interface';
import { Booking } from '@prisma/client';
import { Prisma } from '@prisma/client';
@Injectable()
export class BookingService implements ServiceInterface<Booking>{
    constructor(private readonly prismaService: PrismaService,
        private readonly customerService: CustomerService) { }
    async findOne(where: Prisma.BookingWhereUniqueInput) {
        return this.prismaService.booking.findUnique({
            where,
        });
    }
    async findAll(): Promise<Booking[]> {
        return this.prismaService.booking.findMany();

    }
    async findMany(where: Prisma.BookingWhereInput): Promise<Booking[]> {
        return this.prismaService.booking.findMany({
            where,
        });
    }
    async create(data: Prisma.BookingCreateInput): Promise<Booking> {

        return this.prismaService.booking.create({
            data,
        });
    }
    async update(params: {
        where: Prisma.BookingWhereUniqueInput;
        data: Prisma.BookingUpdateInput;
    }): Promise<Booking> {
        const { where, data } = params;
        return this.prismaService.booking.update({
            data,
            where,
        });
    }
    async delete(where: Prisma.BookingWhereUniqueInput): Promise<Booking> {
        return this.prismaService.booking.delete({
            where,
        });
    }






}
