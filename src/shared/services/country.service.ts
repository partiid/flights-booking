import { Injectable } from '@nestjs/common';
import { ServiceInterface } from 'src/interfaces/service.interface';
import { Country } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { FlightService } from './flight.service';
import { Flight } from '@prisma/client';
@Injectable()
export class CountryService implements ServiceInterface<Country> {
    constructor(readonly prisma: PrismaService,
        readonly flightsService: FlightService) { }
    async findAll(): Promise<Country[]> {
        return this.prisma.country.findMany();
    }
    async findOne(countryWhereUniqueInput: { id_country: number; }): Promise<Country | null> {
        return this.prisma.country.findUnique({
            where: countryWhereUniqueInput,
        });
    }
    async findByName(name: string): Promise<Country | null> {
        return this.prisma.country.findUnique({
            where: {
                name: name
            }
        })
    }
    async create(data: any): Promise<Country> {
        throw new Error('Method not allowed');
        // return this.prisma.country.create({
        //     data,
        // });
    }
    async update(params: {
        where: { id_country: number; };
        data: any;
    }): Promise<Country> {
        throw new Error('Method not allowed');
        // const { where, data } = params;
        // return this.prisma.country.update({
        //     data,
        //     where,
        // });
    }
    async delete(where: { id_country: number; }): Promise<Country> {
        throw new Error('Method not allowed');
        // return this.prisma.country.delete({
        //     where,
        // });
    }

    /**
     * Return all the countries that has at least one flight from any airport in it 
     */
    async findAllWithFlights(): Promise<Country[]> {
        const flights: Flight[] = await this.flightsService.findAll();


        return [];

    }

}
