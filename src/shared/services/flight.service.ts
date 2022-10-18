import { Injectable, Logger, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Airport, Flight, Prisma } from '@prisma/client';
import { ServiceInterface } from '../../interfaces/service.interface';
import { flightRoute } from '../../interfaces/flight/flightRoute.interface';
import { AirportService } from './airport.service';
import { Graph } from 'src/classes/Graph';
@Injectable()
export class FlightService implements ServiceInterface<Flight> {
    private readonly Logger: Logger = new Logger(FlightService.name);

    constructor(
        private readonly airportService: AirportService,
        private readonly prisma: PrismaService,
    ) { }

    async findAll() {
        return this.prisma.flight.findMany();
    }

    async findMany(where: Prisma.FlightWhereInput): Promise<Flight[]> {
        return this.prisma.flight.findMany({
            where: where,
        });
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

    async getFlightsRoutes(): Promise<flightRoute[]> {
        let flights: Flight[] = await this.findAll();
        let flightRoutes: flightRoute[] = [];

        for (let flight of flights) {

            let airport_departure = await this.airportService.findOne({ id_airport: flight.id_departure });
            let airport_destination = await this.airportService.findOne({ id_airport: flight.id_destination });

            flightRoutes.push({
                id_flight: flight.id_flight,
                departure: {
                    id: airport_departure.id_airport,
                    name: airport_departure.name,
                    code: airport_departure.code
                },
                destination: {
                    id: airport_destination.id_airport,
                    name: airport_destination.name,
                    code: airport_destination.code
                }

            });
        }


        return flightRoutes;
    }
    async findConnectedFlights(): Promise<Object> {
        //get all flight routes and airports 
        // this.airportService.test();
        let airports: Airport[] = await this.airportService.findAll();
        //create graph from airports as nodes and edges as flight routes 
        let graph = new Graph();

        airports.forEach(airport => {

            graph.addNode(airport.id_airport);
        })
        let flightRoutes: flightRoute[] = await this.getFlightsRoutes();

        flightRoutes.forEach((route: flightRoute) => {
            graph.addEdge(route.departure.id, route.destination.id);
        });

        //search graph for connected airports 
        graph.dfs(3009);

        //check whether connection between airports is like departure -> destination (departure) 



        return graph.getSearchResult();

    }

}
