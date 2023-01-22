import { PrismaClient } from '@prisma/client';
import { countries } from './data/countries';
import { airports } from './data/airports';
import { DataGenerator } from '../src/classes/dataGenerator';
import * as _ from 'lodash';
let moment = require('moment');
const prisma = new PrismaClient();
async function main() {
    //seed countries

    await seedAirportCities();
    await seedAirports();
    await seedAircrafts();
    await seedFlights();
}
let allowed_countries = ['Poland', 'China', 'United States', 'Norway', 'Sweden', 'United Kingdom', 'Germany', 'France', 'Spain', 'Italy', 'Azerbaijan', 'Australia'];
const seedAirports = async () => {
    for (const airport of airports) {
        if (!allowed_countries.includes(airport.country)) {
            continue;
        }
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

    //let allowed_countries = ['Poland', 'China', 'United States', 'Norway', 'Sweden', 'United Kingdom', 'Germany', 'France', 'Spain', 'Italy', 'Greece', 'Turkey', 'Russia', 'Ukraine', 'Belarus', 'Romania', 'Bulgaria', 'Czech Republic', 'Slovakia', 'Hungary', 'Austria', 'Switzerland', 'Netherlands', 'Belgium', 'Luxembourg', 'Portugal', 'Ireland', 'Denmark', 'Finland', 'Estonia', 'Latvia', 'Lithuania', 'Croatia', 'Serbia', 'Azerbaijan'];

    for (const airport of airports) {
        if (!allowed_countries.includes(airport.country)) {
            continue;
        }
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

const calculteDistanceBetweenAirports = (lat1, lon1, lat2, lon2, unit = "K") => {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == "K") { dist = dist * 1.609344 }
        if (unit == "N") { dist = dist * 0.8684 }
        return dist;
    }
}

const seedFlights = async () => {
    const generator = new DataGenerator();
    const numOfFlights = 5500;

    await prisma.airport.findMany().then(async (airports) => {

        for (let i = 0; i < numOfFlights; i++) {
            let randomAirport = Math.floor(Math.random() * (airports.length - 0) + 0);
            let randomAirport2 = Math.floor(Math.random() * (airports.length - 0) + 0);
            let randomHour = Math.floor(Math.random() * (24 - 1) + 1)
            let date = generator.genRandomDateTimestamp();

            let dateFormatted = new Date(moment(new Date(date)));


            let randomAircraft = Math.floor(Math.random() * (100 - 1) + 1);


            //get the random choosen aircraft speed to calculate the flight duration
            let aircraft = await prisma.aircraft.findFirst({
                where: {
                    id_aircraft: randomAircraft
                }
            });

            let flightDistance = calculteDistanceBetweenAirports(airports[randomAirport].geo_lat, airports[randomAirport].geo_long, airports[randomAirport2].geo_lat, airports[randomAirport2].geo_long);
            let flightDuration = flightDistance / aircraft.avg_speed;

            let dateAdded = new Date(moment(dateFormatted).add(flightDuration, 'hours'));

            let flight = {
                number: generator.genFlightNumber(),
                airport_departure: airports[randomAirport].id_airport,
                airport_destination: airports[randomAirport2].id_airport,
                date_departure: dateFormatted,
                date_arrival: dateAdded,
                price: Math.floor(Math.random() * (1000 - 1) + 1000),
            }

            let flightExists = await prisma.flight.findFirst({
                where: {
                    number: flight.number,
                }
            });
            if (_.isEmpty(flightExists)) {
                await prisma.flight.create({
                    data: {
                        number: flight.number,
                        airport_departure: { connect: { id_airport: flight.airport_departure } },
                        airport_destination: { connect: { id_airport: flight.airport_destination } },
                        Aircraft: { connect: { id_aircraft: randomAircraft } },
                        date_departure: flight.date_departure,
                        date_arrival: flight.date_arrival,
                        duration: flightDuration,
                        distance: flightDistance,
                        price: flight.price,
                    }
                });
            }



        };
    });


}
const seedAircrafts = async () => {
    const generator = new DataGenerator();
    const numOfAircrafts = 100;
    for (let i = 0; i < numOfAircrafts; i++) {
        const { model, manufacturer } = generator.genAircraftNameAndManufacturer();
        await prisma.aircraft.create({
            data: {
                model,
                manufacturer,
                registration: generator.genAircraftRegistration(),
                capacity: Math.floor(Math.random() * (128 - 30) + 30),
                avg_speed: generator.genAircraftSpeed()
            },
        });
    }
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
