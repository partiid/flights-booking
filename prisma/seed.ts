import { PrismaClient } from '@prisma/client';
import { countries } from './data/countries';
import { airports } from './data/airports';
const prisma = new PrismaClient();
async function main() {
    //seed countries

    await seedAirportCities();
    await seedAirports();
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
