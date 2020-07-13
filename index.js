// Set up a handle so the display of the navbar can be toggled.
var navbarButton;
navbarButton = document.querySelector("#navbarButton");
navbarButton.onclick = function() {showHideNavbar()};

var aboutButton;
aboutButton = document.querySelector("#aboutButton");
aboutButton.onclick = function() {addPage(aboutContent)};

var aboutContent;
aboutContent = "About Page";

// Set the default navbar setting to hidden.
document.querySelector("#navbar").style.display = "none"

// Shows or hides the navbar.
function showHideNavbar() {
    if(document.querySelector("#navbar").style.display === "none") {
        document.querySelector("#navbar").style.display = "";
    } else {
        document.querySelector("#navbar").style.display = "none"
    }
}

function addPage(contentbyID) {
    var pageContent;
    var insertLocation;

    insertLocation = document.querySelector("main");
    pageContent = document.createElement("div");
    pageContent.textContent = contentbyID;
    insertLocation.insertAdjacentElement('beforeend', pageContent);
}
