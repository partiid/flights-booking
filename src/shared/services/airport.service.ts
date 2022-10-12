import { Injectable, Logger } from '@nestjs/common';
import { ServiceInterface } from 'src/interfaces/service.interface';
import { Airport, Prisma } from "@prisma/client";
import { PrismaService } from 'src/prisma.service';




@Injectable()
export class AirportService implements ServiceInterface<Airport>{
    private readonly Logger = new Logger(AirportService.name);

    constructor(readonly prisma: PrismaService) { }

    async findAll(): Promise<Airport[]> {
        return this.prisma.airport.findMany(
            {
                include: {

                    city: {
                        include: {
                            country: {
                                select: {
                                    name: true
                                }
                            }
                        },

                    }
                },

                take: 10

            }
        );
    }
    async findOne(airportWhereUniqueInput: { id_airport: number; }): Promise<Airport | null> {
        return this.prisma.airport.findUnique({
            where: airportWhereUniqueInput,
        });
    }

    async findMany(params: Prisma.AirportWhereInput): Promise<Airport[]> {
        return this.prisma.airport.findMany(
            {
                where: { id_country: params.id_country },
                include: {
                    country: {
                        select: {
                            name: true
                        }
                    },
                    city: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        );
    }
    async create(data: Prisma.AirportCreateInput): Promise<Airport> {
        throw new Error("Method not Available.");
    }
    async update(params: {
        where: Prisma.AirportWhereUniqueInput;
        data: Prisma.AirportUpdateInput;
    }): Promise<Airport> {
        throw new Error("Method not Available.");
    }
    async delete(where: Prisma.AirportWhereUniqueInput): Promise<Airport> {
        throw new Error("Method not Available.");
    }


}
