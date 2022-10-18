export interface flightRoute {
    id_flight: number;


    departure: {
        name: string;
        code: string;
        id: number;
    },
    destination: {
        name: string;
        code: string;
        id: number;
    }


}