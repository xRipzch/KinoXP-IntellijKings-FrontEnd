import {fetchMovies, fetchMovieById, fetchShowingByTheaterAndDate, fetchTheaters} from './api/apiservice.js';

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
        option.textContent = movie.title + " " + (movie.is3D ? '[3D]' : '[2D]' + movie.durationInMinutes);
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
            option.value = theater.id;
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
    const selectedMovieDuration = selectedMovie.durationInMinutes;

    const firstShowingTime = new Date(selectedDate + 'T12:00');
    const lastShowingTime = new Date(selectedDate + 'T21:00');

    // Create a mapping of unavailable times to their respective movies
    const unavailableSlots = fetchedShowings.map(showing => {
        const showingStart = new Date(showing.startTime);
        const showingEnd = new Date(showingStart.getTime() + (showing.movie.durationInMinutes + 15) * 60000); // End time with buffer
        return { start: showingStart, end: showingEnd, title: showing.movie.title, id: showing.id };
    });

    // Clear the dropdown and add default option
    timeDropdown.innerHTML = '<option value="">-- Select a Time --</option>';

    for (let currentTime = new Date(firstShowingTime); currentTime <= lastShowingTime; currentTime.setMinutes(currentTime.getMinutes() + 30)) {
        const slotEnd = new Date(currentTime.getTime() + (selectedMovieDuration + 15) * 60000); // End time for selected movie

        // Check if this slot is unavailable due to other showings
        const isOverlapping = unavailableSlots.some(slot => {
            return currentTime < slot.end && slotEnd > slot.start; // Check for overlap
        });

        // Find the next showing start time
        const nextShowingStart = unavailableSlots.find(slot => slot.start > currentTime)?.start || null;

        // Check if the selected movie duration exceeds the time available until the next showing
        const isTooLong = nextShowingStart && slotEnd > nextShowingStart; // Only check if there is a next showing

        const hours = currentTime.getHours().toString().padStart(2, '0'); // Format hours
        const minutes = currentTime.getMinutes().toString().padStart(2, '0'); // Format minutes
        const timeSlot = `${hours}:${minutes}`;

        const option = document.createElement('option');
        option.value = timeSlot;

        if (isTooLong) {
            option.textContent = `${timeSlot} - Unavailable (Conflict with next showing)`;
            option.disabled = true; // Disable the option so it's not clickable
        } else if (isOverlapping) {
            // Find the movie title for the overlapping slot
            const overlappingSlot = unavailableSlots.find(slot => currentTime < slot.end && slotEnd > slot.start);
            option.textContent = `${timeSlot} - Unavailable (Showing id: ${overlappingSlot.id} - ${overlappingSlot.title})`;
            option.disabled = true; // Disable the option so it's not clickable
        } else {
            option.textContent = `${timeSlot} - Available`;
        }

        timeDropdown.appendChild(option);
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
        const selectedMovie= await fetchMovieById(movieDropdown.value);
        showingTime.disabled = false;
        populateTimeDropdown(fetchedShowings, selectedMovie);
    });
});


