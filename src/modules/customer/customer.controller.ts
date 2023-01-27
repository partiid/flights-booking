import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Param, Post, UseFilters, ParseIntPipe } from '@nestjs/common';
import { CustomerService } from '../../shared/services/customer.service';
import { Customer, Prisma } from '@prisma/client';
import { CustomerModel } from './customer.model';
import { UseGuards } from '@nestjs/common/decorators';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { ApiBearerAuth, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwtAuth.guard';

@ApiTags("customer")
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }


  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() customer: CustomerModel): Promise<Customer | Error> {

    return this.customerService.createIfNotExists(customer);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/all')
  async getCustomers(): Promise<Customer[]> {
    return await this.customerService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/:id_customer')
  async getCustomer(@Param('id_customer', ParseIntPipe) id_customer: number): Promise<Customer> {
    return await this.customerService.findOne({ id_customer: id_customer });
  }

}
