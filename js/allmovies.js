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


    const addNewMovieItem = document.createElement('a');
    addNewMovieItem.classList.add('grid-item', 'add-movie-container');

    addNewMovieItem.innerHTML = `
        <div class="add-movie-content">
            <p>Add New Movie</p>
        </div>
    `;

    movieGrid.appendChild(addNewMovieItem);

    addNewMovieItem.href = '../html/add-movie.html';

    movies.forEach(movie => {
        const movieItem = document.createElement('a'); // This not the container??

        movieItem.href = `/movie/${movie.id}`; // Link to movie details

        const releaseYear = new Date(movie.releaseDate).getFullYear();
        const durationInMinutes = movie.durationInMinutes;
        const hours = Math.floor(durationInMinutes / 60);
        const minutes = durationInMinutes % 60;

// After appending the movieItem to the DOM

// After appending the movieItem to the DOM
        movieGrid.appendChild(movieItem);

        // Add event listener for mouseover to show the delete button
        movieItem.addEventListener('mouseover', () => showDeleteButton(movieItem));

        // Add event listener for mouseout to hide the delete button
        movieItem.addEventListener('mouseout', () => hideDeleteButton(movieItem));

        // Add event listener for mouseover to show the edit button
        movieItem.addEventListener('mouseover', () => showEditButton(movieItem));

        // Add event listener for mouseout to hide the edit button
        movieItem.addEventListener('mouseout', () => hideEditButton(movieItem));
        const delbutton = movieItem.querySelector('.format-label-button-delete');
        const editButton = movieItem.querySelector('.format-label-button-edit')
        editButton.addEventListener('click', function (event) {
            event.preventDefault()
            event.stopPropagation()
            redirectToEdit(movie.id)
        })
        delbutton.addEventListener('click', function (event) {
            event.preventDefault()
            event.stopPropagation(); // Prevent the anchor from being triggered
            deleteMovie(movie.id); // Call deleteMovie with the current movie ID
        });


        // DEL FUNCITON //
        function deleteMovie(movieId) {// Add event listener to the Delete button
            // Confirmation dialog
            const confirmDelete = confirm(`Are you sure you want to delete "${movie.title}"?`);
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

        // Redirect to edit //

        function redirectToEdit(movieId) {
            window.location.href = "../html/editmovie"

        }

        // HOVER FUNCTIONS //

        function showDeleteButton(movieItem) {
            const deleteButton = movieItem.querySelector('.format-label-button-delete');
            deleteButton.style.display = 'flex';
        }

