import { fetchShowings, deleteShowingById } from "../api/apiservice.js";

console.log('allshowings.js loaded');

fetchShowings()
    .then(data => {
        console.log(data);
        displayShowingsAsGrid(data);
    })
    .catch(error => {
        console.error('Error fetching showings:', error);
    });

function displayShowingsAsGrid(showings) {
    const showingGrid = document.getElementById('showing-grid');

    const addNewShowingItem = document.createElement('a');
    addNewShowingItem.classList.add('grid-item');
    addNewShowingItem.href = '../html/showings/add-showing.html';
    addNewShowingItem.innerHTML = `
        <div class="grid-image add-new-container">
            <i class="fa fa-plus-circle" aria-hidden="true" style="font-size: 2.5em"></i>
        </div>
    `;
    showingGrid.appendChild(addNewShowingItem);

    showings.forEach(showing => {
        const showingItem = document.createElement('a'); // Change to <a> for linking
        showingItem.href = `../html/showings/showing-details.html?id=${showing.id}`;

        const movie = showing.movie;
        const theater = showing.theater;
        const movieReleaseYear = new Date(movie.releaseDate).getFullYear();
        const movieDurationInMinutes = movie.durationInMinutes;
        const movieHours = Math.floor(movieDurationInMinutes / 60);
        const movieMinutes = movieDurationInMinutes % 60;
        const showingStartTime = new Date(showing.startTime);
        const showingEndTime = showingStartTime.getTime() + movieDurationInMinutes * 60000;

        const isCurrentYear = showingStartTime.getFullYear() === new Date().getFullYear();

        const formattedShowingStartTime = `${showingStartTime.toLocaleDateString([], {
            month: 'short',
            day: '2-digit',
            ...(isCurrentYear ? {} : { year: 'numeric' })
        })} ${showingStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

        showingItem.innerHTML = `
            <div class="grid-item">
                <div class="grid-image">
                    <span class="format-label-left">${movie.is3d ? '3D' : '2D'}</span>
                    <span class="format-label-right" title="Duration">${movieHours}h ${movieMinutes}m</span>
                    <span class="format-label-bottom" title="Theater">${theater.name}</span>
                    <button class="format-label-button button-delete" title="Delete Showing">
                        <i class="fas fa-trash"></i>
                    </button>
                    <img src="${movie.imageUrl}" alt="${movie.title} Poster" class="image-container">
                </div>
                <div class="grid-right">
                    <h2 class="date-text">${formattedShowingStartTime}</h2>
                </div>
            </div>
        `;
        showingGrid.appendChild(showingItem);

        // Event listeners for hover effect on buttons
        showingItem.addEventListener('mouseover', () => toggleDeleteButton(showingItem, true));
        showingItem.addEventListener('mouseout', () => toggleDeleteButton(showingItem, false));

        const deleteButton = showingItem.querySelector('.button-delete');
        deleteButton.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            deleteShowing(showing.id, movie.title, formattedShowingStartTime);
        });
    });
}

function deleteShowing(showingId, movieTitle, formattedShowingStartTime) {
    const confirmDelete = confirm(`Are you sure you want to delete the showing of ${movieTitle} at ${formattedShowingStartTime}?`);
    if (confirmDelete) {
        deleteShowingById(showingId)
            .then(result => {
                console.log(result);
                document.getElementById(`showing-${showingId}`).remove(); // Remove from DOM
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

// Toggle button visibility for delete and edit
function toggleDeleteButton(item, show) {
    const deleteButton = item.querySelector('.button-delete');
    deleteButton.style.display = show ? 'flex' : 'none';
}
