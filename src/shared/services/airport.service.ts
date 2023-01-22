import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { ServiceInterface } from 'src/interfaces/service.interface';
import { Airport, Prisma } from "@prisma/client";
import { PrismaService } from 'src/prisma.service';
//import { Graph } from 'src/classes/Graph';
import { flightRoute } from 'src/interfaces/flight/flightRoute.interface';
import { FlightService } from './flight.service';

//var Graph = require('@dagrejs/graphlib').Graph;


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

    async createAirportsGraph() {
        let airports: Airport[] = await this.findAll();
        let createGraph = require('ngraph.graph');
        let graph = createGraph();
        airports.forEach(airport => {
            if (!graph.hasNode(airport.id_airport)) {
                graph.addNode(airport.id_airport);

            }
        })
        let flightRoutes: flightRoute[] = await this.flightService.getFlightsRoutes();
        flightRoutes.forEach((route: flightRoute) => {
            graph.addLink(route.departure.id, route.destination.id);
        });

        return graph;
    }
    async getAirportsGraphObject(): Promise<Object> {

        let flightRoutes: flightRoute[] = await this.flightService.getFlightsRoutes();
        let ret = {
            edges: flightRoutes.map(fr => {
                return {
                    from: fr.departure.id,
                    to: fr.destination.id,
                }
            }),
            nodes: (await this.findAll()).map(a => {
                return {
                    id: a.id_airport,
                    label: a.name
                }
            })
        }
        return ret;
    }

    calculteDistanceBetweenAirports = (lat1, lon1, lat2, lon2, unit = "K") => {
        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
        }
        else {
            var radlat1 = Math.PI * lat1 / 180;
            var radlat2 = Math.PI * lat2 / 180;
            var theta = lon1 - lon2;
            var radtheta = Math.PI * theta / 180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180 / Math.PI;
            dist = dist * 60 * 1.1515;
            if (unit == "K") { dist = dist * 1.609344 }
            if (unit == "N") { dist = dist * 0.8684 }
            return dist;
        }
    }


}
