import { Module, CacheModule, forwardRef } from '@nestjs/common';
import type { ClientOpts } from 'redis';
import { AirportController } from './airport.controller';
import { AirportService } from '../../shared/services/airport.service';
import { PrismaService } from 'src/prisma.service';

import * as redisStore from 'cache-manager-redis-store';
import { FlightModule } from '../flight/flight.module';
@Module({
  controllers: [AirportController],
  providers: [AirportService, PrismaService,
  ], //current module services 
  exports: [AirportService], //services
  imports: [forwardRef(() => FlightModule),
  CacheModule.register<ClientOpts>({
    store: redisStore,
    host: 'localhost',
    port: 6379,
    ttl: 3600
  })] //modules

})
export class AirportModule { }
