import { IsInt } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
import { isNumberObject } from 'util/types';
export class BookingModel {

    @IsInt()
    @ApiProperty()
    id_customer: number;

    @IsInt()
    @ApiProperty()
    id_flight: number;

    @ApiProperty()
    @IsInt()
    number_of_people: number;

    @ApiProperty()
    seats?: number[][];

    @ApiProperty()
    price: number;

    date_booking: Date;



}