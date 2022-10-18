import { PrismaClient } from '@prisma/client';
import { countries } from './data/countries';
import { airports } from './data/airports';
import { DataGenerator } from '../src/classes/dataGenerator';
let moment = require('moment');
const prisma = new PrismaClient();
async function main() {
    //seed countries

    await seedAirportCities();
    await seedAirports();
    await seedFlights();
}

const seedAirports = async () => {
    for (const airport of airports) {
        await prisma.airport.create({
            data: {
                name: airport.name,
                country: {
                    connectOrCreate: {
                        where: { name: airport.country },
                        create: {
                            name: airport.country,
                            code: '',
                        }
                    }
                },
                city: { connect: { name: airport.city } },
                code: airport.iata_code,
                geo_lat: airport._geoloc.lat,
                geo_long: airport._geoloc.lng,
            },
        });
    }
};
const seedAirportCities = async () => {
    for (const airport of airports) {
        await prisma.city.upsert({
            where: { name: airport.city },
            update: {},
            create: {
                country: {
                    connectOrCreate: {
                        where: { name: airport.country },
                        create: {
                            name: airport.country,
                            code: '',
                        },
                    },
                },
                name: airport.city,
            },
        });
    }
};

const seedFlights = async () => {
    const generator = new DataGenerator();
    const numOfFlights = 100;

    await prisma.airport.findMany().then(async (airports) => {

        for (let airport of airports) {
            let randomAirport = Math.floor(Math.random() * (airports.length - 0) + 0);
            let randomAirport2 = Math.floor(Math.random() * (airports.length - 0) + 0);
            let randomHour = Math.floor(Math.random() * (24 - 1) + 1)
            let date = generator.genRandomDateTimestamp();

            let dateFormatted = new Date(moment(new Date(date)));
            let dateAdded = new Date(moment(dateFormatted).add(randomHour, 'hours'));

            let flight = {
                number: generator.genFlightNumber(),
                airport_departure: airports[randomAirport].id_airport,
                airport_destination: airports[randomAirport2].id_airport,
                date_departure: dateFormatted,
                date_arrival: dateAdded,
                price: Math.floor(Math.random() * (1000 - 1) + 1000),
            }

            await prisma.flight.create({
                data: {
                    number: flight.number,
                    airport_departure: { connect: { id_airport: flight.airport_departure } },
                    airport_destination: { connect: { id_airport: flight.airport_destination } },
                    date_departure: flight.date_departure,
                    date_arrival: flight.date_arrival,
                    price: flight.price,
                }
            });

        };
    });


}


main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });