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
            <i class="fa fa-plus-circle" aria-hidden="true" style="font-size: 2.5em"></i>
        </div>
    `;

    showingGrid.appendChild(addNewShowingItem);

    addNewShowingItem.href = '../html/add-showing.html';

    showings.forEach(showing => {
        const showingItem = document.createElement('div'); // This not the container??

        showingItem.href = `../html/showing-details.html?id=${showing.id}`; // Link to showing details

        const movie = showing.movie;
        const theater = showing.theater;

        const movieReleaseYear = new Date(movie.releaseDate).getFullYear();
        const movieDurationInMinutes = movie.durationInMinutes;
        const movieHours = Math.floor(movieDurationInMinutes / 60);
        const movieMinutes = movieDurationInMinutes % 60;

        const showingStartTime = new Date(showing.startTime);
        const showingEndTime = showingStartTime + movieDurationInMinutes;
        const showingReadyForNextShowingTime = Math.ceil((showingEndTime + 30) / 30) * 30; // Rounded up to the nearest 30 minutes

        const now = new Date();
        const showingYear = showingStartTime.getFullYear();
        const isCurrentYear = showingYear === now.getFullYear();

        const formattedShowingStartTime = `${showingStartTime.toLocaleDateString([], {
            month: 'short',
            day: '2-digit',
            ...(isCurrentYear ? {} : { year: 'numeric' })  // Add year if not current year
        })} ${showingStartTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        })}`;

        const theaterName = theater.name;

        showingItem.innerHTML = `
      <div class="grid-item showing-item">
    <div class="grid-image">
        <span class="format-label-left">${movie.is3d ? '3D' : '2D'}</span>
        <span class="format-label-right" title="Duration">${movieHours}<sup>h</sup> ${movieMinutes}<sup>m</sup></span>
        <span class="format-label-bottom" title="Theater">${theaterName}</span>
        <button class="format-label-button button-delete" title="Delete Movie">
            <i class="fas fa-trash"></i>
        </button>
        <img src="${movie.imageUrl}" alt="${movie.title} Poster" class="image-container">
    </div>
    <div class="grid-bottom">
        <h2 class="movie-title" title="${movie.title}">${movie.title}</h2>
    </div>
    <div class="grid-right showing-info">
        <h2 class="date-text">${formattedShowingStartTime}</h2>
    </div>
</div>
        `
        showingGrid.appendChild(showingItem);

        // Add event listener for mouseover to show the delete button
        showingItem.addEventListener('mouseover', () => showDeleteButton(showingItem));

        // Add event listener for mouseout to hide the delete button
        showingItem.addEventListener('mouseout', () => hideDeleteButton(showingItem));

        // Event Listernes for date-text color
        showingItem.addEventListener('mouseover', () => changeDateTextOnHover(showingItem));
        showingItem.addEventListener('mouseout', () => revertDateTextOnHover(showingItem));

        const delbutton = showingItem.querySelector('.button-delete');

        delbutton.addEventListener('click', function (event) {
            event.preventDefault()
            event.stopPropagation(); // Prevent the anchor from being triggered
            deleteShowing(showing.id); // Call deleteMovie with the current movie ID
        });

        function deleteShowing(showingId) {
            const confirmDelete = confirm(`Are you sure you want to delete the showing: ${movie.title} at ${formattedShowingStartTime}?`);
            if (confirmDelete) {
                fetch(`http://localhost:8080/showing/${showingId}`, {
                    method: 'DELETE'
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to delete showing: ' + response.statusText);
                        }
                        return response.text();
                    })
                    .then(result => {
                        console.log(result); // Log the result if needed
                        showingItem.remove(); // Remove the showing item from the DOM after deletion
                        Swal.fire({
                            title: 'Showing deleted successfully!',
                            icon: 'success',
                            timer: 1000,
                            showConfirmButton: false
                        });
                    })
                    .catch(error => {
                        console.error('Error deleting showing:', error);
                        alert('Failed to delete the showing. Please try again.');
                    });
            }
        }

        // HOVER FUNCTIONS //
        function changeDateTextOnHover(showingItem) {
            const dateText = showingItem.querySelector('.date-text');
            dateText.style.color = '#9E0D59';
        }

        function revertDateTextOnHover(showingItem) {
            const dateText = showingItem.querySelector('.date-text');
            dateText.style.color = '#02BDFBFF';
        }
        function showDeleteButton(movieItem) {
            const deleteButton = movieItem.querySelector('.button-delete');
            deleteButton.style.display = 'flex';
        }

        function hideDeleteButton(movieItem) {
            const deleteButton = movieItem.querySelector('.button-delete');
            deleteButton.style.display = 'none';
        }

    });
}