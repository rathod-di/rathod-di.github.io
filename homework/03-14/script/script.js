// JavaScript code for the landing page

// Get the locality links and add event listeners to them
var links = document.querySelectorAll("#localities a");
for (var i = 0; i < links.length; i++) {
links[i].addEventListener("click", showOverview);
}

// Function to show the overview of a locality
function showOverview(event) {
event.preventDefault();
var localityId = event.target.id;
var localityName = event.target.textContent;
var localityDescription = "Overview of " + localityName + ".";
document.getElementById("locality-description").textContent = localityDescription;
}