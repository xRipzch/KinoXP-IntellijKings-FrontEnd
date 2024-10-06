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
        console.error('Error fetching movies:', error);
    });

function displayMoviesAsGrid(movies) {
    const movieGrid = document.getElementById('movie-grid');

    movies.forEach(movie => {
        const movieItem = document.createElement('a'); // This not the container??

        movieItem.href = `/movie/${movie.id}`; // Link to movie details

        const releaseYear = new Date(movie.releaseYear).getFullYear();
        const durationInMinutes = movie.durationInMinutes;
        const hours = Math.floor(durationInMinutes / 60);
        const minutes = durationInMinutes % 60;

        movieItem.innerHTML = `
            <div class="grid-item">
                <!-- Title -->
                <div class="grid-top">
                    <h2>${movie.title} <sup class="release-text">(${releaseYear})</sup></h2>
                </div>

                <!-- Content -->
                <div class="grid-content">
                
                    <!-- Left side - image + 2D/3D label -->
                    <div class="grid-image">
                        <span class="format-label-left">${movie.is3d ? '3D' : '2D'}</span>
                        <span class="format-label-right" title="Duration">${hours}<sup>h</sup> ${minutes}<sup>m</sup></span>
                        <span class="format-label-bottom" title="Movie ID">${movie.id}</span>
                        <img src="${movie.imageUrl}" alt="${movie.title} Poster" class="image-container">
<!--                        If URL == null -> standard picture.-->
                    </div>

                    <!-- Right side - buttons + description -->
                    <div class="grid-right">
                  
                        <div class="right-upper">
                            <p>${movie.description}</p>
                        </div>
                    
                        <div class="right-lower">
                            <button class="button-blue">Change</button>
                            <button class="button-red">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

// After appending the movieItem to the DOM
        movieGrid.appendChild(movieItem);

        // Add event listener to the Delete button
        const deleteButton = movieItem.querySelector('.button-red');
        deleteButton.addEventListener('click', function (event) {
            event.stopPropagation(); // Prevents the anchor from being triggered

            // Confirmation dialog
            const confirmDelete = confirm(`Are you sure you want to delete the movie "${movie.title}"?`);
            if (confirmDelete) {
                // DELETE request to backend
                fetch(`http://localhost:8080/movie/${movie.id}`, {
                    method: 'DELETE'
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to delete movie: ' + response.statusText);
                        }
                        return response.text(); // Get response text (optional)
                    })
                    .then(result => {
                        console.log(result); // Optional: Log the result
                        movieItem.remove(); // Remove the movie card from the DOM
                        alert('Movie deleted successfully!');

                    })
                    .catch(error => {
                        console.error('Error deleting movie:', error);
                        alert('Failed to delete the movie. Please try again.');
                    });
                window.location.href = '/all-movies.html';// TODO NO WORKING
            }
        });

    });

    const addNewMovieItem = document.createElement('div');
    addNewMovieItem.classList.add('grid-item', 'add-movie-container');

    addNewMovieItem.innerHTML = `
        <div class="add-movie-content">
            <p>Add New Movie</p>
        </div>
    `;

    movieGrid.appendChild(addNewMovieItem);

}



