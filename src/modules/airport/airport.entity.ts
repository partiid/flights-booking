import { Exclude } from 'class-transformer';


export class AirportEntity {

    id_airport: number;

    id_country: number;

    id_city: number;

    name: string;
    code: string;
    geo_lat: number;
    geo_long: number;



    constructor(partial: Partial<AirportEntity>) {

        Object.assign(this, partial);
    }


}