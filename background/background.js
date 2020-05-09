var navValues = null;
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var grammar = '#JSGF V1.0;'
var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.continuous = false;
recognition.start();

recognition.onresult = function(event) {
    speechResults(event, navValues);
};
recognition.onerror = function(event) {
    if (event.error != "no-speech"){
        console.log("Theres been an error: " + event.error);
    }
};
recognition.onend = function(event) {
    recognition.start();
};

function speechResults(event, navValues){
    var last = event.results.length - 1;
    var command = event.results[last][0].transcript.toLowerCase();
    if (navValues){
        if (!checkCommands(command)){
            checkForMatchingNavValue(command, navValues);
        }
    }
    else{
        checkCommands(command);
    }
}

function checkForMatchingNavValue(command, navValues) {
    var commandCheck = " " + command + " ";
    // iterate over each element in the array
    for (var i = 0; i < navValues.length; i++){
        var navCheck = " " + (navValues[i].navValue).toString() + " ";
        if (commandCheck.includes(navCheck)){
            sendMessagetoContext("pressButton", navValues[i].elementId)
            navValues = null;
        }
    }
}

function checkCommands(command) {
    if (command.includes('navigation')){
        sendMessagetoContext("newDom", null);
    }
    else if (command.includes('scroll down')){
        sendMessagetoContext("scrollDown", null);
    }
    else if (command.includes('cancel')){
        sendMessagetoContext("cancelDom", null);
    }
    else if (command.includes('scroll up')){
        sendMessagetoContext("scrollUp", null);
    }
    else if (command.includes('go back')){
        sendMessagetoContext("goBack", null);
    }
    else if (command.includes('go forward')){
        sendMessagetoContext("goForward", null);
    }
    else if (command.includes('scroll top')){
        sendMessagetoContext("goTop", null);
    }
    else if (command.includes('scroll bottom')){
        sendMessagetoContext("goBottom", null);
    }
    else if (command.includes('refresh page')){
        sendMessagetoContext("refresh", null);
    }
    else if (command.includes('search for ')){
        var searchTerm = command.split('search for ').pop();
        sendMessagetoContext("search", searchTerm)
    }
    else {
        return false;
    }
}

function sendMessagetoContext (msg, objectToPress){
    chrome.tabs.query({active: true, currentWindow:true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {command: msg, objectToPress: objectToPress}, function(response){
            if (response === undefined){
                //pass
            }
            else {
                if (response.result.includes("Nav Icons")){
                    var navList = response.navObjects;
                    navValues = navList;
                }
                else if (response.result.includes("Complete")){
                    navValues = null;
                }
            }
        })
    })
};

chrome.runtime.onInstalled.addListener(function (object) {
    chrome.tabs.create({
        url: chrome.extension.getURL("html/welcome.html"),
        active: true
    })
});
