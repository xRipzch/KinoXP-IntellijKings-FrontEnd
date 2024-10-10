import {fetchMovies, deleteMovieById} from '../api/apiservice.js';
console.log('allmovies.js loaded');

fetchMovies()
    .then(movies => {
        console.log(movies); // Log the fetched movies data
        displayMoviesAsGrid(movies);
    })
    .catch(error => {
        console.error('Error fetching movies:', error);
    });

function displayMoviesAsGrid(movies) {
    const movieGrid = document.getElementById('movie-grid');

    const addNewMovieItem = document.createElement('a');
    addNewMovieItem.classList.add('grid-item');
    addNewMovieItem.href = '../../html/movies/add-movie.html';

    addNewMovieItem.innerHTML = `
        <div class="grid-image add-new-container">
            <i class="fa fa-plus-circle" aria-hidden="true" style="font-size: 2.5em"></i>
        </div>
    `;

    movieGrid.appendChild(addNewMovieItem);

    movies.forEach(movie => {
        const movieItem = document.createElement('a');

        movieItem.href = `../../html/movies/movie-details.html?id=${movie.id}`; // Link to movie details

        const releaseYear = new Date(movie.releaseDate).getFullYear();
        const durationInMinutes = movie.durationInMinutes;
        const hours = Math.floor(durationInMinutes / 60);
        const minutes = durationInMinutes % 60;

        movieItem.innerHTML = `
            <div class="grid-item">
                <!-- Image + labels -->
                <div class="grid-image">
                    <span class="format-label-left">${movie.is3d ? '3D' : '2D'}</span>
                    <span class="format-label-right" title="Duration">${hours}<sup>h</sup> ${minutes}<sup>m</sup></span>
                    <span class="format-label-bottom" title="Movie ID">${movie.id}</span>
                    
                    <!-- Delete button with trash icon -->
                    <button class="format-label-button button-delete" title="Delete Movie">
                    <i class="fas fa-trash"></i>
                    </button>

                    <!-- Edit button with edit icon -->
                    <button class="format-label-button button-edit" title="Edit Movie">
                    <i class="fas fa-edit"></i>
                    </button><img src="${movie.imageUrl}" alt="${movie.title} Poster" class="image-container">
                </div>

                <!-- Title + release year -->
                <div class="grid-bottom">
                    <h2>${movie.title}</h2>
                    <h3 class="release-text">(${releaseYear})</h3>
                </div>

                </div>
            </div>
        `
        movieGrid.appendChild(movieItem);

        movieItem.addEventListener('mouseover', () => showDeleteButton(movieItem));
        movieItem.addEventListener('mouseover', () => showEditButton(movieItem));

        movieItem.addEventListener('mouseout', () => hideDeleteButton(movieItem));
        movieItem.addEventListener('mouseout', () => hideEditButton(movieItem));

        const delbutton = movieItem.querySelector('.button-delete');
        const editButton = movieItem.querySelector('.button-edit')
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
        function deleteMovie(movieId) {
            // Confirmation dialog
            const confirmDelete = confirm(`Are you sure you want to delete "${movie.title}"?`);
            if (confirmDelete) {
                // DELETE request to backend
                deleteMovieById(movieId)
                    .then(result => {
                        console.log(result);
                        movieItem.remove(); // Remove the movie card from the DOM
                        Swal.fire({
                            title: 'Movie deleted successfully!',
                            icon: 'success',
                            timer: 1000,
                            showConfirmButton: false
                        });
                    })
                    .catch(error => {
                        console.error('Error deleting movie:', error);
                        alert('Failed to delete the movie. Please try again.');
                    });
            }
        }

        // Redirect to edit //

        function redirectToEdit(movieId) {
            window.location.href = "../../html/movies/edit-movie.html?id=" + movieId;

        }

        // HOVER FUNCTIONS //

        function showDeleteButton(movieItem) {
            const deleteButton = movieItem.querySelector('.button-delete');
            deleteButton.style.display = 'flex';
        }

        function hideDeleteButton(movieItem) {
            const deleteButton = movieItem.querySelector('.button-delete');
            deleteButton.style.display = 'none';
        }

        function showEditButton(movieItem) {
            const deleteButton = movieItem.querySelector('.button-edit');
            deleteButton.style.display = 'flex';
        }

        function hideEditButton(movieItem) {
            const deleteButton = movieItem.querySelector('.button-edit');
            deleteButton.style.display = 'none';
        }
    });
}
