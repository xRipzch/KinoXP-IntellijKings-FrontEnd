import {
    fetchMovies,
    fetchSeatsByTheaterId
} from './api/apiservice.js';

window.onload = pupulateSeatHtml();

async function pupulateSeatHtml () {
    let seats = [];

    try {
        seats = await fetchSeatsByTheaterId(1);
        console.log('Seats fetched:', seats); // Check the fetched data format
    } catch (error) {
        console.error('Error fetching seats:', error);
        return;
    }

    const seatContainer = document.getElementById('seat-container'); // Assuming you have this container in your HTML

    // Ensure that seats is an array before proceeding
    if (!Array.isArray(seats)) {
        console.error('Seats is not an array:', seats);
        return;
    }

    seats.forEach(seat => {
        // Create a select element for each seat
        const seatSelect = document.createElement('select');

        // Add an option or any other details for each seat
        const seatOption = document.createElement('option');
        seatOption.value = seat.id; // Assuming seat object has an 'id' field
        seatOption.text = `Seat ${seat.number}`; // Assuming seat object has a 'number' field

        seatSelect.appendChild(seatOption);
        seatContainer.appendChild(seatSelect); // Append the select element to the container
    });
}

console.log("seatselc js load");
