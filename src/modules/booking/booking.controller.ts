import { Controller, HttpCode, Post, HttpStatus } from '@nestjs/common';
import { BookingModel } from './booking.model';
import { BookingService } from './booking.service';
import { Booking } from '@prisma/client';
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(booking: BookingModel): Promise<Booking | Error> {


    return this.bookingService.createFromModel(booking);
  }


}
