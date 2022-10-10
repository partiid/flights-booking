import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Flight, Prisma } from '@prisma/client';
import { ServiceInterface } from '../../interfaces/service.interface';
@Injectable()
export class FlightService implements ServiceInterface<Flight> {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        return this.prisma.flight.findMany();
    }

    async findOne(
        flightWhereUniqueInput: Prisma.FlightWhereUniqueInput,
    ): Promise<Flight | null> {
        return this.prisma.flight.findUnique({
            where: flightWhereUniqueInput,
        });
    }

    async create(data: Prisma.FlightCreateInput): Promise<Flight> {
        return this.prisma.flight.create({
            data,
        });
    }

    async update(params: {
        where: Prisma.FlightWhereUniqueInput;
        data: Prisma.FlightUpdateInput;
    }): Promise<Flight> {
        const { where, data } = params;
        return this.prisma.flight.update({
            data,
            where,
        });
    }
    async delete(where: Prisma.FlightWhereUniqueInput): Promise<Flight> {
        return this.prisma.flight.delete({
            where,
        });
    }
}
