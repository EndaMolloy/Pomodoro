
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
      addToCompletedSession()
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
     var end = moment(start).add(userInput*60,'seconds'); /////////////should be (userInput*60,'seconds')
     intervalID = window.setInterval(checkTime, 1000, end);

     console.log("start time: "+start.format("LTS"));
     //console.log("end time: "+end);

   })

   //make a copy of the input div
   var originalState = $("#inputContainer").clone();
   var completedSessionsArr = [];

   $(document).on('keypress', '#taskInput', function(e) {
     if (e.which == 13 && $(this).val().length > 0) {
       addButtons(this.value)
     }
    })



   function addButtons(task){

     $("#inputContainer").replaceWith('<div id=taskConfirmed></div>')

     var taskDisplay = document.getElementById('taskConfirmed');
     taskDisplay.innerHTML = '';

     var taskLabel = document.createElement('label');
     var delBtn = document.createElement('span');
     var checkbox = document.createElement('input');

     taskLabel.className = 'taskLabel';
     taskLabel.textContent = task;

     delBtn.className = 'deleteTaskBtn';
		 delBtn.textContent = 'x';
     delBtn.id = 'delete'
		 //delBtn.onclick = deleteTask(originalState);

     checkbox.className = 'taskCheckbox';
     checkbox.id = 'checkbox'
     checkbox.type = 'checkbox';
		 checkbox.checked = task.done;
		 //checkbox.onclick = toggleChecked;

     taskDisplay.appendChild(checkbox);
     taskDisplay.appendChild(taskLabel);
     taskDisplay.appendChild(delBtn);

   }

   //creating elements dynamically, you need to use event delegation using 'on'
   //Delegated event by attaching the event to the document or to the parent element that exists at any point in time.
   $(document).on('click','#delete',function(){
     $("#taskConfirmed").replaceWith(originalState)
   })

   $(document).on('click','#checkbox', function(){
    if (this.checked) {
        $('.taskLabel').css('text-decoration', 'line-through')
        //addToCompletedTask(completedTask)
    }
})

function addToCompletedSession(){

  var completedTask = $('.taskLabel').text();
  console.log('completedTask',completedTask);


  var id = (completedSessionsArr.length + 1).toString();

  completedSessionsArr.push({
    'id' : id,
    'task': completedTask,
    'time': sessionValue,
    'timestamp': moment().format()
  })

  //console.log(completedSessionsArr);
  if(completedSessionsArr.length===6){
    alert('Please commit before starting next session')
  }
  else{
    updateSessionList()
  }
}

function updateSessionList(){
  var ul = document.getElementById('myCompletedTask');
  ul.innerHTML = '';

  completedSessionsArr.forEach(task=>{

        // console.log('task',task.task);
        // console.log('taskID', task.id);
        // console.log('tasktime', task.time);

    var listitem = document.createElement('li'),
        id = document.createElement('label'),
        taskLabel = document.createElement('label'),
        timeLabel = document.createElement('label'),
        delSessBtn = document.createElement('span')

        id.textContent = task.id;
        taskLabel.textContent = task.task;
        timeLabel.textContent = task.time;
        delSessBtn.textContent = 'x';

        listitem.appendChild(id);
        listitem.appendChild(taskLabel)
        listitem.appendChild(timeLabel)
        listitem.appendChild(delSessBtn)

        ul.appendChild(listitem)

  })




}

$("#deleteArr").click(function(){

    completedSessionsArr = [];
    console.log(completedSessionsArr);
})

$("#view").click(function(){

    console.log(completedSessionsArr);
})

}
