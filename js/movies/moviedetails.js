import {fetchMovieById, fetchShowingsByMovieAndDate} from "../api/apiservice.js";
import {getHourMinuteFromDateTime} from "../api/movieinfoconverters.js";

const movieContainer = document.querySelector(".movie-container");
const img = document.getElementById('movie-img');
const is3d = document.getElementById('is-3d');
const title = document.getElementById('movie-title');
const releaseDate = document.getElementById('movie-release-date');
const durationInMin = document.getElementById('movie-duration-in-minutes');
const description = document.getElementById('movie-description');
const dateGoLeft = document.querySelector('.date-selector-go-left');
const dateGoRight = document.querySelector('.date-selector-go-right');
const dateMargin = document.querySelector('.date-margin');
const movieId = getMovieIdFromUrl();

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

async function updateUrlWithShowings(movieId, date) {
    const newDate = date.toISOString().split('T')[0]; // This could be dynamic if needed
    const newUrl = `../movies/movie-details.html?id=${movieId}&date=${newDate}`;
    window.history.pushState({}, '', newUrl);

    const params = new URLSearchParams(window.location.search);
    const formattedDate = params.get('date'); // Retrieves 'Date' from the URL like ?id=123

    showings = await fetchShowingsByMovieAndDate(movieId, formattedDate);
    console.log(showings)
}

const today = new Date();
const dateButtonsContainer = document.getElementById('date-container');

async function createShowingDateButtons(startDate, days) {
    for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const button = document.createElement('button');
        button.classList.add('date-button')
        button.textContent = i === 0 && startDate.getTime() === today.getTime()
            ? 'Today'
            : `${date.toLocaleDateString('en-US', { month: 'short' })} ${date.getDate()}${
                date.getFullYear() > today.getFullYear() ? ` ${date.getFullYear()}` : ''
            }`;

        const buttonText = button.innerHTML;
        const [firstPart, secondPart, thirdPart] = buttonText.split(' '); // Split by space

        button.innerHTML = `<span class="month">${firstPart}</span>`;

        // Create new spans if month and year are active
        if (secondPart) {
            button.innerHTML += ` <span class="day">${secondPart}</span>`;
        }
        if (thirdPart) {
            button.innerHTML += ` <span class="year">${thirdPart}</span>`;
        }

        const showingWrapper = document.createElement('div');
        showingWrapper.classList.add('showing-wrapper');
        showingWrapper.appendChild(button)

        const newDate = date.toISOString().split('T')[0]; // This could be dynamic if needed


        showings = await fetchShowingsByMovieAndDate(movieId, newDate);


        const showingItem = document.createElement('div');
        showingItem.classList.add('showtime-box');

        showings.forEach(showing => {
            const showtimeDiv = document.createElement('button');
            showtimeDiv.classList.add('showing-button')
            showtimeDiv.innerHTML = `
            <span>${showing.theater.name}</span>
            <span>${getHourMinuteFromDateTime(showing.startTime)}</span>
            `;
            showingItem.appendChild(showtimeDiv)
        });

        showingWrapper.appendChild(showingItem)

        dateButtonsContainer.appendChild(showingWrapper);
    }

    dateGoLeft.addEventListener('click', () => {
        // Scroll the date container to the right by a specific amount (e.g., 100px)
        dateButtonsContainer.scrollBy({ left: -700, behavior: 'smooth' });
    });

    dateGoRight.addEventListener('click', () => {
        // Scroll the date container to the right by a specific amount (e.g., 100px)
        dateButtonsContainer.scrollBy({ left: 700, behavior: 'smooth' });
    });

}

let showings = [];
async function colonizeDateButtonWithShowing(movieId, date) {

}

function getMovieIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id'); // Retrieves 'id' from the URL like ?id=123
}

//////////////////////////////////////////////////
window.onload = async function() {
    await updateUrlWithShowings(movieId, today);
    const movie = await fetchMovieById(movieId);
    await createShowingDateButtons(today, 31)
    displayMovie(movie)
    dateMargin.style.display = 'block';
};