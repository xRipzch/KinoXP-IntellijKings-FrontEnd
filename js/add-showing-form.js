import {fetchMovies, fetchShowingByTheaterAndDate, fetchTheaters} from './api/apiservice.js';

const movieDropdown = document.getElementById('movieDropdown');
const theaterDropdown = document.getElementById('theaterDropdown');
const showingDate = document.getElementById('showingDate');
const showingTime = document.getElementById('showingTime');


/////////////////////////////POPULATE MOVIE-DROPDOWN/////////////////////////////
async function populateMovieDropdown() {
    let movies = [];

    try {
        movies = await fetchMovies();
    } catch (error) {
        console.error('Error fetching movies:', error);
        return;
    }

    movies.sort((a, b) => a.title.localeCompare(b.title));
    movieDropdown.innerHTML = '';

    movies.forEach(movie => {
        const option = document.createElement('option');
        option.value = movie.id;
        option.textContent = movie.title + " " + (movie.is3D ? '[3D]' : '[2D]');
        movieDropdown.appendChild(option);
})
}


/////////////////////////////POPULATE THEATER-DROPDOWN/////////////////////////////
async function populateTheaterDropdown() {
    let theaters = [];

    try {
         theaters = await fetchTheaters()
    } catch (error) {
        console.error('Error fetching theaters:', error);
        return;
    }

        theaters.sort((a, b) => a.name.localeCompare(b.name));
        theaterDropdown.innerHTML = '';

        theaters.forEach(theater => {
            const option = document.createElement('option');
            option.value = theater.id; // Assuming each theater has a unique ID
            option.textContent = theater.name;
            theaterDropdown.appendChild(option);
        });
}

/////////////////////////////FETCH SHOWINGS ON DATE/////////////////////////////
async function fetchShowingsOnDate(theaterId, selectedDate) {
    try {
        return await fetchShowingByTheaterAndDate(theaterId, selectedDate);
        } catch (error) {
        console.error('Error fetching showings on specified date:', error);
        return [];
    }
}



/////////////////////////////POPULATE TIME-DROPDOWN/////////////////////////////
function populateTimeDropdown(fetchedShowings, selectedMovie) {
    const timeDropdown = document.getElementById('showingTime');
    const selectedDate = document.getElementById('showingDate').value;
    const availableSlots = [];

    const firstShowingTime = new Date(selectedDate + 'T12:00');
    const lastShowingTime = new Date(selectedDate + 'T21:00');

    const unavailableSlots = fetchedShowings.map(showing => {
        const showingStart = new Date(showing.startTime);
        const showingEnd = new Date(showingStart.getTime() + (showing.movie.durationInMinutes + 30) * 60000); // Calculate end time with 30 min buffer
        return { start: showingStart, end: showingEnd };
    });



    for (let currentTime = firstShowingTime; currentTime <= lastShowingTime; currentTime.setMinutes(currentTime.getMinutes() + 30)) {

        const isAvailable = unavailableSlots.every(slot => {
            // Check if the current time slot overlaps with any unavailable slot
            const slotStart = currentTime;
            const slotEnd = new Date(currentTime.getTime() + 30 * 60000);
            return !(slotStart < slot.end && slotEnd > slot.start); // Check for overlap
        });

        if (isAvailable) {
            const hours = currentTime.getHours().toString().padStart(2, '0'); // Ensures it is only two digits long
            const minutes = currentTime.getMinutes().toString().padStart(2, '0'); // Ensures it is only two digits long
            availableSlots.push(`${hours}:${minutes}`);
        }
    }

    if (availableSlots.length === 0) {
        alert('No available times for this date. Please select another date.');
    } else {
        // Otherwise, add the available slots to the dropdown
        availableSlots.forEach(slot => {
            const option = document.createElement('option');
            option.value = slot;
            option.textContent = slot;
            timeDropdown.appendChild(option);
        });
    }
}

/////////////////////////////EVENT LISTENERS/////////////////////////////
document.addEventListener('DOMContentLoaded', () => {
    populateMovieDropdown().then(() => {
        console.log('Movies populated');
    }).catch((error) => {
        console.error('Error populating movies:', error);
    });

    populateTheaterDropdown().then(() => {
        console.log('Theaters populated');
    }).catch((error) => {
        console.error('Error populating theaters:', error);
    });


    movieDropdown.addEventListener('change', () => {
        theaterDropdown.value = ''; //Reset the theater selection
        showingDate.value = ''; // Reset the date selection
        theaterDropdown.disabled = false;
    });

    theaterDropdown.addEventListener('change', () => {
        showingDate.value = ''; // Reset the date selection
        showingTime.innerHTML = '<option value="">-- Select a Time --</option>'; // Reset the time dropdown
        showingDate.disabled = false; // Enable the date selection
        showingTime.disabled = true; // Disable the time selection until a date is selected

    });

    showingDate.addEventListener('change', async () => {
        const selectedTheaterId = theaterDropdown.value;
        const fetchedShowings = await fetchShowingsOnDate(selectedTheaterId, showingDate.value);
        const selectedMovie = theaterDropdown.value;
        showingTime.disabled = false;
        populateTimeDropdown(fetchedShowings, selectedMovie);
    });
});


