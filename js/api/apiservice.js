const BASE_URL = 'http://localhost:8080';

async function apiCallWithFullUrl(urlPath, method = 'GET', options = {}) {
    const { baseUrl = BASE_URL, headers = {}, ...otherOptions } = options;
    const url = `${baseUrl}/${encodeURI(urlPath)}`;

    // Set fetch options with default JSON content type and merge headers
    const fetchOptions = {
        method,
        headers: { 'Content-Type': 'application/json', ...headers },
        ...otherOptions,
    };

    try {
        const response = await fetch(url, fetchOptions);

        // Check for a successful response
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText} (${method} ${url})`);
        }

        // Return the response as JSON
        return await response.json();
    } catch (error) {
        console.error(`Error in apiCall with ${method} ${url}: `, error);
        throw error;
    }
}

export {apiCallWithFullUrl};
