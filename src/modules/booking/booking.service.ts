import { Injectable, Logger } from '@nestjs/common';
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
    private readonly Logger = new Logger(BookingService.name);
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

    async getBookingSeats(id_flight: number): Promise<string[]> {
        let bookings: Booking[] = await this.findMany({ id_flight: id_flight });
        let seats: string[] = [];
        bookings.forEach(booking => {
            seats.push(booking.seats);
        });
        return seats;
    }



    async create(data: BookingModel): Promise<Booking> {

        const customer = await this.customerService.findOne({ id_customer: data.id_customer });
        if (customer === null || Object.keys(customer).length === 0) {
            throw new Error("Customer does not exist, create the customer first");
        }

        let { seats, id_flight } = data;


        let flight: Flight = await this.flightService.findOne({ id_flight: id_flight });

        if (flight === null || Object.keys(flight).length === 0) {
            throw new Error("Flight does not exist, create the flight first");
        }

        let { price } = flight;

        data.date_booking = new Date();
        data.price = price;
        data.number_of_people = seats.length;
        try {
            return await this.prismaService.booking.create({
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
        } catch (err) {
            this.Logger.error("Error creating booking");
            throw new Error("Error creating booking");
        }







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
        try {
            return await this.prismaService.booking.delete({
                where,
            });
        } catch (err) {
            this.Logger.error("Error deleting booking");
            throw new Error("Error deleting booking");
        }

    }







}
