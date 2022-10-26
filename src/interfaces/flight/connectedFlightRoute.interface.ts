import { Flight } from "@prisma/client";
export interface connectedFlightRoute {
    id_flight_order: number;
    flight: Flight;

}