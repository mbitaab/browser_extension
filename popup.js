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
  });

  // Display additional information
  document.getElementById('info').textContent = 'Some additional info here';

  // Add event listeners for buttons
  document.getElementById('yes').addEventListener('click', function() {
    // Handle Button 1 click
    console.log('Button 1 clicked');
  });

  document.getElementById('no').addEventListener('click', function() {
    // Handle Button 2 click
    console.log('Button 2 clicked');
    document.getElementsByClassName('safe')[0].style.display = 'flex';
    document.getElementsByClassName('unsafe')[0].style.display = 'none';
  });

  document.getElementById('ns').addEventListener('click', function() {
    // Handle Button 2 click
    console.log('Button 3 clicked');
    document.getElementsByClassName('safe')[0].style.display = 'none';
    document.getElementsByClassName('unsafe')[0].style.display = 'flex';
  });
});