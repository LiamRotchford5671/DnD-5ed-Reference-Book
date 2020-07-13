// Set up a handle so we can toggle the display of the navbar
var navbarButton;
navbarButton = document.querySelector("#navbarbutton");
navbarButton.onclick = function() {showHideNavbar()};

// Set the default navbar setting to hidden
document.querySelector("#navbar").style.display = "none"

function showHideNavbar() {
    if(document.querySelector("#navbar").style.display === "none") {
        document.querySelector("#navbar").style.display = "";
    } else {
        document.querySelector("#navbar").style.display = "none"
    }
}
