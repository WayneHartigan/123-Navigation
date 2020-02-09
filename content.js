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
    //
    // for (atts of allPageAtts){
    //   if $(atts).visible(true){
    //     var pageAtt.push(atts)
    //   }
    // }

    var navValueList = [];
    for (att of pageAtts){

      if (isElementInViewport(att)){
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

        if (navValueList.length >= 26){
            var navIconVal = generateRandomString(navValueList, 2);
        }
        else{
          var navIconVal = generateRandomString(navValueList, 1);
        }
        navValueList.push(navIconVal)

        navIcon.innerHTML = navIconVal;

        //injecting each span into created div
        newDiv.appendChild(navIcon);
      }
      else{
        //pass
      }
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


function isElementInViewport(el) {
  var rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document. documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document. documentElement.clientWidth)
  );
}


function checkIfClickable(pageAtt){
  // elementName = pageAtt.tagName.toLowerCase()
  //
  // if (pageAtt.hasAttribute('onclick')){
  //   return true;
  // }

  return true;
}

function generateRandomString(navValueList, length){
  //random string and assigning it to nav icon
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var navIconVal = ""
  for (var i = 0; i < length; i++){
    navIconVal += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  if (navValueList.includes(navIconVal)){
    return generateRandomString(navValueList, length);
  }
  else{
    return navIconVal;
  }
}

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
