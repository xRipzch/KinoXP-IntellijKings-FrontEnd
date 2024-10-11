const BASE_URL = 'http://localhost:8080';

async function fetchAnything(url1, url2 = '', url3 = '') {
    try { // Could put infinite amounts of urls in params.
        // Build URL dynamically based on provided segments
        const url = `${BASE_URL}/${url1}${url2 ? `/${url2}` : ''}${url3 ? `/${url3}` : ''}`;
        const response = await fetch(url);

        if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
        console.log('Fetched successfully from:', url);
        return response.json();
    } catch (error) {
        console.error('Error in fetchAnything:', error);
        throw error;
    }
}

////                Fetch Specifics                ////

async function fetchMovies() {
    try {
        const response = await fetch(`${BASE_URL}/movies`);
        if (!response.ok) throw new Error(`Failed to fetch movies: ${response.statusText}`);

        console.log('Movies fetched successfully');
        return response.json();
    } catch (error) {
        console.error('Error in fetchMovies:', error);
        throw error;
    }
}

async function fetchMovieById(id) {
    try {
        const response = await fetch(`${BASE_URL}/movie/${id}`);
        if (!response.ok) throw new Error(`Failed to fetch movie: ${response.statusText}`);

        console.log('Movie fetched successfully by ID');
        return response.json();
    } catch (error) {
        console.error('Error in fetchMovieById:', error);
        throw error;
    }
}

async function fetchTheaters() {
    try {
        const response = await fetch(`${BASE_URL}/theaters`);
        if (!response.ok) throw new Error(`Failed to fetch theaters: ${response.statusText}`);

        console.log('Theaters fetched successfully');
        return response.json();

    } catch (error) {
        console.error('Error in fetchTheaters:', error);
        throw error;
    }
}

async function fetchTheaterById(id) {
    try {
        const response = await fetch(`${BASE_URL}/theater/${id}`);
        if (!response.ok) throw new Error(`Failed to fetch theater: ${response.statusText}`);

        console.log('Theater fetched successfully by ID');
        return response.json();
    } catch (error) {
        console.error('Error in fetchTheaterById:', error);
        throw error;
    }
}

async function fetchShowingByTheaterAndDate(theaterId, date) {
    try {
        const response = await fetch(`${BASE_URL}/showings/${theaterId}/${date}`);
        if (!response.ok) throw new Error(`Failed to fetch showing: ${response.statusText}`);

        console.log('Showing fetched successfully by theater ID and date');
        return response.json();
    } catch (error) {
        console.error('Error in fetchShowingByTheaterAndDate:', error);
        throw error;
    }
}

async function fetchShowingsByMovieAndDate(movieId, date) {
    try {
        const response = await fetch(`${BASE_URL}/showings/movie=${movieId}/${date}`);
        if (!response.ok) throw new Error(`Failed to fetch showing: ${response.statusText}`);
        return response.json();
    } catch (error) {
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
        throw error;
    }
}

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

async function deleteShowingById(showingId) {
    try {
        const response = await fetch(`${BASE_URL}/showing/${showingId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error(`Failed to delete showing: ${response.statusText}`);
        return response.text(); // Optional, could return any specific server response
    } catch (error) {
        console.error('Error in deleteShowings:', error);
        throw error;
    }
}

// Export all service functions

export {
    fetchAnything,
    fetchMovies, fetchMovieById, deleteMovieById,
    fetchTheaters, fetchTheaterById,
    fetchShowings, addShowing, deleteShowingById, fetchShowingByTheaterAndDate, fetchShowingsByMovieAndDate
};
