function getPermission(){
    navigator.mediaDevices.getUserMedia({audio: true})
    .then((mediaStream) => {
        //pass
    })
    .catch((error) => {
        console.log(error)
    });
}
getPermission();
