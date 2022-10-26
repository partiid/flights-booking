import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Airport, Flight, Prisma } from '@prisma/client';
import { ServiceInterface } from '../../interfaces/service.interface';
import { flightRoute } from '../../interfaces/flight/flightRoute.interface';
import { AirportService } from './airport.service';
import { Graph } from 'src/classes/Graph';
import * as _ from 'lodash';
import { connected } from 'process';
@Injectable()
export class FlightService implements ServiceInterface<Flight> {
    private readonly Logger: Logger = new Logger(FlightService.name);

    constructor(
        @Inject(forwardRef(() => AirportService)) private readonly airportService: AirportService,
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
    //get direct flights from one airport to the other one 
    async getDirectFlight(id_departure: number, id_destination: number): Promise<Flight[]> {
        return await this.prisma.flight.findMany({
            where: {
                id_departure,
                id_destination,
            }
        });
    }
    //find flights from to 
    //if direct flight is not found, find connected ones 
    async findConnectedFlights(id_departure: number, id_destination: number) {
        const graph: Graph = await this.airportService.createAirportsGraph();

        //first check if direct flight is available
        let directFlight: Flight[] = await this.getDirectFlight(id_departure, id_destination);

        if (_.isEmpty(directFlight) === false) {
            return directFlight;
        }

        //if direct flight is not available, find links between the airports 
        let connectedFlight: Flight[] = [];
        //search the graph
        graph.dfs(id_departure, id_destination);

        let connectedAirports: number[] = _.remove(graph.getSearchResult(), (id: number) => {
            return id !== id_departure;
        });

        if (_.isEmpty(connectedAirports) === true) {
            return [];
        }
        console.log("Connected airports to ", id_departure, ":", connectedAirports);
        let departures: Flight[] = [];
        let departureNotFound: boolean = false;
        //search for flights between the airports untill it finds a direct flight from last departure airport
        while (_.isEmpty(await this.getDirectFlight(id_departure, id_destination)) === true && departureNotFound == false) {
            console.log(id_departure, ":", connectedAirports);
            if (_.isEmpty(connectedAirports) == false) {
                for (let node of connectedAirports) {
                    let departure = await this.getDirectFlight(id_departure, node);


                    graph.clearSearchResult();
                    graph.dfs(node, id_destination);
                    id_departure = node; //set new departure airport
                    connectedAirports = graph.getSearchResult();

                }
            } else {
                return;
            }

        }

        //get the last found flight
        let lastFlight = await this.getDirectFlight(id_departure, id_destination);

        console.log(connectedFlight);


        //return connectedFlights;



        return graph.getSearchResult();

    }

}
