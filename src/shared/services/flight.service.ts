import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Airport, Flight, Prisma } from '@prisma/client';
import { ServiceInterface } from '../../interfaces/service.interface';
import { flightRoute } from '../../interfaces/flight/flightRoute.interface';
import { AirportService } from './airport.service';
import { BookingService } from 'src/modules/booking/booking.service';
import { Aircraft } from '@prisma/client';
import * as _ from 'lodash';
import 'lodash.combinations';
import { AircraftSeating } from 'src/classes/AircraftSeating';
import { FlightModel } from 'src/modules/flight/flight.model';
import { NotAcceptableException } from '@nestjs/common/exceptions';
import { Graph } from 'redis';

const moment = require('moment');
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

    async create(data: FlightModel): Promise<Flight> {
        //get the airports to calculate the distance between them
        let { id_departure, id_destination, date_departure, number: flightNumber } = data;
        let departureAirport: Airport = await this.airportService.findOne({ id_airport: id_departure });
        let destinationAirport: Airport = await this.airportService.findOne({ id_airport: id_destination });

        let { geo_lat, geo_long } = departureAirport;
        let { geo_lat: geo_lat2, geo_long: geo_long2 } = destinationAirport;

        const flightDistance: number = this.airportService.calculteDistanceBetweenAirports(geo_lat, geo_long, geo_lat2, geo_long2);
        let flightDuration: number = await this.prisma.aircraft.findUnique({ where: { id_aircraft: data.id_aircraft } }).then((aircraft: Aircraft) => {
            return flightDistance / aircraft.avg_speed;
        });;

        //get flight date arrival to destination airport 
        let date_arrival = moment(date_departure).add(flightDuration, 'hours').toDate();
        data.date_arrival = date_arrival;

        let flight: Flight;
        try {
            return await this.prisma.flight.create({
                data: {
                    number: flightNumber,
                    date_departure: date_departure,
                    date_arrival: data.date_arrival,
                    Aircraft: { connect: { id_aircraft: data.id_aircraft } },
                    airport_departure: { connect: { id_airport: data.id_departure } },
                    airport_destination: { connect: { id_airport: data.id_destination } },
                    distance: flightDistance,
                    duration: flightDuration,
                    price: data.price,

                }
            });
        } catch (err) {
            this.Logger.error("Error creating a flight - probably a duplicate entry");
            throw new Error('Error creating a flight');

        }

    }

    async update(params: {
        where: Prisma.FlightWhereUniqueInput;
        data: Prisma.FlightUpdateInput;
    }): Promise<Flight> {
        const { where, data } = params;
        try {
            return await this.prisma.flight.update({
                data,
                where,
            });
        } catch (err) {
            this.Logger.error("Error updating a flight");
            throw new Error('Error updating a flight');
        }

    }
    async delete(where: Prisma.FlightWhereUniqueInput): Promise<Flight> {
        try {
            console.log("deleting flight");
            return await this.prisma.flight.delete({
                where,
            });
        } catch (err) {
            this.Logger.error("Error deleting a flight - probably does not exist");
            throw new Error("Error deleting a flight");
        }

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
        let graph: Graph = await this.airportService.createAirportsGraph();
        // if (await this.cache.get('airportsGraph') !== undefined) {
        //     graph = await this.cache.get('airportsGraph');
        // } else {
        //     graph = ;
        //     await this.cache.set('airportsGraph', graph, 3600);

        // }


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
