import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CustomerService } from '../../shared/services/customer.service';
import { CustomerController } from './customer.controller';

@Module({
  controllers: [CustomerController],
  providers: [CustomerService, PrismaService],
  exports: [CustomerService]
})
export class CustomerModule { }
