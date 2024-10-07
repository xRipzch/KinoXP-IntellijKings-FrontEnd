document.addEventListener("DOMContentLoaded", function () {
    const addMovieForm = document.getElementById("add-movie-form");

    addMovieForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const form = event.currentTarget;

        try {
            const formData = new FormData(addMovieForm);
            const movieData = {
                title: formData.get('title'),
                description: formData.get('description'),
                durationInMinutes: parseInt(formData.get('duration'), 10), // Update key to match backend
                releaseYear: formData.get('releaseYear'),
                is3d: formData.get('is3D') !== null, // Update key to match backend
                imageUrl: formData.get('imageUrl').replace(/['"]+/g, ''), // Remove any quotes
            };
            console.log("Movie data being sent:", movieData);

            await postFormDataAsJson('http://localhost:8080/movie', movieData);
        } catch (error) {
            console.error('Error processing form data', error);
        }
    });

    async function postFormDataAsJson(url, movieData) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(movieData)
            });

            if (response.ok) {
                alert('Movie added successfully');
                addMovieForm.reset();

                setTimeout(function () {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                alert('Failed to add movie');
                console.error('Failed to add movie', response.statusText);
            }
        } catch (error) {
            alert('Failed to add movie');
            console.error('Failed to add movie', error);
        }
    }
});