export async function fetchData(endpoint, options) {
    try {

        const backendResponse = await fetch(`http://127.0.0.1:8010${endpoint}`, options);

        if (!backendResponse.ok) {
            throw new Error(`HTTP error status: ${backendResponse.status}`)
        }
        return await backendResponse.json();
    }
    catch(error) {
        console.error("General Error: ", error.message);
        throw error;
    }
    
}