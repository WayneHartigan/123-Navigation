// Listen for message send from background
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    // If request message is "new dom" it means the user has said "Navigation"
    // This means we need to create the navigation icons
    if (request.command == 'newDom'){
        // Lets create the nav icons
        navObjectList = createBaseDiv(request);

        // Check the length of the navObjectList
        // If it is empty, it means that no nav icons were created (probably no clickable elements on page)
        // So no need to send a message back saying they've been created with an empty list
        if (navObjectList.length != 0){
            completeResponse("Nav Icons", navObjectList);
        }
        else {
            completeResponse("Complete", null);
        }
    }
    // Else check if its another command
    else{
        checkOtherCommands(request);
        completeResponse("Complete", null);
    }

    // if the user clicks or scrolls, the navigation icons should be removed
    document.onscroll = function(){
        removeDom();
        completeResponse("Complete", null);
    };
    document.onclick = function(){
        removeDom();
        completeResponse("Complete", null);
    };

    // function to send the response back to the background
    function completeResponse(msg, navObjectList) {
        sendResponse({result: msg, navObjects: navObjectList});
    }
});

/*
    This function is to create the base div that all navigation icons will be placed in
    This ensures the navigation icons can be placed in the correct position for each element
*/
function createBaseDiv(request) {
    // Ensure there is not already nav icons on screen
    // Remove old nav icons
    removeDom();

    //create new div to house navigating icons
    var newDiv = document.createElement('div');

    // Style the base div
    // z-index is very high number to ensure it is always on top
    newDiv.setAttribute("id", "navigation-icons-div")
    newDiv.setAttribute("style", "height:100%; width:100%; z-index:111111111111; position:fixed; top:0; left:0; text-align: center;");

    //inject div into body of webpage
    document.body.appendChild(newDiv);

    // return this function to allow the response to have a list of nav icons
    return createNavigationIcons(newDiv);
}

/* This function creates each div for all clickable elements on the webpage */
function createNavigationIcons(newDiv) {
    var navObjectList = [];
    var id = 1;
    var navIconVal = 0;

    // Get list of all elements in web page
    var pageAtts = document.querySelectorAll('*');
    // Loop through each element
    for (att of pageAtts){
        // if the element is in the viewport and is clickable progress else just skip it
        if (isElementInViewport(att) && checkIfClickable(att)){
            // get the pixel distance from top and left for the element
            // this allows the nav icon to be in the correct position
            var distance = att.getBoundingClientRect();
            var newTop = distance.top;
            var newLeft = distance.left;

            // creating new span (navigating icons)
            var navIcon = document.createElement('span');
            // giving the nav icon a class of navIcon
            navIcon.setAttribute("class", "navIcon")
            // give the icon some style with the top and left distance the same as the element it is assigned to
            var style = "font-size: 16px; font-family: Arial, Helvetica, sans-serif; color: rgb(255, 255, 255); text-shadow: 0.6px 0.6px 0 #000; display: flex; align-items: center; justify-content: center; height: 22px; width: 22px; background-image: linear-gradient(to right, rgb(35, 131, 187) , rgb(112, 176, 197)); border: solid 1px black; box-shadow: 1px 0 4px 0 rgba(0, 0, 0, 0.3), 0 6px 20px 0 rgba(0, 0, 0, 0.19); position: absolute; z-index:1111111111115656; top:"+newTop+"px; left:"+newLeft+"px;";
            navIcon.setAttribute("style", style);
            // bump up the number this allows infinite amounts of elemets to be used rather than a random number generator
            navIconVal++;
            // setting the nav icon's html to the nav value
            navIcon.innerHTML = navIconVal;

            //injecting each span into base div
            newDiv.appendChild(navIcon);

            // adding the nav value to the class of the element
            // this is used to click the element and keeps each element unique
            att.classList.add(navIconVal.toString());

            // create the nav object to add to the list of objects to return
            var navObject = {
                "elementId" : att.className.toString(),
                "navValue": navIconVal
            }
            navObjectList.push(navObject);
        }
    }
    // return the list when the for loop is done
    return navObjectList;
}

/* This function checks the message for all other commands */
function checkOtherCommands(request){
    if (request.command == 'pressButton' && request.objectToPress){
        // get the object to press from the request
        elementId = request.objectToPress;
        // click that element by searching by class name (all unique)
        document.getElementsByClassName(elementId.toString())[0].click();
        // remove the dom (nav icons)
        removeDom();

    }
    else if (request.command == 'cancelDom'){
        // remove the dom (nav icons)
        removeDom();
    }
    else if (request.command == 'scrollDown'){
        // remove the dom (nav icons)
        removeDom();
        // scroll up by 500 pixels
        window.scrollBy(0, 500);
    }

    else if (request.command == 'scrollUp'){
        // remove the dom (nav icons)
        removeDom();
        // scroll down by 500 pixels
        window.scrollBy(0, -500);
    }
    else if (request.command == 'goBack'){
        // navigate to previous web page
        window.history.back();
    }
    else if (request.command == 'goForward'){
        // navigate to next web page
        window.history.forward();
    }
    else if (request.command == 'goTop'){
        // remove the dom (nav icons)
        removeDom();
        // Scroll to the x,y of 0,0 (top of page)
        window.scrollTo(0, 0);
    }
    else if (request.command == 'goBottom'){
        // remove the dom (nav icons)
        removeDom();
        // Scroll to the x,y of 0,height of page (bottom of page)
        window.scrollTo(0,document.body.scrollHeight);
    }
    else if (request.command == 'search'){
        // remove the dom (nav icons)
        removeDom();
        // go to google search with the param of the search team
        // "_self" is to open the search in the same tab
        window.open('http://google.com/search?q='+ request.objectToPress, "_self");
    }
    else if (request.command == 'refresh'){
        // refresh the page
        location.reload();
    }
}

/*
    This function checks if the element is in the current viewing window of the user
    Prevents nav icons getting created for elements that the user cannot see
    Returns true or false
 */
function isElementInViewport(att) {
    var attDetails = att.getBoundingClientRect();
        return (
        attDetails.top >= 0 &&
        attDetails.left >= 0 &&
        attDetails.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        attDetails.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/*
    Checks if element is "clickable"
        if element is not disabled it checks the following params
        If element has an onclick or href it is clickable
        if element is a button, textarea or input tag it is clickable
        else it is not
    Returns true or false
 */
function checkIfClickable(pageAtt){
    // Checks if element is disabled
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

/*
    removes the base div created for the nav icons
    also removes all elements in it (nav icons)
*/
function removeDom(){
    // get div by id
    var dom = document.getElementById("navigation-icons-div")
    try {
        // try to remove it
        dom.remove();
    }
    catch {
        // doesnt exist so pass
    }
}
