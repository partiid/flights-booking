import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Param, Post, UseFilters } from '@nestjs/common';
import { CustomerService } from '../../shared/services/customer.service';
import { Customer, Prisma } from '@prisma/client';
import { CustomerModel } from './customer.model';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }


  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() customer: CustomerModel): Promise<Customer | Error> {

    return this.customerService.createIfNotExists(customer);
  }
  

}
