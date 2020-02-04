chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  if (request.command == 'newDom'){
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    //create new div to house navigating icons
    var newDiv = document.createElement('div');
    //give it some style
    newDiv.setAttribute("id", "navigation-icons-div")
    newDiv.setAttribute("style", "height:100%; width:100%; z-index:111111111111; position:fixed; top:0; left:0; text-align: center;" );
    //inject div into body of webpage
    document.body.appendChild(newDiv);

    //retireve and loop through each selected attribute
    var pageAtts = document.querySelectorAll('input,img,button,a');

    for (att of pageAtts){

      //retrieving details of each selected attribute
      var distance = att.getBoundingClientRect();
      var newTop = distance.top;
      var newLeft = distance.left;

      // creating new span (navigating icons)
      var navIcon = document.createElement('span');
      //applying style
      navIcon.setAttribute("class", "navIcon")
      var style = "background-color:blue; border-radius:3px; height:22px; width:22px; font-style:bold; font-size:15px; z-index:1111111111115656; color:white; position: absolute; top:"+newTop+"px; left:"+newLeft+"px;";
      navIcon.setAttribute("style", style);

      //random string and assigning it to nav icon
      var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var navIconVal = ""
      for (var i = 0; i < 2; i++){
        navIconVal += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      navIcon.innerHTML = navIconVal;

      //injecting each span into created div
      newDiv.appendChild(navIcon);
    }

    //send response to background.js allerting success
    sendResponse({result: "Nav Icons added successfully"});
  }
  else if (request.command == 'cancelDom'){
    removeDom();
    sendResponse({result: "Nav Icons removed successfully"});
  }
  else if (request.command == 'scrollDown'){
    window.scroll(0, 500);
    sendResponse({result: "Scrolled Down"});
  }

  else if (request.command == 'scrollUp'){
    window.scroll(0, -500);
    sendResponse({result: "Scrolled Up"});
  }
});

function removeDom(){
  try{
    document.getElementById("navigation-icons-div").remove();
  }
  catch (f){
    //do nothing
  }
}

window.addEventListener('scroll', function(e) {
  removeDom();
});
window.addEventListener('click', function(e) {
  removeDom();
});

//chrome-extension://fdbafhacfnhmcckdmepacejfkieiocpb/index.html
