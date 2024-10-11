import {
    fetchSeatsByTheaterId,
    fetchReservedSeatsByReservation,
    fetchReservationsByShowing,
    fetchTempReservedSeatsByShowing
} from './api/apiservice.js';

let seats = [];
let allReservedSeats = [];


async function populateSeatHtml() {

    try {
        seats = await fetchSeatsByTheaterId(1);
        console.log('Seats fetched:', seats);
    } catch (error) {
        console.error('Error fetching seats:', error);
        return;
    }

    const seatContainer = document.getElementById('seat-container'); // Assuming you have this container in your HTML

    seats.forEach(seat => {
        //Check if the seat is reserved
        const isReserved = allReservedSeats.some(reservedSeat => reservedSeat.id === seat.id);

        // Create a div for each seat
        let seatBox = document.createElement('div');
        seatBox.innerHTML = `
        <input type="checkbox" name="seat" class="seat-checkbox" id="seat-${seat.id}">
        <label for="seat-${seat.id}" class="visually-hidden">Seat ${seat.id}</label>
`;
        if (isReserved) {
            seatBox.classList.add('reserved-seat'); // Add reserved seat class for styling
        }

        seatBox.classList.add('seat-box');
        seatContainer.appendChild(seatBox);
        console.log(`Seat ${seat.id} checkbox added`);
    });

    // After seats are populated, attach event listeners
    attachSeatListeners();
}

function getShowingIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('showing'); // Retrieves 'id' from the URL like ?id=123
}

function attachSeatListeners() {
    const tickets = document.querySelectorAll('.seat-checkbox');

    if (tickets.length === 0) {
        console.error('No seat checkboxes found!');
        return;
    }

    console.log('Attaching event listeners to seat checkboxes...');

    tickets.forEach(ticket => {
        ticket.addEventListener('change', () => {
            console.log(`Checkbox ${ticket.id} changed`);  // Log when checkbox is clicked
            let amount = document.querySelector('.amount').innerHTML;
            let count = document.querySelector('.count').innerHTML;

            amount = Number(amount);
            count = Number(count);

            if (ticket.checked) {
                count += 1;
                amount += 200;
            } else {
                count -= 1;
                amount -= 200;
            }

            document.querySelector('.amount').innerHTML = amount;
            document.querySelector('.count').innerHTML = count;
        });
    });
}

////////////////////////////////////////////////////
////////////////////////////////////////////////////

async function updateReservedSeats() {
    const showingId = getShowingIdFromUrl();
    //fetch reservations for the showing
    let reservations = []

    try {
        reservations = await fetchReservationsByShowing(showingId);
    } catch (error) {
        console.error('Error fetching reservations:', error);
        return [];
    }

    let allReservedSeats = [];

    // Loop through each reservation and fetch the reserved seats
    for (const reservation of reservations) {
        let reservedSeats = [];

        try {
            // Assuming each reservation has an `id` property, fetch the reserved seats for that reservation
            reservedSeats = await fetchReservedSeatsByReservation(reservation.id);

            // Push reserved seats into the allReservedSeats array
            allReservedSeats.push(...reservedSeats);

        } catch (error) {
            console.error(`Error fetching reserved seats for reservation ${reservation.id}:`, error);
        }
    }
    //fetch temp reserved seats
    let tempReservedSeats = []

    try {
        tempReservedSeats = await fetchTempReservedSeatsByShowing(showingId);
    } catch (error) {
        console.error('Error fetching temp reserved seats:', error);
        return [];
    }

    allReservedSeats.push(...tempReservedSeats);

    //compare reserved and temp seats



    //set seats to unavailable
}

console.log("seatselc js load");

////////////////////////////////////

document.addEventListener('DOMContentLoaded', () => {
    populateSeatHtml().then(() => {
        updateReservedSeats().then();
        console.log('Seat HTML populated and event listeners attached');
    }).catch(error => {
        console.error('Error populating seats', error);
    });
});
