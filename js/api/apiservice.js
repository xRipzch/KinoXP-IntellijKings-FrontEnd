const BASE_URL = 'http://localhost:8080';


                    // REQUIRES CORS.
// async function fetchAnything1(method = 'GET', ...urlSegments) {
//     // Constructs URL from params with '/' between. Accepts unlimited URL's
//     const url = `${BASE_URL}/${urlSegments.map(encodeURIComponent).join('/')}`;
//     const options = { method };
//
//     try {
//         const response = await fetch(url, options);
//         if (!response.ok) throw new Error(`Failed to ${method} from ${url}: ${response.statusText}`);
//         console.log(`${method} request to "${url}" successful`);
//         return response.json();
//     } catch (error) {
//         console.error(`Error in fetchAnything with ${method} to ${url}:`, error);
//         throw error;
//     }
// }

async function apiCall(urlPath, method = 'GET', options = {}) {
    const { baseUrl = BASE_URL, timeout = 5000, headers = {}, ...otherOptions } = options;
    const url = `${baseUrl}/${encodeURI(urlPath)}`;

    // Set fetch options with default JSON content type and merge headers
    const fetchOptions = {
        method,
        headers: { 'Content-Type': 'application/json', ...headers },
        ...otherOptions,
    };

    // Add AbortController for timeout
    const controller = new AbortController();
    fetchOptions.signal = controller.signal;

    // Helper function to handle timeout (5 seconds by default) // BE AWARE HERE IF SLOW NETWORK
    const timeoutFetch = (fetchPromise) =>
        new Promise((resolve, reject) => {
            const id = setTimeout(() => {
                controller.abort();
                reject(new Error(`Request timed out after ${timeout}ms`));
            }, timeout);
            fetchPromise.then(resolve, reject).finally(() => clearTimeout(id));
        });

    // Helper to handle response content based on type
    const parseResponse = async (response) => {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) return response.json();
        if (contentType.includes('text')) return response.text();
        if (contentType.includes('blob')) return response.blob();
        if (contentType.includes('arrayBuffer')) return response.arrayBuffer();
        return response.status; // Default for non-body responses (e.g., DELETE)
    };

    // Actual method
    try {
        const response = await timeoutFetch(fetch(url, fetchOptions));

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText} (${method} ${url})`);
        }

        return await parseResponse(response);
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error(`Request timed out for ${method} ${url}`);
        } else {
            console.error(`Error in apiCall with ${method} ${url}:`, error);
        }
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
    apiCall,
    fetchMovies, fetchMovieById, deleteMovieById,
    fetchTheaters, fetchTheaterById,
    fetchShowings, addShowing, deleteShowingById, fetchShowingByTheaterAndDate
};
