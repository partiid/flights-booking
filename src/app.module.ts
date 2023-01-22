import { Module, NestModule, MiddlewareConsumer, CacheModule, CacheInterceptor } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import type { ClientOpts } from 'redis';
import { AirportModule } from './modules/airport/airport.module';
import { FlightModule } from './modules/flight/flight.module';
import { CountryModule } from './modules/country/country.module';
import { BookingModule } from './modules/booking/booking.module';
import { CustomerModule } from './modules/customer/customer.module';
import { RenderMiddleware } from 'nest-jsx-template-engine';
import { EmployeeModule } from './modules/employee/employee.module';
import { AuthModule } from './modules/auth/auth.module';
import { HttpExceptionFilter } from './filters/httpException.filter';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import * as redisStore from 'cache-manager-redis-store';

@Module({
    imports: [FlightModule, AirportModule, CountryModule, CustomerModule, BookingModule, EmployeeModule, AuthModule,
        CacheModule.register<ClientOpts>({
            store: redisStore,
            host: 'localhost',
            port: 6379,
            ttl: 3600
        })
    ],
    controllers: [AppController],
    providers: [AppService,
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },


    ],

})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(RenderMiddleware)
            .forRoutes('*');
    }
}
