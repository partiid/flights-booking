export class AircraftSeating {


    static getSeatsTable(numberOfSeats: number): string[][] {
        let numberOfSeatsInRow = 6;

        let numberOfRows = Math.ceil(numberOfSeats / numberOfSeatsInRow);
        //create two dimensional array of seats 
        let seatsTable = new Array(numberOfRows);
        for (let i = 0; i < numberOfRows; i++) {
            seatsTable[i] = new Array(numberOfSeatsInRow);
        }
        //fill seatsTable with seat numbers
        for (let i = 0; i < numberOfSeatsInRow; i++) {
            //assign letters to seats
            let seatLetter = String.fromCharCode(65 + i);
            for (let j = 0; j < numberOfRows; j++) {
                //assign numbers to seats
                let seatNumber = j + 1;
                seatsTable[j][i] = seatNumber + seatLetter;
            }


        }
        return seatsTable;

    }

    static getSeatNumber(seat: string): number {
        let seatNumber = seat.match(/\d+/g);
        return parseInt(seatNumber[0]);

    }
    static getSeatLetter(seat: string): string {
        let seatLetter = seat.match(/[a-zA-Z]+/g);
        return seatLetter[0].toString();
    }

    static convertSeatToIndex(seat: string, seatsTable: string[][]): number[] {
        let seatNumber = this.getSeatNumber(seat);
        let seatLetter = this.getSeatLetter(seat);
        let seatIndex = [seatNumber - 1, seatLetter.charCodeAt(0) - 65];
        return seatIndex;
    }
    static occupiedSeats(capacity: number, seatsArr: string[]): string[][] {
        let seatsTable = this.getSeatsTable(capacity);
        seatsArr.forEach(seat => {
            let seatIndex = this.convertSeatToIndex(seat, seatsTable);
            console.log(seatIndex);
            seatsTable[seatIndex[0]][seatIndex[1]] = "X";
        });
        return seatsTable;
    }




}