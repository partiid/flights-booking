import { BadRequestException, Injectable } from '@nestjs/common';
import { CustomerService } from 'src/shared/services/customer.service';
import { PrismaService } from 'src/prisma.service';
import { ServiceInterface } from 'src/interfaces/service.interface';
import { Booking, Flight } from '@prisma/client';
import { BookingModel } from './booking.model';
import { Prisma } from '@prisma/client';
import { FlightService } from 'src/shared/services/flight.service';
import { Inject, forwardRef } from '@nestjs/common';
import * as _ from 'lodash';
@Injectable()
export class BookingService implements ServiceInterface<Booking>{
    constructor(private readonly prismaService: PrismaService,
        private readonly customerService: CustomerService,
        @Inject(forwardRef(() => FlightService)) private readonly flightService: FlightService) { }


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

    async getBookingSeats(id_flight: number): Promise<string[]> {
        let bookings: Booking[] = await this.findMany({ id_flight: id_flight });
        let seats: string[] = [];
        bookings.forEach(booking => {
            seats.push(booking.seats);
        });
        return seats;
    }



    async createFromModel(data: BookingModel): Promise<Booking> {

        const customer = await this.customerService.findOne({ id_customer: data.id_customer });
        if (customer === null || Object.keys(customer).length === 0) {
            throw new BadRequestException("Customer does not exist, create the customer first");
        }

        let { seats, id_flight } = data;


        let flight: Flight = await this.flightService.findOne({ id_flight: id_flight });

        if (flight === null || Object.keys(flight).length === 0) {
            throw new BadRequestException("Flight does not exist, create the flight first");
        }

        let { price } = flight;

        data.date_booking = new Date();
        data.price = price;
        data.number_of_people = seats.length;

        return this.prismaService.booking.create({
            data: {
                flight: {
                    connect: {
                        id_flight: id_flight,
                    },
                },
                customer: {
                    connect: {
                        id_customer: data.id_customer,
                    },
                },
                number_of_people: data.number_of_people,
                price: data.price,
                date_booking: data.date_booking,
                seats: _.join(seats, ",")

            }


        });


        return null;



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
