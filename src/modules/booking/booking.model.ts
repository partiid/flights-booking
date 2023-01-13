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
    seats?: string;

    @IsInt()
    number_of_people: number;

    price: number;
    date_booking: Date;



}