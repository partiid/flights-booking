import { Controller, Get, Param, ParseIntPipe, NotAcceptableException, Logger, Post, UseFilters, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { FlightService } from '../../shared/services/flight.service';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { IAppProps, App } from 'src/public/app.view';
import { ApiCookieAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Render } from 'nest-jsx-template-engine';
import { Flight } from '@prisma/client';
import { Body } from '@nestjs/common/decorators';
import { FlightModel } from './flight.model';
import { HttpExceptionFilter } from 'src/filters/httpException.filter';

@ApiTags('flights')
@Controller('flights')
export class FlightController {
    private Logger: Logger = new Logger(FlightController.name);
    constructor(
        private readonly flightService: FlightService,

    ) { }
    //@HttpCode(HttpStatus.CREATED)
    @Post('/flight/create')
    @ApiCookieAuth()
    //@UseFilters(new HttpExceptionFilter())
    async createFlight(@Body() flightModel: FlightModel) {

        try {
            await this.flightService.create(flightModel);
        } catch (error) {
            throw new NotAcceptableException(error);
        }
    }


    @Get('/all')
    async getFlights() {
        return await this.flightService.findAll();
    }
    @Get('/from/:id_departure/to/:id_destination')
    async getFlightsFromTo(@Param('id_departure', ParseIntPipe) id_departure: number, @Param('id_destination', ParseIntPipe) id_destination: number) {

        // console.log(await this.flightService.findConnectedFlights());
        return await this.flightService.findConnectedFlights(id_departure, id_destination);
    }

    @Get('/flight/:id_flight')
    async getFlightById(@Param('id_flight', ParseIntPipe) id_flight: number) {
        return await this.flightService.findOne({ id_flight: id_flight });
    }

    //get all flights from given airport 
    @Get('/from/:id_airport/')
    async getFlightsFromAirport(@Param('id_airport', ParseIntPipe) id: number) {
        Logger.log('getFlightsFromAirport');
        return await this.flightService.findMany({ id_departure: id });
    }

    @Get('/to/:id_airport')
    async getFlightsToAirport(@Param('id_airport', ParseIntPipe) id: number) {
        return await this.flightService.findMany({ id_destination: id });
    }
    //get empty seats for given flight 
    @Get('/flight/seats/:id_flight')
    async getFlightSeats(@Param('id_flight', ParseIntPipe) id_flight: number) {
        return await this.flightService.getFlightFreeSeats(id_flight);
    }


    //@UseGuards(AuthenticatedGuard)


    // @Get('/from/:id_airport_from/to/:id_airport_to')
    // async getFlightsFromTo(@Param('id_airport_from', ParseIntPipe) from: number, @Param('id_airport_to', ParseIntPipe) to: number) {

    //     return await this.flightService.findMany({ id_departure: from, id_destination: to });
    // }




}
