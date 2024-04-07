// define functions
const extractDomain = (url) => {
  const match = url.match(/^(?:https?:\/\/)?(?:www\.)?([^\/]+)/);
  return match ? match[1] : null;
};



chrome.action.onClicked.addListener((tab) => {
  // Perform the action you want when the extension icon is clicked
  console.log('Extension icon clicked', tab);
  // You can also perform actions like opening a new tab with a specific URL
  // chrome.tabs.create({ url: 'https://example.com' });
});


// define listeners
document.addEventListener('DOMContentLoaded', function() {

  // Get the current tab's URL and display it
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    let currentTab = tabs[0];
    document.getElementById('tab-url').textContent = "Domain: " + extractDomain(currentTab.url);

    // create the hidden form input
    document.getElementById('response').value = extractDomain(currentTab.url);
  
    // Show the loading gif
    document.getElementById('loadingGif').classList.remove('hidden');
  
    console.log('http://localhost:8080/api/merchant/status?domain=' + extractDomain(currentTab.url));

    // Send the API request
    fetch('http://localhost:8080/api/merchant/status?domain=' + extractDomain(currentTab.url))
      .then(response => response.json())
      .then(data => {
        // Check if the feedback includes "queued"
        if (data.data == 'queued') {
          // Poll the API every 60 seconds
          const intervalId = setInterval(() => {
            fetch('http://localhost:8080/api/merchant/status?domain=' + extractDomain(currentTab.url))
              .then(response => response.json())
              .then(updatedData => {
                console.log(updatedData)
                if (!(updatedData.data == 'queued')) {
                  // If the status is no longer "queued", show the results and clear the interval
                  if (updatedData.data[0]['scam'] == 1) {
                    document.getElementById('unsafe').classList.remove('hidden');
                  } else {
                    document.getElementById('safe').classList.remove('hidden');
                  }
                  //document.getElementById('info').textContent = JSON.stringify(updatedData);
                  clearInterval(intervalId);
                  document.getElementById('loadingGif').classList.add('hidden');
                }
              }); 
          }, 20000);
        } else {
          // If the feedback does not include "queued", show the results immediately
          if (data.data[0]['scam'] == 1) {
            document.getElementById('unsafe').classList.remove('hidden');
          } else {
            document.getElementById('safe').classList.remove('hidden');
          }
          document.getElementById('loadingGif').classList.add('hidden');
        }
      });

  });

  // Display additional information
  document.getElementById('info').textContent = '';

  // Add event listeners for buttons
  document.getElementById('yes').addEventListener('click', function() {
    // Handle Button 1 click
    console.log('Submitting Feedback');
    fetch('http://3.128.204.19:45551/generate?response=' + document.getElementById('response').value + '&user_feedback=good')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
      console.log('Received data:', data);
      if (data['inserted'] == 'OK') {
        document.getElementById('feedback_response').innerText = "Thank you for your feedback!";
      } else {
        document.getElementById('feedback_response').innerText = "Thank you, we already have your feedback!";
      }
      document.getElementById('feedback_response').style.display = "flex";
      document.getElementById('submission_form').style.display = "none";
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
  });

  document.getElementById('no').addEventListener('click', function() {
    // Handle Button 2 click
    console.log('Button 2 clicked');
    document.getElementsByClassName('safe')[0].style.display = 'center';
    document.getElementsByClassName('unsafe')[0].style.display = 'none';

    fetch('http://3.128.204.19:45551/generate?response=' + document.getElementById('response').value + '&user_feedback=notsure')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
      console.log('Received data:', data);
      if (data['inserted'] == 'OK') {
        document.getElementById('feedback_response').innerText = "Thank you for your feedback!";
      } else {
        document.getElementById('feedback_response').innerText = "Thank you, we already have your feedback!";
      }
      document.getElementById('feedback_response').style.display = "flex";
      document.getElementById('submission_form').style.display = "none";
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
  });

  document.getElementById('ns').addEventListener('click', function() {
    // Handle Button 2 click
    console.log('Button 3 clicked');
    document.getElementsByClassName('safe')[0].style.display = 'none';
    document.getElementsByClassName('unsafe')[0].style.display = 'flex';

    fetch('http://3.128.204.19:45551/generate?response=' + document.getElementById('response').value + '&user_feedback=bad')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Received data:', data);
        if (data['inserted'] == 'OK') {
          document.getElementById('feedback_response').innerText = "Thank you for your feedback!";
        } else {
          document.getElementById('feedback_response').innerText = "Thank you, we already have your feedback!";
        }
        document.getElementById('feedback_response').style.display = "flex";
        document.getElementById('submission_form').style.display = "none";
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
  });
});