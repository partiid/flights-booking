import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Airport, Flight, Prisma } from '@prisma/client';
import { ServiceInterface } from '../../interfaces/service.interface';
import { flightRoute } from '../../interfaces/flight/flightRoute.interface';
import { AirportService } from './airport.service';
import { Graph } from 'src/classes/Graph';
import * as _ from 'lodash';
import 'lodash.combinations';
import { connected } from 'process';
import { connect } from 'http2';
import { connectedFlightRoute } from 'src/interfaces/flight/connectedFlightRoute.interface';
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
        let connectedFlight: Array<Flight[]> = [];
        //search the graph
        graph.dfs(id_departure, id_destination);

        let connectedAirports: number[] = _.remove(graph.getSearchResult(), (id: number) => {
            return id !== id_departure;
        });

        if (_.isEmpty(connectedAirports) === true) {
            return [];
        }
        //find all flights that connect both airports 
        graph.findPaths(id_departure, id_destination);
        let possiblePaths: number[][] = graph.getPaths();
        let possibleFlights: Array<Array<Flight[]>> = [];

        //assign possbile flights for every step of the path 
        for (let path of possiblePaths) {
            let flight: Array<Flight[]> = [];
            for (let i = 0; i < path.length - 1; i++) {
                let flights: Flight[] = await this.getDirectFlight(path[i], path[i + 1]);
                //when there's more than one flight found, create separate array for each flight 
                // if (flights.length > 1) {
                //     for (let j = 0; j < flights.length - 1; j++) {
                //         flights.concat(await this.getDirectFlight(flights[j].id_destination, path[i]));
                //     }
                // }

                flight.push(flights)

            }

            possibleFlights.push(flight);
            //console.log(flights);
        }

        return possibleFlights;

        // let combinationFlightIds = possibleFlights.map((route) => {
        //     let routeFlightIds: number[] = [];
        //     route.forEach(flights => {
        //         let flightIds = flights.map(f => f.id_flight);
        //         routeFlightIds.push(...flightIds);
        //     });

        //     let combinations = _.combinations(routeFlightIds, route.length);

        //     return combinations;
        // });



    }

    async getFlightSeats(id_flight: number) {
        const flight: Flight = await this.findOne({ id_flight: id_flight });


    }

}
