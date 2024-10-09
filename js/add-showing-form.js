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
            option.value = movie.id; // Assuming each movie has a unique ID
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

/////////////////////////////POPULATE TIME-DROPDOWN/////////////////////////////
function populateTimeDropdown() {
    const timeDropdown = document.getElementById('showingTime');
    const selectedDate = document.getElementById('showingDate').value;

    // Clear existing options
    timeDropdown.innerHTML = '<option value="">-- Select a Time --</option>';

    if (!selectedDate) {
        return;
    }

    const startTime = new Date(selectedDate + 'T12:00');
    const endTime = new Date(selectedDate + 'T21:00');

    for (let currentTime = startTime; currentTime <= endTime; currentTime.setMinutes(currentTime.getMinutes() + 30)) {
        const hours = currentTime.getHours().toString().padStart(2, '0'); // Ensures it is only two digits long
        const minutes = currentTime.getMinutes().toString().padStart(2, '0'); // Ensures it is only two digits long
        const option = document.createElement('option');
        option.value = `${hours}:${minutes}`;
        option.textContent = `${hours}:${minutes}`;
        timeDropdown.appendChild(option);
    }
}

/////////////////////////////EVENT LISTENERS FOR POPULATING DROPDOWNS/////////////////////////////
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


/////////////////////////////EVENT LISTENERS FOR ENABLING NEXT STEPS/////////////////////////////


    movieDropdown.addEventListener('change', () => {
        theaterDropdown.disabled = false;
    });

    // Enable date input when a theater is selected
    theaterDropdown.addEventListener('change', () => {
        showingDate.disabled = false;
    });

    // Enable time dropdown when a date is selected
    showingDate.addEventListener('change', () => {
        showingTime.disabled = false;
        populateTimeDropdown();
    });
});
