console.log('allmovies.js loaded');

fetch('http://localhost:8080/movies')
    .then(response => {
        if (!response.ok) { // Error handling if not ok
            throw new Error('Network response was not ok: ' + response.statusText); // Error response
        }
        return response.json(); // Parse the JSON from the response if ok
    })
    .then(data => {
        console.log(data); // Log the fetched data to the console for debugging
        displayMoviesAsGrid(data); // Call a function to display the movies on the page
    })
    .catch(error => {
        console.error('Error fetching movies:', error); // Log any errors that occur during the fetch
    });

function displayMoviesAsGrid(movies) {
    const movieGrid = document.getElementById('movie-grid'); // Get the element where movies will be displayed
    // movieGrid.innerHTML = ''; // Clear previous content

    // Iterate over each movie and create a list item
    movies.forEach(movie => {
        const movieItem = document.createElement('div');
        const releaseYear = new Date(movie.releaseYear).getFullYear();

        const durationInMinutes = movie.durationInMinutes;  // Gets movie duration.
        const hours = Math.floor(durationInMinutes / 60);   // Calculates number of hours.
        const minutes = durationInMinutes % 60;             // Calculates remaing minutes.

        movieItem.innerHTML = `
            <div class="grid-item"><!--  TODO make entire box clickable          -->
                    <h3>${movie.title} (${releaseYear})</h3>
                <div class="grid-image">
                    <p class>${movie.is3d ? '3D' : '2D'}             
                           <!--POSTER??!? TODO-->
                    <img src="${movie.imageUrl}" alt="${movie.title} Poster" class="image-container"> <br>
                </div>
                <div class="grid-text">
                    <p>${hours}h ${minutes}m</p>
                        <button class="button-red">Delete</button>
                        <button class="button-blue">Change</button>
                </div>
            </div>
        `;

        movieGrid.appendChild(movieItem);
    });

    // deleteButton.EventListener("click", deleteMovie);


}
