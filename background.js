async function sendUrlToApi(url) {
    const apiUrl = 'https://yourapi.com/endpoint';
    const data = url;
    // try {
    //     const response = await fetch(apiUrl, {
    //     method: 'POST', // or 'GET', depending on the API
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ url: url }),
    //     });
    //     const data = await response.json();
    //     console.log(data);
    //     // Process the API's response here
    // } catch (error) {
    //     console.error('Error:', error);
    // }
    return url;
}

chrome.action.onClicked.addListener((tab) => {
    const currentTabUrl = tab.url;
    console.log('bg:', currentTabUrl);
    sendUrlToApi(currentTabUrl);
});