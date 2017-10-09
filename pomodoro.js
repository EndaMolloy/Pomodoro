
window.onload = function() {

  var intervalID;
  var seconds;
  var minutes;
  var sessionValue;



  $(".dial").knob({     "min": 0,
                        'max': 180,


                        draw : function () {
                        // "tron" case
                        if(this.$.data('skin') == 'tron') {
                            this.cursorExt = 0.3;
                            var a = this.arc(this.cv)  // Arc
                                , pa                   // Previous arc
                                , r = 1;
                            this.g.lineWidth = this.lineWidth;
                            if (this.o.displayPrevious) {
                                pa = this.arc(this.v);
                                this.g.beginPath();
                                this.g.strokeStyle = this.pColor;
                                this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, pa.s, pa.e, pa.d);
                                this.g.stroke();
                            }
                            this.g.beginPath();
                            this.g.strokeStyle = r ? this.o.fgColor : this.fgColor ;
                            this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, a.s, a.e, a.d);
                            this.g.stroke();
                            this.g.lineWidth = 2;
                            this.g.beginPath();
                            this.g.strokeStyle = this.o.fgColor;
                            this.g.arc( this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
                            this.g.stroke();
                            return false;
                        }
                      }
                    });



/////////////////////////////////////////////////////////////
  var userInput = document.getElementById("timeCount").value;
  sessionValue = userInput;

  function checkTime(timeLimit){

    var currTime = moment();
    var timeRemaining = moment.duration(timeLimit.diff(currTime));
    minutes = Math.floor(timeRemaining.asMinutes());
    seconds = parseInt(timeRemaining.asSeconds())+1;

    if(minutes){
      updateKnob(minutes);
      // console.log(minutes)
      // console.log(seconds)
    }
    else{
      updateKnob(seconds);
      // console.log(seconds)
    }



  }

  function updateKnob(timeLimit){
    //document.getElementById("timeCount").value = seconds;
    $('.dial').val(timeLimit).trigger('change');

    if(!seconds){
      alert("Times Up")
      window.clearInterval(intervalID)
    }

  }

  $('input[type=text]').on('keydown', function(e) {
    if (e.which == 13) {
        userInput = $('#timeCount').val()
        console.log(userInput)
        sessionValue = userInput;
//         $('.dial').trigger('configure', {
//     max: userInput
// });
    }
});

  $("#pause").click(function(){

      userInput = seconds/60;
      window.clearInterval(intervalID);

  })

  $("#undo").click(function(){
      //set the value of the timer to that of default
      window.clearInterval(intervalID);
      document.getElementById("timeCount").value = sessionValue;
      $('.dial').val(sessionValue).trigger('change');
  })




   $("#play").click(function(){

     //need to put in case for userInput being changed but enter key not pressed
     //also one for mouse release

     var start = moment();
     var end = moment(start).add(userInput*60,'seconds');
     intervalID = window.setInterval(checkTime, 1000, end);

     console.log("start time: "+start.format("LTS"));
     //console.log("end time: "+end);

   })


}
