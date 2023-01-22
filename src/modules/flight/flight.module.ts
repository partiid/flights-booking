import { Module, forwardRef } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { FlightController } from './flight.controller';
import { FlightService } from '../../shared/services/flight.service';


import type { ClientOpts } from 'redis';
import { AirportModule } from '../airport/airport.module';

import { BookingModule } from '../booking/booking.module';
import { CacheModule } from '@nestjs/common/cache';
import { redisStore } from 'cache-manager-redis-store';


@Module({
    controllers: [FlightController],
    providers: [FlightService, PrismaService],
    exports: [FlightService],
    imports: [forwardRef(() => AirportModule), forwardRef(() => BookingModule),
    CacheModule.register<ClientOpts>({
        store: redisStore,
        host: 'localhost',
        port: 6379,
        ttl: 3600

    })],
})
export class FlightModule { }
