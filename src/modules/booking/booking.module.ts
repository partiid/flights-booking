import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { CustomerModule } from '../customer/customer.module';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [BookingController],
  providers: [BookingService, PrismaService],
  imports: [CustomerModule]
})
export class BookingModule { }
