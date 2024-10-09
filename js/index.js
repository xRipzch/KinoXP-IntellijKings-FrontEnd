console.log("index.js loaded");

const dateButtonsContainer = document.getElementById('date-container');
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
            : date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                ...(date.getFullYear() > today.getFullYear() ? { year: 'numeric' } : {}) // Show year if it's next year
            });

        dateButtonsContainer.appendChild(button);

        button.addEventListener('click', () => {
            updateUrlWithShowings(date)
        })
    }
}

async function updateUrlWithShowings(date) {
    const newDate = date.toISOString().split('T')[0]; // This could be dynamic if needed
    const newUrl = `../html/index.html?date=${newDate}`;
    window.history.pushState({}, '', newUrl);

    const params = new URLSearchParams(window.location.search);
    const formattedDate = params.get('date'); // Retrieves 'Date' from the URL like ?id=123
    await findShowingsByDate(formattedDate);
}

window.onload = async function() {
    updateUrlWithShowings(today)
}
const movieGrid = document.getElementById('movie-grid');

let showings = [];
async function findShowingsByDate(date) {
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
