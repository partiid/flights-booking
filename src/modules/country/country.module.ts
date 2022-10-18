import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AirportService } from 'src/shared/services/airport.service';
import { FlightService } from 'src/shared/services/flight.service';
import { CountryService } from '../../shared/services/country.service';
import { FlightModule } from '../flight/flight.module';
import { CountryController } from './country.controller';

@Module({
  controllers: [CountryController],
  providers: [CountryService, PrismaService, AirportService],
  imports: [FlightModule]

})
export class CountryModule { }
