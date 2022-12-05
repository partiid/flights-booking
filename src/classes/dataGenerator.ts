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
    genAircraftNameAndManufacturer(): AircraftNameAndManufacturer {
        const names = ['Boeing', 'Airbus', 'Lockhead Martin', 'General Electric', 'Northrop Grumman'];
        const models = [

            'B707',
            'B717',
            'B727',
            'B737',
            'B747',
            'B757',
            'B767',
            'B777',
            'B787',
            'C-130',
            'C-17',
            'C-5',
            'C-21',
            'C-37',
            'C-40',
            'C-46',
            'C-47',
            'C-54',
            'C-55',
            'C-56',
            'C-57',
            'C-60',
            'C-61',
            'C-69',
            'C-70',
            'C-75',
            'C-77',
            'C-78',
            'C-82',
            'C-97',
        ];

        const randomName = Math.floor(Math.random() * (names.length - 0) + 0);
        const randomModel = Math.floor(Math.random() * (models.length - 0) + 0);
        return {
            model: models[randomModel],
            manufacturer: names[randomName]
        };

    }
    genAircraftRegistration(): string {
        const pattern = expand(/[A-Z]{2}[0-9]{3}$/);
        for (const registration of pattern.getIterator()) {
            return registration;
        }
    }

}
type AircraftNameAndManufacturer = {
    model: string;
    manufacturer: string;
}