import { isDefined, IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
import { isNumberObject } from 'util/types';
export class BookingModel {

    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    id_customer: number;

    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    id_flight: number;


    @IsNotEmpty()
    @ApiProperty()
    seats?: string[];

    @IsInt()
    number_of_people: number;

    price: number;
    date_booking: Date;



}