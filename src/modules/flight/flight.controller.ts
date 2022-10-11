import { Controller, Get, Param } from '@nestjs/common';
import { FlightService } from '../../shared/services/flight.service';
import { DataGenerator } from '../../classes/dataGenerator';
@Controller('flights')
export class FlightController {
    constructor(
        private readonly flightService: FlightService,
        private readonly dataGenerator: DataGenerator,
    ) {}

    @Get('/all')
    async getFlights() {
        return await this.flightService.findAll();
    }
    @Get('/:id')
    async getFlightById(@Param('id') id_flight: number) {
        return await this.flightService.findOne({ id_flight: id_flight });
    }
}
