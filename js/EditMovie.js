document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('search-movie-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const searchValue = document.getElementById('search').value;
        fetchMovieDetails(searchValue);
    });

    document.getElementById('edit-movie-form').addEventListener('submit', function(event) {
        event.preventDefault();
        saveMovieDetails();
    });

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
                document.getElementById('releaseYear').value = data.releaseYear;
                document.getElementById('is3D').checked = data.is3d;
                document.getElementById('imageUrl').value = data.imageUrl;
                document.getElementById('edit-movie-form').style.display = 'block';
            })
            .catch(error => {
                console.error('Error fetching movie details:', error);
                alert(error.message);
            });
    }

    function saveMovieDetails() {
        const movieDetails = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            durationInMinutes: document.getElementById('duration').value,
            releaseDate: document.getElementById('releaseYear').value,
            is3d: document.getElementById('is3D').checked,
            imageUrl: document.getElementById('imageUrl').value
        };

        const movieId = document.getElementById('search').value; // Retrieve the movie ID from the search input

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
            .catch(error => console.error('Error saving movie details:', error));
    }

});