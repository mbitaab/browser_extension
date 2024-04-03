async function sendUrlToApi(url) {
    // Extract the domain from the URL
    const urlObj = new URL(url);
    const domain = urlObj.hostname;

    // Prepare the API URL with the domain query parameter
    const apiUrl = `http://10.90.78.133:811/api/merchant/status?domain=${domain}`;

    try {
        // Send a request to the API
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();

        // Check if the result is ready
        if (result.result === 'success') {
            if (result.data === 'queued') {
                console.log('Result is not ready.');
                return 'Result is not ready.';
            } else if (Array.isArray(result.data) && result.data.length > 0) {
                // Assuming the first item in the array contains the relevant data
                const scamValue = result.data[0].scam;
                console.log('Scam value:', scamValue);
                return scamValue;
            }
        }
    } catch (error) {
        console.error('Error fetching API data:', error);
        return 'Error fetching API data.';
    }
}

chrome.action.onClicked.addListener((tab) => {
    const currentTabUrl = tab.url;
    console.log('Background script:', currentTabUrl);
    sendUrlToApi(currentTabUrl).then(result => console.log(result));
});
