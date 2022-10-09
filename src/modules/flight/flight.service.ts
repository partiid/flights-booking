import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Flight, Prisma } from '@prisma/client';
@Injectable()
export class FlightService {
  constructor(private prisma: PrismaService) {}

  async findMany() {
    return this.prisma.flight.findMany();
  }

  async flight(
    flightWhereUniqueInput: Prisma.FlightWhereUniqueInput,
  ): Promise<Flight | null> {
    return this.prisma.flight.findUnique({
      where: flightWhereUniqueInput,
    });
  }

  async createFlight(data: Prisma.FlightCreateInput): Promise<Flight> {
    return this.prisma.flight.create({
      data,
    });
  }

  async updateFlight(params: {
    where: Prisma.FlightWhereUniqueInput;
    data: Prisma.FlightUpdateInput;
  }): Promise<Flight> {
    const { where, data } = params;
    return this.prisma.flight.update({
      data,
      where,
    });
  }
  async deleteFlight(where: Prisma.FlightWhereUniqueInput): Promise<Flight> {
    return this.prisma.flight.delete({
      where,
    });
  }
}
