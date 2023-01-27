import { Controller, HttpCode, Post, HttpStatus, NotFoundException, Body, Get, UseGuards, BadRequestException, Param, ParseIntPipe } from '@nestjs/common';
import { BookingModel } from './booking.model';
import { BookingService } from './booking.service';
import { Booking } from '@prisma/client';
import { ApiBearerAuth, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { Delete } from '@nestjs/common/decorators';
import { JwtAuthGuard } from '../auth/jwtAuth.guard';
@ApiTags('booking')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) { }



  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() booking: BookingModel): Promise<Booking | Error> {


    try {
      return await this.bookingService.create(booking);

    } catch (err) {

      throw new BadRequestException(err);
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/all')
  async getBookings(): Promise<Booking[]> {
    return await this.bookingService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('/booking/:id_booking')
  async deleteBooking(@Param('id_booking', ParseIntPipe) id_booking: number) {
    try {
      return await this.bookingService.delete({ id_booking: id_booking });

    } catch (err) {
      throw new NotFoundException(err);
    }
  }

}
