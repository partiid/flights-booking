import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsDateString, Min, Max } from 'class-validator';

export class FlightModel {

    id_flight?: number;

    @ApiProperty()
    @IsNotEmpty()
    number: flightNumber;

    @ApiProperty()
    @IsInt()
    id_departure: number;

    @ApiProperty()
    @IsInt()
    id_destination: number;

    @ApiProperty()
    @IsDateString()
    date_departure: Date;

    date_arrival?: Date;

    @ApiProperty()
    @IsInt()
    price: number;

    @ApiProperty()
    @IsInt()
    @Min(1)
    @Max(100)
    id_aircraft: number;

    duration?: number;
    distance?: number;


}
export type flightNumber = `${string}${string}${number}${number}${number}`;