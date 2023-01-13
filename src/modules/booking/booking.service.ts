import { BadRequestException, Injectable } from '@nestjs/common';
import { CustomerService } from 'src/shared/services/customer.service';
import { PrismaService } from 'src/prisma.service';
import { ServiceInterface } from 'src/interfaces/service.interface';
import { Booking } from '@prisma/client';
import { BookingModel } from './booking.model';
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
    async create(data: BookingModel): Promise<Booking> {
        return null;
    }

    async createFromModel(data: BookingModel): Promise<Booking> {
        const customer = await this.customerService.findOne({ id_customer: data.id_customer });

        if (customer === null || Object.keys(customer).length === 0) {
            throw new BadRequestException("Customer does not exist, create the customer first");
        }


        return null;
        // return this.prismaService.booking.create({
        //     // data: {
        //     //     customer: {
        //     //         connect: {
        //     //             id_customer: data.id_customer,

        //     //         },
        //     //     },

        //     //     number_of_people: data.number_of_people,
        //     //     price: data.price,
        //     // },
        //     // include: {
        //     //     customer: true,
        //     // }



        // });




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
