window.onload=function(){
  getSpeech(null);
}

function getSpeech (navValues){

  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
  var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
  var grammar = '#JSGF V1.0;'
  var recognition = new SpeechRecognition();
  var speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.continuous = true;

  recognition.start();

  recognition.onstart = function(event) {
    console.log("Started")
  }

  recognition.onresult = function(event) {
      var last = event.results.length - 1;
      var command = event.results[last][0].transcript;
      console.log(command);
      if (navValues){
        if (command.toLowerCase().includes('cancel')){
          sendMessagetoContext("cancelDom", null);
        }
        else if (command.toLowerCase().includes('scroll down')){
          sendMessagetoContext("scrollDown", null);
        }
        else if (command.toLowerCase().includes('scroll up')){
          sendMessagetoContext("scrollUp", null);
        }
        else {
          var foundNav = false;
          console.log("Trying to find nav object with the value:" + command);
          // iterate over each element in the array
          searchTerm = command;
          for (var i = 0; i < navValues.length; i++){
            console.log(navValues[i].elementId);
            if (command.includes(navValues[i].navValue)){
              console.log(navValues[i]);
              sendMessagetoContext("pressButton", navValues[i].elementId)
              navValues = null;
              foundNav = true;
              break;
            }
          }
          if (!foundNav){
            getSpeech(navValues);
          }
        }
      }
      else{
        if (command.toLowerCase().includes('test')){
          sendMessagetoContext("newDom", null);
        }
        else if (command.toLowerCase().includes('scroll down')){
          sendMessagetoContext("scrollDown", null);
        }
        else if (command.toLowerCase().includes('scroll up')){
          sendMessagetoContext("scrollUp", null);
        }
        else{
          getSpeech(null);
        }
      }
  };

  var useless_error = false;
  recognition.onerror = function(event) {
    try{
      if (event.error == "no-speech"){
          useless_error = true;
      }
      else if (event.error == "aborted") {
          //do nothing, not an error
      }
      else {
          console.log("There has been an error: " + event.error);
      }
    }
    catch (f){
      console.log("Theres been an error");
    }
  }
  recognition.onend = function(event) {
    console.log("Stopped");
    if (useless_error){
      console.log("Stopped because useless");
      recognition.start();
    }
  }
}

String.prototype.trim = function() {
    return String(this).replace(/^\s+|\s+$/g, '');
};

function sendMessagetoContext (msg, objectToPress){
  chrome.tabs.query({active: true, currentWindow:true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, {command: msg, objectToPress: objectToPress}, function(response){
      if (response.result.includes("Nav Icons")){
        var navList = response.navObjects;
        getSpeech(navList);
      }
      else if (response.result.includes("Complete")){
        getSpeech(null);
      }
      else{
        try{
          console.log(response.result);
          getSpeech(null);
        }
        catch (e){
          console.log(e);
        }
      }
    })
  })
};

chrome.runtime.onInstalled.addListener(function (object) {
  chrome.tabs.create({
        url: chrome.extension.getURL("welcome.html"),
        active: true
    })
});
