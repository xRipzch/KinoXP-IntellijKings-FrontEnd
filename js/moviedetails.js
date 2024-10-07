const movieContainer = document.querySelector(".movie-container");
const inpButton = document.getElementById("set-movie-id");
const inpMovieId = document.getElementById("movie-id");

//////////////////////////////////////////////////

// Create and update the HTML content for the movie details
// Take the container element and the movie object as input
async function updateInnerHtml(container, movie) {
    container.innerHTML = "";

    // Create and update the HTML for displaying movie details
    container.innerHTML = `
    <div class="movie-container">
        <div class="left-column">
            <img id="movie-img" crossorigin="anonymous" alt="Movie Poster" src="${movie.imageUrl}"/>
        </div>
        <div class="right-column">
            <h1 id="movie-title">${movie.title}</h1>
            <h2><span id="is-3d">${get3dValue(movie.is3d)}</span><span id="movie-duration-in-minutes">${calculateMinutesToHours(movie.durationInMinutes)}</span></h2>
            <h2 id="movie-release-year">${formatDateToShortMonth(movie.releaseYear)}</h2>
            <p id="movie-description">${movie.description}</p>
        </div>
    </div>
    `;

    // Wait for img to load, then set the background
    const img = document.getElementById("movie-img");
    img.onload = function() {
        setBackgroundFromDominantImgColor(img);
    };
}

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
        method: "GET",
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

// Fetch and display movie details inside the specified container
async function showMovie(container, display) {
    const movie = await getMovieById(inpMovieId.value);
    display(container, movie);
}

//////////////////////////////////////////////////

inpButton.addEventListener('click', async () => {
    showMovie(movieContainer, updateInnerHtml);
});


//////////////////////////////////////////////////
//////////////////////////////////////////////////
//----1st draft (Tror ikke det er sÃ¥dan man skal lave det) ----\\
//////////////////////////////////////////////////
//////////////////////////////////////////////////

// This was an initial idea of fetching and displaying movie details on window load.
/*
window.onload = async function() {
    // Fetch movie details from some URL (urlMovie would need to be defined)
    const movie = await fetchAnyUrlJson(urlMovie);
    console.log(movie);

    // Update DOM elements with movie details
    img.src = movie.imageUrl;
    is3d.innerText = get3dValue(movie.is3d);
    title.innerText = movie.title;
    releaseYear.innerText = formatDateToShortMonth(movie.releaseYear);
    durationInMin.innerText = calculateMinutesToHours(movie.durationInMinutes);
    description.innerText = movie.description;

    // Set the background color based on the dominant color in the movie image
    img.onload = function() {
        setBackgroundFromDominantImgColor(img);
    };
};

// Helper function to fetch and parse JSON data from a URL
function fetchAnyUrlJson(url) {
    return fetch(url).then(response => response.json());
}

async function showMovieDetails(movie) {
    console.log(movie);

    // Update DOM elements with the fetched movie details
    img.src = movie.imageUrl;
    is3d.innerText = get3dValue(movie.is3d);
    title.innerText = movie.title;
    releaseYear.innerText = formatDateToShortMonth(movie.releaseYear);
    durationInMin.innerText = calculateMinutesToHours(movie.durationInMinutes);
    description.innerText = movie.description;

    // Set the background color based on the dominant color in the movie image
    img.onload = function() {
        setBackgroundFromDominantImgColor(img);
    };
}
*/