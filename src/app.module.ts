import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AirportModule } from './modules/airport/airport.module';
import { FlightModule } from './modules/flight/flight.module';
import { CountryModule } from './modules/country/country.module';
@Module({
    imports: [FlightModule, AirportModule, CountryModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
