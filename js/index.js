import {calculateMinutesToHours, get3dValue, formatDateToShortMonth} from './api/movieinfoconverters.js';

console.log("index.js loaded");

const dateGoLeft = document.querySelector('.date-selector-go-left');
const dateGoRight = document.querySelector('.date-selector-go-right');
const dateButtonsContainer = document.getElementById('date-container');
const movieGoLeft = document.querySelector('.movie-selector-go-left');
const movieGoRight = document.querySelector('.movie-selector-go-right');
const today = new Date();
const daysToGenerate = 31; // one month

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

            await updateUrlWithShowings(date)
        })
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

/*let showings = [];
async function findShowingsByDate(date) {
    // Clear movie grid before adding new children :-p
    movieGrid.innerHTML = '';
    const url = "http://localhost:8080/showings/" + date;
    showings =  await fetch(url).then(response => response.json());
    console.log(showings)
    showings.forEach(showing => {
        const movieItem = document.createElement('div');
        console.log(showing.movie.title)
        movieItem.innerHTML = `
            <div class="grid-item">
                <div class="grid-image">
                    <img src="${showing.movie.imageUrl}" class="image-container">
                    <span class="format-label-left">${showing.movie.title}</span>
                    <span class="format-label-right" title="Duration">${showing.movie.durationInMinutes}</span>

                </div>
                <div class="grid-text">
                    <span class="format-label-left">${showing.theater.name}</span>
                    <span class="format-label-right" title="Duration">${showing.startTime}</span>

                </div>
            </div>
        `;
        movieGrid.appendChild(movieItem);
    });
}*/

const cardGrid = document.getElementById('card-grid');

let showings = []
async function findShowingsByDate(date) {
    // Clear movie grid before adding new children :-p
    cardGrid.innerHTML = '';
    const url = "http://localhost:8080/showings/" + date;
    showings =  await fetch(url).then(response => response.json());
    console.log(showings);

    // Group showings by movieId
    const moviesMap = new Map();

    showings.forEach(showing => {
        const movieId = showing.movie.id;
        if (!moviesMap.has(movieId)) {
            // If this movie is not already in the map, add it with an empty showtimes array
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

    // Now iterate over the moviesMap and create the elements
    moviesMap.forEach(({ movie, showTimes }) => {
        const movieItem = document.createElement('div');

        movieItem.innerHTML = `
                <a id="anchor-img" href="../html/movie-details.html?id=${movie.id}">
                    <img id="movie-item-img" src="${movie.imageUrl}" class="card__background"> 
                </a>
                <div class="card__content | flow">
                    <div class="card__content--container | flow">
                        <h2 class="card__title">${movie.title}</h2>
                        <p class="card__description" id="top-description"><span id="is-3d">${get3dValue(movie.is3d)}</span><span id="movie-duration-in-minutes">${calculateMinutesToHours(movie.durationInMinutes)}</span> </p>
                        <p class="card__description" id="bottom-description">${formatDateToShortMonth(movie.releaseDate)}</p>
                    </div>
                    <a href="../html/movie-details.html?id=${movie.id}" class="card__button">Read more</a>
                </div>
                <div class="grid-bottom">
<!--                Her skal den href til sædereservation for showingId-->
<!--                <a id="anchor-img" href=">-->
                    ${showTimes.map(showtime => `
                        <div class="showtime">
                            <span>${showtime.theater}</span>
                            <span title="Start Time">${showtime.startTime}</span>
                        </div>
<!--                </a>-->
                    `)}
                </div>
        `;

        movieItem.classList.add('card');
        cardGrid.appendChild(movieItem);
    });

    if (cardGrid.childElementCount > 5) {
        movieGoLeft.style.display = "block";
        movieGoRight.style.display = "block";
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
        if (lastDate.getFullYear()>today.getFullYear()){

        }

        // Ensure continuous date increments
        lastDate.setDate(lastDate.getDate() + 1);

        // Generate the next batch based on last date
        createDateButtons(lastDate, 10);
    }
});

async function updateUrlWithShowings(date) {
    const newDate = date.toISOString().split('T')[0]; // This could be dynamic if needed
    const newUrl = `../html/index.html?date=${newDate}`;
    window.history.pushState({}, '', newUrl);

    const params = new URLSearchParams(window.location.search);
    const formattedDate = params.get('date'); // Retrieves 'Date' from the URL like ?id=123
    await findShowingsByDate(formattedDate);
}

/////////////////////////////////////////////////////////////////////
window.onload = async function() {
    const button = document.querySelector('button');
    button.classList.add('active');
    await updateUrlWithShowings(today)
}