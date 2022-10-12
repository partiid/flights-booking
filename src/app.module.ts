import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AirportModule } from './modules/airport/airport.module';
import { FlightModule } from './modules/flight/flight.module';

@Module({
    imports: [FlightModule, AirportModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
