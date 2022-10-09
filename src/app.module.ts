import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FlightModule } from './modules/flight/flight.module';

@Module({
  imports: [FlightModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
