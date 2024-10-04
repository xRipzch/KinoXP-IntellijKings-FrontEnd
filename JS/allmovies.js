// Fetch the list of movies from the backend
fetch('http://localhost:8080/movies')
    .then(response => {
        // Check if the response is OK (status in the range 200-299)
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json(); // Parse the JSON from the response
    })
    .then(data => {
        console.log(data); // Log the fetched data to the console for debugging
        displayMovies(data); // Call a function to display the movies on the page
    })
    .catch(error => {
        console.error('Error fetching movies:', error); // Log any errors that occur during the fetch
    });

// Function to display the list of movies in the HTML
function displayMovies(movies) {
    const movieList = document.getElementById('movie-list'); // Get the element where movies will be displayed
    movieList.innerHTML = ''; // Clear previous content

    // Iterate over each movie and create a list item
    movies.forEach(movie => {
        const movieItem = document.createElement('li');
        movieItem.textContent = `${movie.id} (${movie.title})`; // Corrected the string interpolation
        movieList.appendChild(movieItem);
    });
}
