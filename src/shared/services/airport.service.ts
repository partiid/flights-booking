import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { ServiceInterface } from 'src/interfaces/service.interface';
import { Airport, Prisma } from "@prisma/client";
import { PrismaService } from 'src/prisma.service';
import { Graph } from 'src/classes/Graph';
import { flightRoute } from 'src/interfaces/flight/flightRoute.interface';
import { FlightService } from './flight.service';


@Injectable()
export class AirportService implements ServiceInterface<Airport>{
    private readonly Logger = new Logger(AirportService.name);

    constructor(readonly prisma: PrismaService,
        @Inject(forwardRef(() => FlightService)) readonly flightService: FlightService) { }

    async findAll(): Promise<Airport[]> {
        return this.prisma.airport.findMany(
            {
                // include: {
                //     city: true,
                //     country: true
                // },


            }
        );
    }
    async findOne(airportWhereUniqueInput: { id_airport: number; }): Promise<Airport | null> {

        return this.prisma.airport.findUnique({
            where: airportWhereUniqueInput,
            include: { country: true, city: true }
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

    test() {
        return true;
    }

    async createAirportsGraph(): Promise<Graph> {
        let airports: Airport[] = await this.findAll();

        let graph = new Graph();
        for (let airport of airports) {
            graph.addNode(airport.id_airport);
        }


        let flightRoutes: flightRoute[] = await this.flightService.getFlightsRoutes();
        for (let route of flightRoutes) {
            graph.addEdge(route.departure.id, route.destination.id);
        }
        return graph;
    }

}
