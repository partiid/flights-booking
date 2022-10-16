import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { FlightService } from '../../shared/services/flight.service';
import { DataGenerator } from '../../classes/dataGenerator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('flights')
@Controller('flights')
export class FlightController {
    constructor(
        private readonly flightService: FlightService,
        private readonly dataGenerator: DataGenerator,
    ) { }

    @Get('/all')
    async getFlights() {
        return await this.flightService.findAll();
    }
    @Get('/:id')
    async getFlightById(@Param('id') id_flight: number) {
        return await this.flightService.findOne({ id_flight: id_flight });
    }

    //get all flights from given airport 
    @Get('/from/:id_airport')
    async getFlightsFromAirport(@Param('from', ParseIntPipe) id: number) {
        return await this.flightService.findMany({ id_departure: id });
    }
    @Get('/to/:id_airport')
    async getFlightsToAirport(@Param('id_airport', ParseIntPipe) id: number) {
        return await this.flightService.findMany({ id_destination: id });
    }

    @Get('/from/:id_airport_from/to/:id_airport_to')
    async getFlightsFromTo(@Param('id_airport_from', ParseIntPipe) from: number, @Param('id_airport_to', ParseIntPipe) to: number) {
        return await this.flightService.findMany({ id_departure: from, id_destination: to });
    }

}
