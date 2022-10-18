import { Module } from '@nestjs/common';
import { AirportController } from './airport.controller';
import { AirportService } from '../../shared/services/airport.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [AirportController],
  providers: [AirportService, PrismaService],
  exports: [AirportService]

})
export class AirportModule { }
