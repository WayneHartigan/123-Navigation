document.addEventListener('DOMContentLoaded', function() {
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

    recognition.onresult = function(event) {
        var last = event.results.length - 1;
        var command = event.results[last][0].transcript;
        try{
          message.textContent = command;
        }
        catch (e){
          // pass 
        }
        if (navValues){
          var foundNav = false;
          console.log("Trying to find nav object with the value:" + command);
          // iterate over each element in the array
          searchTerm = command.trim();
          for (var i = 0; i < navValues.length; i++){
            console.log(navValues[i].elementId);
            if (command.toUpperCase() == navValues[i].navValue){
              console.log("WE FOUND HER");
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
        else{
          if (command.toLowerCase().includes('test')){
            sendMessagetoContext("newDom", null);
            // return;
          }
          else if (command.toLowerCase().includes('cancel')){
            sendMessagetoContext("cancelDom", null);
          }
          else{
            getSpeech(null);
          }
        }
    };
    recognition.onend = function(event) {
      console.log("ITS BEEN STOPPED!!!");
    }
    recognition.onerror = function(event) {
      try{
        console.log(event.error)
      }
      catch (f){
        //do nothing
      }
    }
    recognition.start();
  }
  getSpeech(null);

  String.prototype.trim = function() 
    {
        return String(this).replace(/^\s+|\s+$/g, '');
    };

  function sendMessagetoContext (msg, objectToPress){
    chrome.tabs.query({active: true, currentWindow:true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, {command: msg, objectToPress: objectToPress}, function(response){
        if (response.result.includes("Nav Icons")){
          var navList = response.navObjects;
          getSpeech(navList);
          console.log("Created Nav Icons.");
        }
        else if (response.result.includes("Successfully Clicked!")){
          var navList = response.navObjects;
          getSpeech(null);
          console.log("Resetting.");
        }
        else{
          try{
            console.log(response.result);
            getSpeech(null);
          }
          catch (e){
            console.log("Some error occured with response");
          }
        }
      })
    })
  };

}, false);

chrome.runtime.onInstalled.addListener(function (object) {
    chrome.tabs.create({url: "chrome-extension://dmbdalginlkikpgpdjihliecefainbab/index.html"}, function (tab) {
      window.onload = function permission(){
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then((mediaStream) => {
        //in promise will be triggered user permission requests
        })
        .catch((error) => {
          //manage error
        });
      }
    });
});
