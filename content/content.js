chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){

    var navObjectList = [];
    if (request.command == 'newDom'){
        //if command has been called twice, remove old dom.
        if (request.objectToPress){
            removeDom();
        }
        //create new div to house navigating icons
        var newDiv = document.createElement('div');
        //give it some style
        newDiv.setAttribute("id", "navigation-icons-div")
        newDiv.setAttribute("style", "height:100%; width:100%; z-index:111111111111; position:fixed; top:0; left:0; text-align: center;");
        //inject div into body of webpage
        document.body.appendChild(newDiv);

        //retireve and loop through each selected attribute
        var pageAtts = document.querySelectorAll('*');

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
                var style = "font-size: 16px; font-family: Arial, Helvetica, sans-serif; color: rgb(255, 255, 255); text-shadow: 0.6px 0.6px 0 #000; display: flex; align-items: center; justify-content: center; height: 22px; width: 22px; background-image: linear-gradient(to right, rgb(35, 131, 187) , rgb(112, 176, 197)); border: solid 1px black; box-shadow: 1px 0 4px 0 rgba(0, 0, 0, 0.3), 0 6px 20px 0 rgba(0, 0, 0, 0.19); position: absolute; z-index:1111111111115656; top:"+newTop+"px; left:"+newLeft+"px;";
                navIcon.setAttribute("style", style);
                navIconVal++;
                navValueList.push(navIconVal)

                navIcon.innerHTML = navIconVal;

                //injecting each span into created div
                newDiv.appendChild(navIcon);
                att.classList.add(navIconVal.toString());
                console.log(att.className);

                var navObject = {
                    "elementId" : att.className.toString(),
                    "navValue": navIconVal
                }
                navObjectList.push(navObject);
            }
            else{
                //pass
            }
        }
        //send response to background.js allerting success
        if (navObjectList.length != 0){
            sendResponse({result: "Nav Icons", navObjects: navObjectList});
        }
        else {
            sendResponse({result: "Complete", navObjects: null});
        }

    }
    else if (request.command == 'pressButton' && request.objectToPress){
        elementId = request.objectToPress;
        document.getElementsByClassName(elementId.toString())[0].click();
        removeDom();
        sendResponse({result: "Complete", navObjects: null});
    }
    else if (request.command == 'cancelDom'){
        removeDom();
        sendResponse({result: "Complete", navObjects: null});
    }
    else if (request.command == 'scrollDown'){
        removeDom();
        window.scrollBy(0, 500);
        sendResponse({result: "Complete", navObjects: null});
    }

    else if (request.command == 'scrollUp'){
        removeDom();
        window.scrollBy(0, -500);
        sendResponse({result: "Complete", navObjects: null});
    }
    else if (request.command == 'goBack'){
        window.history.back();
        sendResponse({result: "Complete", navObjects: null});
    }
    else if (request.command == 'goForward'){
        window.history.forward();
        sendResponse({result: "Complete", navObjects: null});
    }
    else if (request.command == 'goTop'){
        removeDom();
        window.scrollTo(0, 0);
        sendResponse({result: "Complete", navObjects: null});
    }
    else if (request.command == 'goBottom'){
        removeDom();
        window.scrollTo(0,document.body.scrollHeight);
        sendResponse({result: "Complete", navObjects: null});
    }
    else if (request.command == 'search'){
        removeDom();
        window.open('http://google.com/search?q='+ request.objectToPress, "_self");
        sendResponse({result: "Complete", navObjects: null});
    }
    else if (request.command == 'refresh'){
        location.reload();
        sendResponse({result: "Complete", navObjects: null});
    }
    document.onscroll = function(){
        removeDom();
        sendResponse({result: "Complete", navObjects: null});
    };
    document.onclick = function(){
        removeDom();
        sendResponse({result: "Complete", navObjects: null});
    };
});

function isElementInViewport(att) {
    var attDetails = att.getBoundingClientRect();
        return (
        attDetails.top >= 0 &&
        attDetails.left >= 0 &&
        attDetails.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        attDetails.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function checkIfClickable(pageAtt){
    // Checks if element is disabled
    // Checks if element is disabled
    console.log(pageAtt.tagName);
    if (pageAtt.offsetWidth > 0 && pageAtt.offsetHeight > 0){
        if (pageAtt.getAttribute('onclick')!=null ||
         pageAtt.getAttribute('href')!=null ||
         pageAtt.tagName.toLowerCase() == "button" ||
         pageAtt.tagName.toLowerCase() == "textarea" ||
         pageAtt.tagName.toLowerCase() == "input"){
            return true;
        }
    }
    return false;
}

function removeDom(){
    try{
        document.getElementById("navigation-icons-div").remove();
    }
    catch (f){
        console.log(f);
    }
}
