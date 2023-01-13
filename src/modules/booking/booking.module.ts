import { Module, forwardRef } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { CustomerModule } from '../customer/customer.module';
import { PrismaService } from 'src/prisma.service';
import { FlightModule } from '../flight/flight.module';

@Module({
  controllers: [BookingController],
  providers: [BookingService, PrismaService],
  exports: [BookingService],
  imports: [CustomerModule, forwardRef(() => FlightModule)]
})
export class BookingModule { }
