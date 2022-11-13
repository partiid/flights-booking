import { IsString, IsNotEmpty, MinLength, IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class CustomerModel {

    id_customer: number;


    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    lastname: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    identification_number: identificationNumber;


}

export type identificationNumber = `${string}${string}${string}${number}${number}${number}`;


