chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){

  var navObjectList = [];
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

    var navValueList = [];
    var id = 1;
    for (att of pageAtts){
      if (isElementInViewport(att) && checkIfClickable(att)){
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

        var navIconVal = generateRandomString(navValueList, 2);
        navValueList.push(navIconVal)

        navIcon.innerHTML = navIconVal;

        //injecting each span into created div
        newDiv.appendChild(navIcon);

        if (!att.id) {
          att.id = navIconVal;
        }

        var navObject = {
            "id": id,
            "elementId" : att.id,
            "navValue": navIconVal
          }
        // att.click();
        navObjectList.push(navObject);
        id++;
      }
      else{
        //pass
      }
    }
    //send response to background.js allerting success
    sendResponse({result: "Nav Icons", navObjects: navObjectList});
  }
  else if (request.objectToPress){
    console.log("TRYING TO PRESS");
    console.log(navObjectList);
    elementId = request.objectToPress;
    document.getElementById(elementId).click();
    sendResponse({result: "Successfully Clicked!", navObjects: null});
  }
  else if (request.command == 'cancelDom'){
    removeDom();
    sendResponse({result: "Nav Icons removed successfully", navObjects: null});
  }
  else if (request.command == 'scrollDown'){
    window.scroll(0, 500);
    sendResponse({result: "Scrolled Down", navObjects: null});
  }

  else if (request.command == 'scrollUp'){
    window.scroll(0, -500);
    sendResponse({result: "Scrolled Up", navObjects: null});
  }
});


function isElementInViewport(att) {
  var attDetails = att.getBoundingClientRect();
  return (
    attDetails.top >= 0 &&
    attDetails.left >= 0 &&
    attDetails.bottom <= (window.innerHeight || document. documentElement.clientHeight) &&
    attDetails.right <= (window.innerWidth || document. documentElement.clientWidth)
  );
}


function checkIfClickable(pageAtt){
  // elementName = pageAtt.tagName.toLowerCase()
  //
  // if (pageAtt.hasAttribute('onclick')){
  //   return true;
  // }

  // return (pageAtt.hasAttribute('onclick'));
  if (pageAtt.offsetWidth > 0 && pageAtt.offsetHeight > 0){
    return true;
  }
  else{
    return false;
  }
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
