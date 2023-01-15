import { Render } from 'nest-jsx-template-engine';
import { Controller, Get, Param, Logger, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IAppProps, App } from 'src/public/app.view';
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

    @Get('/:id_airport')
    async getAirportById(@Param('id_airport', ParseIntPipe) id_airport: number) {
        return await this.airportService.findOne({ id_airport: id_airport });
    }
    @Get('/country/:id_country')
    async getAirportsByCountry(@Param('id_country', ParseIntPipe) id_country: number) {
        return await this.airportService.findMany({ id_country: id_country });
    }





}
