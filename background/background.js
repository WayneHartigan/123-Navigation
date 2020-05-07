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
    var command = event.results[last][0].transcript;
    if (navValues){
        if (command.toLowerCase().includes('cancel')){
            sendMessagetoContext("cancelDom", null, null);
        }
        else if (command.toLowerCase().includes('navigation')){
            sendMessagetoContext("newDom", "remove", null);
        }
        else if (command.toLowerCase().includes('scroll down')){
            sendMessagetoContext("scrollDown", null, null);
        }
        else if (command.toLowerCase().includes('scroll up')){
            sendMessagetoContext("scrollUp", null, null);
        }
        else if (command.toLowerCase().includes('scroll top')){
            sendMessagetoContext("goTop", null, null);
        }
        else if (command.toLowerCase().includes('scroll bottom')){
            sendMessagetoContext("goBottom", null, null);
        }
        else if (command.toLowerCase().includes('go back')){
            sendMessagetoContext("goBack", null, null);
        }
        else if (command.toLowerCase().includes('go forward')){
            sendMessagetoContext("goForward", null, null);
        }
        else if (command.toLowerCase().includes('search for ')){
            var searchTerm = command.split('search for ').pop();
            sendMessagetoContext("search", searchTerm, null)
        }
        else {
            var commandCheck = " " + command + " ";
            // iterate over each element in the array
            for (var i = 0; i < navValues.length; i++){
                var navCheck = " " + (navValues[i].navValue).toString() + " ";
                if (commandCheck.includes(navCheck)){
                    if (commandCheck.toLowerCase().includes("type")){
                        sendMessagetoContext("type", navValues[i].elementId, commandCheck.toLowerCase())
                    }
                    sendMessagetoContext("pressButton", navValues[i].elementId, null)
                    navValues = null;
                    break;
                }
            }
        }
    }
    else{
        if (command.toLowerCase().includes('navigation')){
            sendMessagetoContext("newDom", null, null);
        }
        else if (command.toLowerCase().includes('scroll down')){
            sendMessagetoContext("scrollDown", null, null);
        }
        else if (command.toLowerCase().includes('scroll up')){
            sendMessagetoContext("scrollUp", null, null);
        }
        else if (command.toLowerCase().includes('go back')){
            sendMessagetoContext("goBack", null, null);
        }
        else if (command.toLowerCase().includes('go forward')){
            sendMessagetoContext("goForward", null, null);
        }
        else if (command.toLowerCase().includes('scroll top')){
            sendMessagetoContext("goTop", null, null);
        }
        else if (command.toLowerCase().includes('scroll bottom')){
            sendMessagetoContext("goBottom", null, null);
        }
        else if (command.toLowerCase().includes('refresh page')){
            sendMessagetoContext("refresh", null, null);
        }
        else if (command.toLowerCase().includes('search for ')){
            var searchTerm = command.split('search for ').pop();
            sendMessagetoContext("search", searchTerm, null)
        }
    }
}

function sendMessagetoContext (msg, objectToPress, message){
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
