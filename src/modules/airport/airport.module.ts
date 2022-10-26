import { Module, forwardRef } from '@nestjs/common';
import { AirportController } from './airport.controller';
import { AirportService } from '../../shared/services/airport.service';
import { PrismaService } from 'src/prisma.service';
import { FlightService } from 'src/shared/services/flight.service';
import { FlightModule } from '../flight/flight.module';
@Module({
  controllers: [AirportController],
  providers: [AirportService, PrismaService], //current module services 
  exports: [AirportService], //services
  imports: [forwardRef(() => FlightModule)] //modules

})
export class AirportModule { }
