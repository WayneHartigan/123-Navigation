function getPermission(){
  console.log("Got to permission functions");
  navigator.mediaDevices.getUserMedia({audio: true})
  .then((mediaStream) => {
  //pass
  console.log("pass");
  })
  .catch((error) => {
    console.log(error)
    getPermission();
  });
}

getPermission();
