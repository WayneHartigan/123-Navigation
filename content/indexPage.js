/* Google Chrome Extensions prevent in line scripts */

// this code is to open the welcome page again if the user is having microphone problems
document.addEventListener('DOMContentLoaded', function() {
    var welcome = document.getElementById("loadWelcome");
    welcome.addEventListener("click", openWelcome);
})

function openWelcome() {
    chrome.tabs.create({
        url: chrome.extension.getURL("html/welcome.html"),
        active: true
    })
}
