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

    genRandomDate(): Date {
        let timestamp = this.genRandomDateTimestamp();
        return new Date(timestamp);
    }

    genRandomDateTimestamp(): number {
        var startDate = new Date(2021, 0, 1).getTime();
        var endDate = new Date(2022, 0, 1).getTime();
        var spaces = (endDate - startDate);
        var timestamp = Math.round(Math.random() * spaces);
        timestamp += startDate;
        return timestamp;
    }

}
