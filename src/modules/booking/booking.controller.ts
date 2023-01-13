import { Controller, HttpCode, Post, HttpStatus, Body } from '@nestjs/common';
import { BookingModel } from './booking.model';
import { BookingService } from './booking.service';
import { Booking } from '@prisma/client';
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() booking: BookingModel): Promise<Booking | Error> {

    //throw new Error("Not implemented yet");

    return this.bookingService.createFromModel(booking);
  }


}
