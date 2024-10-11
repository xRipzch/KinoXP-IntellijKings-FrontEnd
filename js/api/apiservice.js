const BASE_URL = 'http://localhost:8080';

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

    // Helper function to handle response content based on type
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
            console.error(`Error in apiCall with ${method} ${url}: `, error);
        }
        throw error;
    }

}
export {
    apiCall,


};
