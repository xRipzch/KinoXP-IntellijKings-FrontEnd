async function populateMovieDropdown() {
    const movieDropdown = document.getElementById('movieDropdown');

    try {
        const response = await fetch('http://localhost:8080/movies');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const movies = await response.json();
        movies.sort((a, b) => a.title.localeCompare(b.title));

        movies.forEach(movie => {
            const option = document.createElement('option');
            option.textContent = movie.title + " " + (movie.is3D ? '[3D] ' : '[2D] ');
            movieDropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

async function populateTheaterDropdown(){
    const theaterDropdown = document.getElementById('theaterDropdown')

try {
    const response = await fetch('http://localhost:8080/theaters');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const theaters = await response.json();
    theaters.sort((a, b) => a.name.localeCompare(b.name));

    theaters.forEach(theater => {
        const option = document.createElement('option');
        option.textContent = theater.name;
        theaterDropdown.appendChild(option);
    });
} catch (error) {
    console.error('Error fetching movies:', error);
}
}

function populateTimeDropdown() {
    const timeDropdown = document.getElementById('showingTime');
    const selectedDate = document.getElementById('showingDate').value;

    timeDropdown.innerHTML = '<option value="">-- Select a Time --</option>';

    if (!selectedDate) {
        return;
    }

    // Generate times from 09:00 to 23:00 in 30-minute intervals
    const startTime = new Date(selectedDate + 'T12:00'); // Start at 12:00 PM
    const endTime = new Date(selectedDate + 'T21:00');   // End at 21:00 PM

    for (let currentTime = startTime; currentTime <= endTime; currentTime.setMinutes(currentTime.getMinutes() + 30)) {
        const hours = currentTime.getHours().toString().padStart(2, '0');
        const minutes = currentTime.getMinutes().toString().padStart(2, '0');
        const option = document.createElement('option');
        option.value = `${hours}:${minutes}`;
        option.textContent = `${hours}:${minutes}`;
        timeDropdown.appendChild(option);
    }
}

    document.addEventListener('DOMContentLoaded', populateMovieDropdown);
    document.addEventListener('DOMContentLoaded', populateTheaterDropdown);
    document.getElementById('showingDate').addEventListener('change', populateTimeDropdown);

