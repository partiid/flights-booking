import { Controller, Get } from '@nestjs/common';
import { FlightService } from './flight.service';
@Controller('flights')
export class FlightController {
  constructor(private readonly flightService: FlightService) {}

  @Get('/all')
  async getFlights() {
    return await this.flightService.findMany();
  }
}
