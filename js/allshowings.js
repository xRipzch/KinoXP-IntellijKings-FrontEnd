console.log('allshowings.js loaded');

fetch('http://localhost:8080/showings')
    .then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
    }
    return response.json();
})
    .then(data => {
    console.log(data);
    displayShowingsAsGrid(data);
})
    .catch(error => {
        console.error('Error fetching showings:', error)
    })


function displayShowingsAsGrid(showings) {
    const showingGrid = document.getElementById('showing-grid');

    const addNewShowingItem = document.createElement('a');
    addNewShowingItem.classList.add('grid-item');

    addNewShowingItem.innerHTML = `
        <div class="grid-image add-new-container">
            <h2>Add New Showing </>
        </div>
    `;

    showingGrid.appendChild(addNewShowingItem);

    addNewShowingItem.href = '../html/?????.html';


    showings.forEach(showing => {
        const showingItem = document.createElement('a'); // This not the container??

        showingItem.href = `../html/showing-details.html?id=${showing.id}`; // Link to showing details

        const movie = showing.movie;
        const theater = showing.theater;

        const movieReleaseYear = new Date(movie.releaseDate).getFullYear();
        const movieDurationInMinutes = movie.durationInMinutes;
        const movieHours = Math.floor(movieDurationInMinutes / 60);
        const movieMinutes = movieDurationInMinutes % 60;

        const showingStartTime = new Date(showing.startTime);
        const showingEndTime = showingStartTime + movieDurationInMinutes;
        const showingReadyForNextShowingTime = Math.ceil((showingEndTime + 30) / 15) * 15; // Rounded up to the nearest 15 minutes

        const theaterName = theater.name;
        
        showingItem.innerHTML = `
            <div class="grid-item">
                <!-- Left side - image + 2D/3D label -->
                <div class="grid-image">
                    <span class="format-label-left">${movie.is3d ? '3D' : '2D'}</span>
                    <span class="format-label-right" title="Duration">${movieHours}<sup>h</sup> ${movieMinutes}<sup>m</sup></span>
                    <span class="format-label-bottom" title="Movie ID">${theaterName}</span>
                    
                    <!-- Delete button with trash icon -->
                    <button class="format-label-button button-delete" title="Delete Movie">
                    <i class="fas fa-trash"></i>
                    </button>

                    <!-- Edit button with edit icon -->
                    <button class="format-label-button button-edit" title="Edit Movie">
                    <i class="fas fa-edit"></i>
                    </button><img src="${movie.imageUrl}" alt="${movie.title} Poster" class="image-container">
                </div>

                <!-- Title -->
                <div class="grid-right">
                    <h2>${showingStartTime}</h2><h3 class="release-text">(${movieReleaseYear})</h3>
                </div>

                </div>
            </div>
        `
        showingGrid.appendChild(showingItem);

        // Add event listener for mouseover to show the delete button
        showingItem.addEventListener('mouseover', () => showDeleteButton(showingItem));

        // Add event listener for mouseout to hide the delete button
        showingItem.addEventListener('mouseout', () => hideDeleteButton(showingItem));

        // Add event listener for mouseover to show the edit button
        showingItem.addEventListener('mouseover', () => showEditButton(showingItem));

        // Add event listener for mouseout to hide the edit button
        showingItem.addEventListener('mouseout', () => hideEditButton(showingItem));
        const delbutton = showingItem.querySelector('.button-delete');
        const editButton = showingItem.querySelector('.button-edit')
        editButton.addEventListener('click', function (event) {
            event.preventDefault()
            event.stopPropagation()
            redirectToEdit(showing.id)
        })
        delbutton.addEventListener('click', function (event) {
            event.preventDefault()
            event.stopPropagation(); // Prevent the anchor from being triggered
            deleteMovie(showing.id); // Call deleteMovie with the current movie ID
        });


        // DEL FUNCITON //
        function deleteMovie(movieId) {// Add event listener to the Delete button
            // Confirmation dialog
            const confirmDelete = confirm(`Are you sure you want to delete "${showing.title}"?`);
            if (confirmDelete) {
                // DELETE request to backend
                fetch(`http://localhost:8080/movie/${showing.id}`, {
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
                        Swal.fire({
                            title: 'Movie deleted successfully!',
                            icon: 'success',
                            timer: 1000,
                            showConfirmButton: false
                        });
                        // window.location.replace('../html/all-movies.html');
                    })
                    .catch(error => {
                        console.error('Error deleting movie:', error);
                        alert('Failed to delete the movie. Please try again.');
                    });
            }
        }


        /// ADD MOVIE FUNCTION ///
        function addMovie() {

            const addNewMovieItem = document.createElement('div');
            addNewMovieItem.classList.add('grid-item');

            addNewMovieItem.innerHTML = `
        <div class="grid-image add-movie-container">
            <div class="add-movie-container">
                <h2>Add New Movie</>
            </div>
        </div>
    `;

            movieGrid.appendChild(addNewMovieItem);

        }

        // Redirect to edit //

        function redirectToEdit(movieId) {
            window.location.href = "../html/edit-movie.html"

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