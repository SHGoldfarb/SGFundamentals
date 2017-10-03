import '../styles/index.scss';
if(document.getElementById("close")){
  document.getElementById("close").addEventListener("click", () => {
    var error = document.getElementById("error_message"); 
    var body = document.getElementsByTagName("BODY")[0];
    error.className += " hidden"
    setTimeout( () => body.removeChild(error), 700);
  })
}