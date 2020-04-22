chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){

  var navObjectList = [];
  if (request.command == 'newDom'){
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
    var navIconVal = 0;
    
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
        navIconVal++;
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
    removeDom();
    sendResponse({result: "Clicked", navObjects: null});
  }
  else if (request.command == 'cancelDom'){
    removeDom();
    sendResponse({result: "Complete", navObjects: null});
  }
  else if (request.command == 'scrollDown'){
    window.scrollBy(0, 400);
    sendResponse({result: "Complete", navObjects: null});
  }

  else if (request.command == 'scrollUp'){
    window.scrollBy(0, -400);
    sendResponse({result: "Complete", navObjects: null});
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
  // Checks if element is disabled
  if (pageAtt.offsetWidth > 0 && pageAtt.offsetHeight > 0){
    return true;
  }
  else{
    return false;
  }
}

function removeDom(){
  try{
    document.getElementById("navigation-icons-div").remove();
  }
  catch (f){
    console.log(f);
  }
}
