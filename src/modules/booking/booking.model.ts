import { IsInt } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
import { isNumberObject } from 'util/types';
export class BookingModel {

    @ApiProperty()
    @IsInt()
    id_customer: number;

    @ApiProperty()
    @IsInt()
    id_flight: number;

    @ApiProperty()
    @IsInt()
    number_of_people: number;

    @ApiProperty()
    seats?: Array<number[]>;

    @ApiProperty()
    price: number;

    date_booking: Date;



}