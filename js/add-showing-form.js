// Function to populate the dropdown with movie options
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
    theaters.sort((a, b) => a.title.localeCompare(b.title));

    theaters.forEach(theater => {
        const option = document.createElement('option');
        option.textContent = theater.name;
        theaterDropdown.appendChild(option);
    });
} catch (error) {
    console.error('Error fetching movies:', error);
}
}


document.addEventListener('DOMContentLoaded', populateMovieDropdown);
document.addEventListener('DOMContentLoaded', populateTheaterDropdown);
