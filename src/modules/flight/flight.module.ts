import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { FlightController } from './flight.controller';
import { FlightService } from '../../shared/services/flight.service';
import { DataGenerator } from 'src/classes/dataGenerator';

import { AirportModule } from '../airport/airport.module';

@Module({
    controllers: [FlightController],
    providers: [FlightService, PrismaService],
    exports: [FlightService],
    imports: [AirportModule],
})
export class FlightModule { }
