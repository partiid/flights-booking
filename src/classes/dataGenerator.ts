import { expand } from 'regex-to-strings';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DataGenerator {
    //write a function to generate a flight number
    genFlightNumber(): string {
        const pattern = expand(/[A-Z]{2}[0-9]{3}$/);
        for (const flightNumber of pattern.getIterator()) {
            return flightNumber;
        }
    }
}
