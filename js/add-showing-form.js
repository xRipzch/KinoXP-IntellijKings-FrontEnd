const movieDropdown = document.getElementById('movieDropdown');
const theaterDropdown = document.getElementById('theaterDropdown');
const showingDate = document.getElementById('showingDate');
const showingTime = document.getElementById('showingTime');


/////////////////////////////POPULATE MOVIE-DROPDOWN/////////////////////////////
async function populateMovieDropdown() {

    try {
        const response = await fetch('http://localhost:8080/movies');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const movies = await response.json();
        movies.sort((a, b) => a.title.localeCompare(b.title));

        movies.forEach(movie => {
            const option = document.createElement('option');
            option.value = movie.id;
            option.textContent = movie.title + " " + (movie.is3D ? '[3D]' : '[2D]');
            movieDropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

/////////////////////////////POPULATE THEATER-DROPDOWN/////////////////////////////
async function populateTheaterDropdown() {

    try {
        const response = await fetch('http://localhost:8080/theaters');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const theaters = await response.json();
        theaters.sort((a, b) => a.name.localeCompare(b.name));

        theaters.forEach(theater => {
            const option = document.createElement('option');
            option.value = theater.id; // Assuming each theater has a unique ID
            option.textContent = theater.name;
            theaterDropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching theaters:', error);
    }
}

/////////////////////////////FETCH SHOWINGS ON DATE/////////////////////////////
async function fetchShowingsOnDate(theaterId, selectedDate) {
    try {
        const response = await fetch(`http://localhost:8080/showings/${theaterId}/${selectedDate}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const showingsOnDate = await response.json();

        return showingsOnDate;

    } catch (error) {
        console.error('Error fetching showings and movies on specified date:', error);
        return [];
    }
}



/////////////////////////////POPULATE TIME-DROPDOWN/////////////////////////////
function populateTimeDropdown(fetchedShowings) {
    const timeDropdown = document.getElementById('showingTime');
    const selectedDate = document.getElementById('showingDate').value;

    timeDropdown.innerHTML = '<option value="">-- Select a Time --</option>';

    if (!selectedDate) {
        return;
    }

    const startTime = new Date(selectedDate + 'T12:00');
    const endTime = new Date(selectedDate + 'T21:00');

    const unavailableSlots = fetchedShowings.map(showing => {
        const start = new Date(showing.startTime);
        const duration = showing.movie.durationInMinutes; // Access durationInMinutes
        const end = new Date(start.getTime() + (duration + 30) * 60000); // Calculate end time with 15 min buffer
        return { start, end }; // Return the start and end times
    });

    for (let currentTime = startTime; currentTime <= endTime; currentTime.setMinutes(currentTime.getMinutes() + 30)) {
        const isAvailable = unavailableSlots.every(slot => {
            // Check if the current time slot overlaps with any unavailable slot
            const slotStart = currentTime;
            const slotEnd = new Date(currentTime.getTime() + 30 * 60000); // 30-minute slots
            return !(slotStart < slot.end && slotEnd > slot.start); // Check for overlap
        });

        if (isAvailable) {
            const hours = currentTime.getHours().toString().padStart(2, '0'); // Ensures it is only two digits long
            const minutes = currentTime.getMinutes().toString().padStart(2, '0'); // Ensures it is only two digits long
            const option = document.createElement('option');
            option.value = `${hours}:${minutes}`;
            option.textContent = `${hours}:${minutes}`;
            timeDropdown.appendChild(option);
        }
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
        theaterDropdown.disabled = false;
    });

    theaterDropdown.addEventListener('change', () => {
        showingDate.disabled = false;
    });

    showingDate.addEventListener('change', async () => {
        const selectedTheaterId = theaterDropdown.value;
        const fetchedShowings = await fetchShowingsOnDate(selectedTheaterId, showingDate.value);
        showingTime.disabled = false;
        populateTimeDropdown(fetchedShowings);
    });
});

const showingReadyForNextShowingTime = Math.ceil((showingEndTime + 30) / 15) * 15; // Rounded up to the nearest 15 minutes

