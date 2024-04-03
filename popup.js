// define functions
const extractDomain = (url) => {
  const match = url.match(/^https?:\/\/([^\/]+)/);
  return match ? match[1] : null;
};


// define listeners
document.addEventListener('DOMContentLoaded', function() {

  // Get the current tab's URL and display it
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    let currentTab = tabs[0];
    document.getElementById('tab-url').textContent = "Domain: " + extractDomain(currentTab.url);

    // create the hidden form input
    document.getElementById('response').value = extractDomain(currentTab.url);
  });

  // Display additional information
  document.getElementById('info').textContent = 'Some additional info here';

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