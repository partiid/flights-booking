import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Airport, Flight, Prisma } from '@prisma/client';
import { ServiceInterface } from '../../interfaces/service.interface';
import { flightRoute } from '../../interfaces/flight/flightRoute.interface';
import { AirportService } from './airport.service';
import { Graph } from 'src/classes/Graph';
import { Booking } from '@prisma/client';
import { BookingService } from 'src/modules/booking/booking.service';
import { Aircraft } from '@prisma/client';
import * as _ from 'lodash';
import 'lodash.combinations';
import { Tools } from 'src/classes/Tools';

import { connectedFlightRoute } from 'src/interfaces/flight/connectedFlightRoute.interface';
import { AircraftSeating } from 'src/classes/AircraftSeating';
let path = require('ngraph.path');
@Injectable()
export class FlightService implements ServiceInterface<Flight> {
    private readonly Logger: Logger = new Logger(FlightService.name);

    constructor(
        @Inject(forwardRef(() => AirportService)) private readonly airportService: AirportService,
        private readonly prisma: PrismaService,
        @Inject(forwardRef(() => BookingService)) private readonly bookingService: BookingService,
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

        const maxConnectedFlightLength = 6; //TODO add it an api param

        const graph = await this.airportService.createAirportsGraph();

        //first check if direct flight is available
        let directFlight: Flight[] = await this.getDirectFlight(id_departure, id_destination);

        if (_.isEmpty(directFlight) === false) {
            return directFlight;
        }

        let pathFinder = path.aStar(graph, { oriented: true });
        let pathFound = pathFinder.find(id_departure, id_destination);
        let possiblePaths = _.reverse(pathFound.map(e => {
            return e.id;
        }));

        //console.log(pathFound, possiblePaths);
        //return possiblePaths;



        //let possiblePaths: number[][] = graph.getPaths();

        //if path contains more than defined connected flights, remove it
        // possiblePaths = _.remove(possiblePaths, (path: number[]) => {
        //     return path.length <= maxConnectedFlightLength;
        // });

        let possibleFlights: Array<Array<Flight[]>> = [];

        // //assign possbile flights for every step of the path 

        let flight: Array<Flight[]> = [];
        for (let i = 0; i < possiblePaths.length - 1; i++) {
            let flights: Flight[] = await this.getDirectFlight(possiblePaths[i], possiblePaths[i + 1]);

            flight.push(flights)

        }

        possibleFlights.push(flight);
        //console.log(flights);


        return possibleFlights;





    }

    async getFlightSeats(id_flight: number): Promise<number> {
        //const bookings: Booking[] = await this.prisma.booking.findMany({ where: { id_flight: id_flight } })
        const flight: Flight = await this.findOne({ id_flight: id_flight });
        const aircraft: Aircraft = await this.prisma.aircraft.findUnique({ where: { id_aircraft: flight.id_aircraft } });

        let capacity = aircraft.capacity;

        return capacity;

    }


    async getFlightFreeSeats(id_flight: number): Promise<string[][] | Error> {
        //const bookings: Booking[] = await this.prisma.booking.findMany({ where: { id_flight: id_flight } })
        const flight: Flight = await this.findOne({ id_flight: id_flight });
        const aircraft: Aircraft = await this.prisma.aircraft.findUnique({ where: { id_aircraft: flight.id_aircraft } });


        if (!aircraft) {
            return new Error("no aircraft for this flight found, error");
        }


        //seats taken for this flight 
        let seatsOccupied: string[] = await this.bookingService.getBookingSeats(id_flight);

        if (_.isEmpty(seatsOccupied) === true) {
            return AircraftSeating.getSeatsTable(aircraft.capacity);
        }
        seatsOccupied = _.split(seatsOccupied, ',');
        let freeSeats = AircraftSeating.occupiedSeats(await this.getFlightSeats(id_flight), seatsOccupied);
        return freeSeats;



        //get seats for this aircraft 

        // const freeSeats =

        //const seatTable = AircraftSeating.getSeatsTable(flightSeats);



    }

}
