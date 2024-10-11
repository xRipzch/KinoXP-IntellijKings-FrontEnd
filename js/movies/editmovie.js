document.addEventListener("DOMContentLoaded", function () {

    let receivedValue = getQueryParam('id');
    const integerValue = parseInt(receivedValue, 10);
    const inputField = document.getElementById('search');
    inputField.value = integerValue;

    document.getElementById('search-movie-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const searchValue = document.getElementById('search').value;
        fetchMovieDetails(searchValue);
    });

    document.getElementById('edit-movie-form').addEventListener('submit', function(event) {
        event.preventDefault();
        saveMovieDetails();
    });

    document.getElementById('imageUrl').addEventListener('input', function() {
        const imageUrl = this.value;
        const imagePreview = document.getElementById('imagePreview');
        if (imageUrl) {
            imagePreview.src = imageUrl;
            imagePreview.style.display = 'block';
        } else {
            imagePreview.style.display = 'none';
        }
    });

    function getQueryParam(param) {
        let urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    function fetchMovieDetails(searchValue) {
        fetch(`http://localhost:8080/api/movies?search=${encodeURIComponent(searchValue)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Movie not found');
                }
                return response.json();
            })
            .then(data => {
                document.getElementById('title').value = data.title;
                document.getElementById('description').value = data.description;
                document.getElementById('duration').value = data.durationInMinutes;
                document.getElementById('releaseDate').value = formatDateForInput(data.releaseDate); // Ensure correct key
                document.getElementById('is3D').checked = data.is3d;
                document.getElementById('imageUrl').value = data.imageUrl;
                document.getElementById('edit-movie-form').style.display = 'block';
            })
            .catch(error => {
                console.error('Error fetching movie details:', error);
                alert(error.message);
            });
    }

    function formatDateForInput(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function saveMovieDetails() {
        const movieDetails = {
            id: receivedValue,
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            durationInMinutes: document.getElementById('duration').value,
            releaseDate: document.getElementById('releaseDate').value,
            is3d: document.getElementById('is3D').checked,
            imageUrl: document.getElementById('imageUrl').value
        };

        const movieId = receivedValue;
        console.log("movie id being sent", movieId);

        fetch(`http://localhost:8080/api/movies/${movieId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movieDetails)
        })
            .then(response => {
                console.log('Response status:', response.status);
                return response.json().then(data => {
                    console.log('Parsed response data:', data);
                    if (data.success) {
                        alert('Movie details updated successfully');
                    } else {
                        alert('Error updating movie details: ' + data.message);
                    }
                });
            })
            .catch(error => {
                console.error('Error updating movie details:', error.message || error);
                console.error('Stack trace:', error.stack);
            });
    }


    window.addEventListener('load', getQueryParam); {
        window.addEventListener('load', fetchMovieDetails(receivedValue));
}})