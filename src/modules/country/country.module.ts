import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { FlightService } from 'src/shared/services/flight.service';
import { CountryService } from '../../shared/services/country.service';
import { CountryController } from './country.controller';

@Module({
  controllers: [CountryController],
  providers: [CountryService, FlightService, PrismaService]
})
export class CountryModule { }
