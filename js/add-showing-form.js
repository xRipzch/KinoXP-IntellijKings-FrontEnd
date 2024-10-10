import {
    fetchMovies,
    fetchMovieById,
    fetchShowingByTheaterAndDate,
    fetchTheaters,
    addShowing,
    fetchTheaterById
} from './api/apiservice.js';

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
    const selectedMovieDuration = selectedMovie.durationInMinutes + 30;

    const firstShowingTime = new Date(`${selectedDate}T12:00`);
    const lastShowingTime = new Date(`${selectedDate}T23:59`);

    // Map showing times to their start, end, title, and id
    const occupiedSlots = fetchedShowings.map(showing => ({
        start: new Date(showing.startTime),
        end: new Date(new Date(showing.startTime).getTime() + (showing.movie.durationInMinutes + 30) * 60000), // Only based on showing's duration
        title: showing.movie.title,
        id: showing.id
    }));

    // Clear the dropdown and add default option
    timeDropdown.innerHTML = '<option value="">-- Select a Time --</option>';

    // Array to store available time slots
    const availableSlots = [];

    // Loop through available time slots in 30-minute intervals
    for (let currentTime = new Date(firstShowingTime); currentTime <= lastShowingTime; currentTime.setMinutes(currentTime.getMinutes() + 30)) {
        let optionText = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
        const option = document.createElement('option');
        option.value = optionText;

        // Check if this time slot overlaps with any existing showing
        const overlappingSlot = occupiedSlots.find(slot => currentTime < slot.end && currentTime >= slot.start);

        // If there's an overlap, mark the time slot as unavailable
        if (overlappingSlot) {
            optionText += ` - Unavailable (Showing id: ${overlappingSlot.id} - ${overlappingSlot.title})`;
            option.disabled = true;
        } else {
            // Add available slots to the array
            availableSlots.push({ time: new Date(currentTime), option });
        }
        // Set the option text and append to the dropdown
        option.textContent = optionText;
        timeDropdown.appendChild(option);
    }

    // Loop to check for consecutive available slots
    const disabledSlots = new Set(); // Set to keep track of slots to disable

    for (let i = 0; i < availableSlots.length; i++) {
        let consecutiveSlots = 1;
        for (let j = i + 1; j < availableSlots.length; j++) {
            if (availableSlots[j].time - availableSlots[j - 1].time === 30 * 60000) {
                consecutiveSlots++;
            } else {
                break; // Exit the loop if the sequence is broken
            }
        }

        // Calculate the available duration in minutes
        const availableDuration = consecutiveSlots * 30;
        if (availableDuration < selectedMovieDuration) {
            for (let k = i; k < i + consecutiveSlots && k < availableSlots.length; k++) {
                if (!disabledSlots.has(availableSlots[k].option.value)) { // Only disable if not already marked
                    const option = availableSlots[k].option;
                    option.disabled = true;
                    option.textContent += ' - Unavailable (Insufficient consecutive time)';
                    disabledSlots.add(option.value); // Mark this option as disabled
                }
            }
        }
    }




}

/////////////////////////////EVENT LISTENERS/////////////////////////////
document.addEventListener('DOMContentLoaded', () => {
    const addShowingForm = document.getElementById("add-input-form");

    populateMovieDropdown().then(() => {
    }).catch((error) => {
        console.error('Error populating movies:', error);
    });

    populateTheaterDropdown().then(() => {
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

    addShowingForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        try {
            const formData = new FormData(addShowingForm);

            const showingDate = formData.get('showingDate');
            const showingTime = formData.get('showingTime');

            // Combine date and time into a LocalDateTime format
            const startDateTime = `${showingDate}T${showingTime}`;

            const showingData = {
                movie: await fetchMovieById(movieDropdown.value),
                theater: await fetchTheaterById(theaterDropdown.value),
                startTime: startDateTime

            };
            console.log("Showing data being sent:", showingData);

            await addShowing(showingData);

            alert('Showing added successfully!');

            addShowingForm.reset();

        } catch (error) {
            console.error('Error processing form data', error);
        }
    });

});


