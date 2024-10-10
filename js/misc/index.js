import {calculateMinutesToHours, get3dValue, formatDateToShortMonth, getHourMinuteFromDateTime} from '../api/movieinfoconverters.js';

console.log("index.js loaded");

const dateGoLeft = document.querySelector('.date-selector-go-left');
const dateGoRight = document.querySelector('.date-selector-go-right');
const dateButtonsContainer = document.getElementById('date-container');
const movieGoLeft = document.querySelector('.movie-selector-go-left');
const movieGoRight = document.querySelector('.movie-selector-go-right');
const today = new Date();
const daysToGenerate = 31; // one month

let showings = [];
// Function to generate a batch of date buttons
function createDateButtons(startDate, days) {
    for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const button = document.createElement('button');
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

        dateButtonsContainer.appendChild(button);

        button.addEventListener('click', async () => {
            // Remove 'active' class from all buttons
            const allButtons = dateButtonsContainer.querySelectorAll('button');
            allButtons.forEach(btn => btn.classList.remove('active'));

            // Add 'active' class to the clicked button
            button.classList.add('active');

            await updateUrlWithShowings(date);
        });
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

const cardGrid = document.getElementById('card-grid');
const showingGrid = document.getElementById('showing-grid');


// Adjust the findShowingsByDate function
async function findShowingsByDate(date) {
    // Clear movie grid before adding new children
    cardGrid.innerHTML = '';
    showingGrid.innerHTML = '';  // Clear the showings grid too

    const url = "http://localhost:8080/showings/" + date;
    showings = await fetch(url).then(response => response.json());
    console.log(showings);

    // Group showings by movieId
    const moviesMap = new Map();

    showings.forEach(showing => {
        const movieId = showing.movie.id;
        if (!moviesMap.has(movieId)) {
            // Add the movie with an empty showtimes array
            moviesMap.set(movieId, {
                movie: showing.movie,
                showTimes: []
            });
        }
        // Add the showing time to the movie's showtimes array
        moviesMap.get(movieId).showTimes.push({
            theater: showing.theater.name,
            startTime: showing.startTime
        });
    });

    // Iterate over the moviesMap and create elements
    moviesMap.forEach(({ movie, showTimes }) => {
        // Create a wrapper div to contain both the movie card and the showtime box
        const movieWrapper = document.createElement('div');
        movieWrapper.classList.add('movie-wrapper');

        const movieItem = document.createElement('div');
        movieItem.classList.add('card');

        // Create the card structure with movie details
        movieItem.innerHTML = `
            <a id="anchor-img" href="../movies/movie-details.html?id=${movie.id}">
                <img id="movie-item-img" src="${movie.imageUrl}" class="card__background"> 
            </a>
            <div class="card__content | flow">
                <div class="card__content--container | flow">
                    <h2 class="card__title">${movie.title}</h2>
                    <p class="card__description" id="top-description">
                        <span id="is-3d">${get3dValue(movie.is3d)}</span>
                        <span id="movie-duration-in-minutes">${calculateMinutesToHours(movie.durationInMinutes)}</span>
                    </p>
                    <p class="card__description" id="bottom-description">${formatDateToShortMonth(movie.releaseDate)}</p>
                </div>
                <a href="../movies/movie-details.html?id=${movie.id}" class="card__button">Read more</a>
            </div>
        `;

        // Append the card to the wrapper
        movieWrapper.appendChild(movieItem);

        // Create and append the showing times box
        const showingItem = document.createElement('div');
        showingItem.classList.add('showtime-box');

        // Loop through showtimes and add them into the showingItem
        showTimes.forEach(showtime => {
            const showtimeDiv = document.createElement('button');
            showtimeDiv.classList.add('showtime');
            showtimeDiv.innerHTML = `
                <span>${showtime.theater}</span>
                <span class="start-time">${getHourMinuteFromDateTime(showtime.startTime)}</span>
            `;
            showingItem.appendChild(showtimeDiv);
        });

        // Append the showtimes box to the wrapper
        movieWrapper.appendChild(showingItem);

        // Finally, append the entire wrapper to the card grid
        cardGrid.appendChild(movieWrapper);

    });
    console.log(cardGrid.childElementCount)
    if (cardGrid.childElementCount > 4) {
        movieGoLeft.style.display = "block"
        movieGoRight.style.display = "block"
    } else {
        movieGoLeft.style.display = "none"
        movieGoRight.style.display = "none"
    }

    movieGoLeft.addEventListener('click', () => {
        // Scroll the date container to the right by a specific amount (e.g., 100px)
        cardGrid.scrollBy({ left: -400, behavior: 'smooth' });
    });

    movieGoRight.addEventListener('click', () => {
        // Scroll the date container to the right by a specific amount (e.g., 100px)
        cardGrid.scrollBy({ left: 400, behavior: 'smooth' });
    });
}

// Initial set of date buttons
createDateButtons(today, daysToGenerate);

// Infinite scrolling event listener to add more date buttons
dateButtonsContainer.addEventListener('scroll', () => {
    if (dateButtonsContainer.scrollLeft + dateButtonsContainer.clientWidth >= dateButtonsContainer.scrollWidth) {
        const lastButton = dateButtonsContainer.querySelector('button:last-child');
        const lastDateText = lastButton.textContent;

        let lastDate = new Date(today);
        if (lastDateText !== "Today") {
            lastDate = new Date(lastDateText + " " + today.getFullYear());
        }
        if (lastDate.getFullYear() > today.getFullYear()) {
        // Handle the case where the year is greater than the current year
        }

        // Ensure continuous date increments
        lastDate.setDate(lastDate.getDate() + 1);

        // Generate the next batch based on last date
        createDateButtons(lastDate, 10);

    }
});

async function updateUrlWithShowings(date) {
    const newDate = date.toISOString().split('T')[0]; // This could be dynamic if needed
    const newUrl = `../movies/index.html?date=${newDate}`;
    window.history.pushState({}, '', newUrl);

    const params = new URLSearchParams(window.location.search);
    const formattedDate = params.get('date'); // Retrieves 'Date' from the URL like ?id=123
    await findShowingsByDate(formattedDate);
}

window.onload = async function() {
    const button = document.querySelector('button');
    button.classList.add('active');
    await updateUrlWithShowings(today);
};

export {createDateButtons}