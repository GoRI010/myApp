function addText(t){
  var node = document.createElement("p");  
  var textnode = document.createTextNode(t);
  node.appendChild(textnode);
  document.getElementById("logdiv").appendChild(node);  
}
  
var console = (function(oldCons){
  return {
      log: function(text){
          oldCons.log(text);
          addText(text);
          // Your code
      },
      info: function (text) {
          oldCons.info(text);
          addText(text);
          // Your code
      },
      warn: function (text) {
          oldCons.warn(text);
          addText(text);
          // Your code
      },
      error: function (text) {
          oldCons.error(text);
          addText(text);
          // Your code
      }
  };
  }(window.console));
  
  //Then redefine the old console
window.console = console;

function log(t){
    console.log(t);
}