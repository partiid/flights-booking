import { Controller, Get, Param, Logger, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AirportService } from '../../shared/services/airport.service';

@ApiTags('airports')
@Controller('airports')
export class AirportController {
    private readonly Logger = new Logger(AirportController.name);

    constructor(readonly airportService: AirportService) { }

    @Get('/all')
    async getAirports() {
        return await this.airportService.findAll();
    }
    @Get('/:id')
    async getAirportById(@Param('id', ParseIntPipe) id_airport: number) {
        return await this.airportService.findOne({ id_airport: id_airport });
    }
    @Get('/country/:id')
    async getAirportsByCountry(@Param('id', ParseIntPipe) id_country: number) {
        return await this.airportService.findMany({ id_country: id_country });
    }



}
