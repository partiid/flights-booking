import { Controller, HttpCode, Post, HttpStatus, Body, UseGuards, NotAcceptableException } from '@nestjs/common';
import { BookingModel } from './booking.model';
import { BookingService } from './booking.service';
import { Booking } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
@ApiTags('booking')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) { }



  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() booking: BookingModel): Promise<Booking | Error> {

    //throw new Error("Not implemented yet");
    try {
      return await this.bookingService.create(booking);

    } catch (e) {

      throw new NotAcceptableException("Error occured while creating booking");
    }
  }


}
