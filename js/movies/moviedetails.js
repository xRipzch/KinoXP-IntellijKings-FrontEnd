const movieContainer = document.querySelector(".movie-container");
const img = document.getElementById('movie-img');
const is3d = document.getElementById('is-3d');
const title = document.getElementById('movie-title');
const releaseDate = document.getElementById('movie-release-date');
const durationInMin = document.getElementById('movie-duration-in-minutes');
const description = document.getElementById('movie-description');

//////////////////////////////////////////////////

function calculateMinutesToHours(movieMinutes) {
    let hours = Math.floor(movieMinutes / 60);
    let minutes = movieMinutes % 60;
    return hours + "H " + minutes + "M";
}

// Format date from (YYYY-MM-DD) to (Mon-DD-YYYY)
function formatDateToShortMonth(releaseDateString) {
    const date = new Date(releaseDateString);
    let month = date.toLocaleDateString('default', { month: 'short' });
    return month + " " + date.getDate() + ", " + date.getFullYear();
}

// Use ColorThief to find the dominant color from an image and set it as background
function setBackgroundFromDominantImgColor(image) {
    const colorThief = new ColorThief();

    // Ensure image has dimensions before extracting color
    if (image.complete && image.naturalWidth > 0 && image.naturalHeight > 0) {
        let color = colorThief.getColor(image);
        movieContainer.style.backgroundImage = `linear-gradient(to top, rgb(23, 23, 23), rgb(${color.join(',')}))`;
    } else {
        console.error("Image not loaded or has invalid dimensions.");
    }
}

function get3dValue(is3d) {
    return (is3d) ? "3D" : "2D";
}

// Fetch movie details by the movie ID
async function getMovieById(movieId) {
    const url = "http://localhost:8080/movie/" + movieId;

    // Specify fetch request options (GET method)
    const fetchOptions = {
        method: "GET", //todo boiler plate
    };

    // Fetch movie details
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
        const errorMessage = await response.text();
        console.error(errorMessage);
        return null;
    } else {
        return await response.json();
    }
}

// Update elements with movie details
function displayMovie(movie) {
    img.src = movie.imageUrl;
    is3d.innerText = get3dValue(movie.is3d);
    title.innerText = movie.title;
    releaseDate.innerText = formatDateToShortMonth(movie.releaseDate);
    durationInMin.innerText = calculateMinutesToHours(movie.durationInMinutes);
    description.innerText = movie.description;

    // Set the background color based on the dominant color in the movie image
    img.onload = function() {
        setBackgroundFromDominantImgColor(img);
    };

    // Display movie container after everything has loaded
    movieContainer.style.display = 'flex';
}

//////////////////////////////////////////////////

window.onload = async function() {
    const params = new URLSearchParams(window.location.search);
    const movieId = params.get('id'); // Retrieves 'id' from the URL like ?id=123
    const movie = await getMovieById(movieId);
    // Show loading indicator
    displayMovie(movie)
};