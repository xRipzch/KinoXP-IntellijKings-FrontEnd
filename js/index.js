console.log("index.js loaded");

const dateButtonsContainer = document.getElementById('date-container');
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
            : date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                ...(date.getFullYear() > today.getFullYear() ? { year: 'numeric' } : {}) // Show year if it's next year
            });

        dateButtonsContainer.appendChild(button);
    }
}

console.log(today.toISOString().split('T')[0])


window.onload = (findShowingsByDate(today.getDate()))
async function findShowingsByDate(date) {
    const url = "http://localhost:8080/showing/" + date;
    showings =  await fetch(url, date).then(response => {response.json()});

    showings.forEach(showing => {

        console.log(showing.movie.title);
    })
}


findShowingsByDate()

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
