/* Setting up webkitSpeechRecognition */
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
/* End set up */

// Starting recognition
recognition.start();

// When result is found
recognition.onresult = function(event) {
    speechResults(event, navValues);
};

// When error is found
recognition.onerror = function(event) {
    // Check if error is "No-Speech" or "Not-Allowed"
    // These are not real errors
    if (event.error != "no-speech" && event.error != "not-allowed"){
        console.log("Theres been an error: " + event.error);
    }
};

// When the recognition ends
recognition.onend = function(event) {
    // Start the recognition again
    // This allows continuous interaction and recognition
    recognition.start();
};


function speechResults(event, navValues){
    // Get the command from the webkitSpeechRecognition event. In lower case
    var last = event.results.length - 1;
    var command = event.results[last][0].transcript.toLowerCase();

    // If navValues have been sent from context
    if (navValues){
        // Check if the user has said a value in the list
        if (!checkForMatchingNavValue(command, navValues)){
            // Else check if the users input matches the command list
            checkCommands(command);
        }
    }
    // Else if the users input matches the command list
    else{
        checkCommands(command);
    }
}

function checkForMatchingNavValue(command, navValues) {
    // Add a space each end of the users input
    // This prevents the user saying "7" and "77" getting picked up
    // "7" will become " 7 " & "77" will become " 77 "
    var commandCheck = " " + command + " ";
    // iterate over each element in the array to see if it matches any of the navicons values
    for (var i = 0; i < navValues.length; i++){
        var navCheck = " " + (navValues[i].navValue).toString() + " ";
        if (commandCheck.includes(navCheck)){
            // If it does match, send that button id to the context class
            sendMessagetoContext("pressButton", navValues[i].elementId)
            // set the nav values back to null
            navValues = null;
            // return true so the command before knows not to look for any other command
            return true;
        }
    }
    // if the user's input does not include a correct nav value id return false
    // This will then check for other commands
    return false;
}

function checkCommands(command) {
    // Checks for other commands such as scroll up, scroll down etc
    if (command.includes('navigation')){
        // Sends a message to context with a specific message
        // No button to click so pass in null
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
        // if the user has said "search for {search term}"
        // split the command afer "search for"
        var searchTerm = command.split('search for ').pop();
        // send this message with the search term as the param
        // Same param used to tell context which button to click
        sendMessagetoContext("search", searchTerm)
    }
}

/*
    Sends a message to context
    msg == command
    objectToPress == whichever element the user has requested to click
    objectToPress can also be used for the search param
*/
function sendMessagetoContext (msg, objectToPress){
    chrome.tabs.query({active: true, currentWindow:true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {command: msg, objectToPress: objectToPress}, function(response){
            try {
                // If the response is "Nav Icons" it means the navigation icons have been created
                // Set the navValues to the list of nav values returned from the context
                if (response.result.includes("Nav Icons")){
                    var navList = response.navObjects;
                    navValues = navList;
                }
                // If its "completed" it means that some other command was completed
                // This includes clicking the element so navValues is set back to null
                else if (response.result.includes("Complete")){
                    navValues = null;
                }
            }
            catch {
                // Response returned undefined, prevents errors
            }
        })
    })
};

// When the extension is installed run the "welcome.html" page in a new tab
chrome.runtime.onInstalled.addListener(function (object) {
    chrome.tabs.create({
        url: chrome.extension.getURL("html/welcome.html"),
        active: true
    })
});
