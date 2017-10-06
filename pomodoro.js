
window.onload = function() {

  var intervalID;

  $(".dial").knob();


  function checkTime(timeLimit){
    var currTime = moment().format('LT');

    if(currTime > timeLimit){
     alert("Times Up")
     window.clearInterval(intervalID)

    }
  }


   $("#play").click(function(){

     var start = moment();
     var userInput = document.getElementById("userVal").value
     var end = moment(start).add(userInput,'minutes').format('LTS');

     intervalID = window.setInterval(checkTime, 1000, end);

     console.log("start time: "+start.format('LTS'));
     console.log("end time: "+end);

   })


}
