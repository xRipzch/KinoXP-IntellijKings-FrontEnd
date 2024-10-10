// apiService.js
const BASE_URL = 'http://localhost:8080';

async function fetchMovies() {
    try {
        const movies = await fetch(`${BASE_URL}/movies`);
        if (!movies.ok) throw new Error(`Failed to fetch movies: ${movies.statusText}`);

        console.log('Movies fetched successfully');
        return movies.json();
    } catch (error) {
        console.error('Error in fetchMovies:', error);
    }
}

async function fetchMovieById(id) {
    try {
        const movie = await fetch(`${BASE_URL}/movie/${id}`);
        if (!movie.ok) throw new Error(`Failed to fetch movie: ${movie.statusText}`);
        console.log('Movie fetched successfully by ID');
        return movie.json();
    } catch (error) {
        console.error('Error in fetchMovieById:', error);
    }
}

async function fetchTheaters() {
    try {
        const theaters = await fetch(`${BASE_URL}/theaters`);
        if (!theaters.ok) throw new Error(`Failed to fetch theaters: ${theaters.statusText}`);
        console.log('Theaters fetched successfully');
        return theaters.json();
    } catch (error) {
        console.error('Error in fetchTheaters:', error);
    }
}

async function fetchSeatsByTheaterId (theaterId) {
    try {
        const seats = await fetch(`${BASE_URL}/seats/${theaterId}`);
        if (!seats.ok) throw new Error(`Failed to fetch seats: ${seats.statusText}`);
        console.log('Seats fetched successfully');
        return seats.json;

    } catch (error) {
        console.error('Error in fetchSeatsByTheaterId:', error);}
}


async function fetchTheaterById(id) {
    try {
        const theater = await fetch(`${BASE_URL}/theater/${id}`);
        if (!theater.ok) throw new Error(`Failed to fetch theater: ${theater.statusText}`);

        console.log('Theater fetched successfully by ID');
        return theater.json();
    } catch (error) {
        console.error('Error in fetchTheaterById:', error);
    }
}

async function fetchShowingByTheaterAndDate(theaterId, date) {
    try {
        const showing = await fetch(`${BASE_URL}/showings/${theaterId}/${date}`);
        if (!showing.ok) throw new Error(`Failed to fetch showing: ${showing.statusText}`);

        console.log('Showing fetched successfully by theater ID and date');
        return showing.json();
    } catch (error) {
        console.error('Error in fetchShowingByTheaterAndDate:', error);
    }
}

async function deleteMovieById(movieId) {
    try {
        const response = await fetch(`${BASE_URL}/movie/${movieId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error(`Failed to delete movie: ${response.statusText}`);
        return response.text(); // Optional, could return any specific server response
    } catch (error) {
        console.error('Error in deleteMovie:', error);
    }
}

async function addShowing(showing) {
    try {
        const response = await fetch(`${BASE_URL}/showing`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',  // Inform the server we are sending JSON
            },
            body: JSON.stringify(showing)  // Send the showing data as JSON in the request body
        });

        // Check if the response is successful (201 Created)
        if (!response.ok) {
            throw new Error(`Failed to add showing: ${response.statusText}`);
        }

        console.log('Showing successfully added to database');

        // Parse the response from the server (Assuming it returns the saved showing object)
        return response.json();
    } catch (error) {
        console.error('Error in addShowing:', error);
    }
}





// Additional centralized fetches (e.g., for showings, theaters)
async function fetchShowings() {
    try {
        const showings = await fetch(`${BASE_URL}/showings`);
        if (!showings.ok) throw new Error(`Failed to fetch showings: ${showings.statusText}`);
        return showings.json();
    } catch (error) {
        console.error('Error in fetchShowings:', error);
    }
}

// Export all service functions
export { fetchMovies, fetchMovieById, fetchTheaters, fetchTheaterById,
    fetchShowingByTheaterAndDate, deleteMovieById, addShowing, fetchShowings, fetchSeatsByTheaterId };
