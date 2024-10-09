// apiService.js
const BASE_URL = 'http://localhost:8080';

async function fetchMovies() {
    try {
        const response = await fetch(`${BASE_URL}/movies`);
        if (!response.ok) throw new Error(`Failed to fetch movies: ${response.statusText}`);
        return response.json();
    } catch (error) {
        console.error('Error in fetchMovies:', error);
        throw error;
    }
}

async function fetchTheaters() {
    try {
        const response = await fetch(`${BASE_URL}/theaters`);
        if (!response.ok) throw new Error(`Failed to fetch theaters: ${response.statusText}`);
        return response.json();
    } catch (error) {
        console.error('Error in fetchTheaters:', error);
        throw error;
    }
}

async function fetchShowingByTheaterAndDate(theaterId, date) {
    try {
        const response = await fetch(`${BASE_URL}/showings/${theaterId}/${date}`);
        if (!response.ok) throw new Error(`Failed to fetch showing: ${response.statusText}`);
        return response.json();
    } catch (error) {
        console.error('Error in fetchShowingByTheaterAndDate:', error);
        throw error;
    }
}

async function deleteMovieById(movieId) {
    try {
        const response = await fetch(`${BASE_URL}/movie/${movieId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error(`Failed to delete movie: ${response.statusText}`);
        return response.text(); // Optional, could return any specific server response
    } catch (error) {
        console.error('Error in deleteMovie:', error);
        throw error;
    }
}

// Additional centralized fetches (e.g., for showings, theaters)
async function fetchShowings() {
    try {
        const response = await fetch(`${BASE_URL}/showings`);
        if (!response.ok) throw new Error(`Failed to fetch showings: ${response.statusText}`);
        return response.json();
    } catch (error) {
        console.error('Error in fetchShowings:', error);
        throw error;
    }
}

// Export all service functions
export { fetchMovies, fetchTheaters, fetchShowingByTheaterAndDate, deleteMovieById, fetchShowings };
