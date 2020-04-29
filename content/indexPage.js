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
