
window.onload = function() {

  var intervalID;
  var seconds;
  var minutes;
  var sessionValue;
  var milli;



  $("#slider").roundSlider({
    sliderType: "min-range",
    handleShape: "square",
    radius: 100,
    value: 100,
    startAngle: 270,
    handleSize: "+0",
    mouseScrollAction: true,
    width: 9,
    tooltipFormat: function (e) {
      return e.value + "<div>" + "MINUTES" + "<div>";
    }
});




/////////////////////////////////////////////////////////////

  var userInput = $("#slider").roundSlider("getValue");
  sessionValue = userInput;

  console.log(userInput);


  function checkTime(timeLimit){

    var currTime = moment();
    var timeRemaining = moment.duration(timeLimit.diff(currTime));
    minutes = Math.floor(timeRemaining.asMinutes());
    seconds = parseInt(timeRemaining.asSeconds())+1;
    milli = parseInt(timeRemaining.asMilliseconds());

    //var formatedTime = moment.utc(timeRemaining.asMilliseconds()).format('HH:mm');

    console.log(milli);
    //console.log(seconds);

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

      userInput = milli/(60*1000);
      console.log('pausedAt: '+milli);
      //userInput = seconds/(60*1000);
      window.clearInterval(intervalID);

  })

  $("#undo").click(function(){
      //set the value of the timer to that of default
      window.clearInterval(intervalID);
      document.getElementById("timeCount").value = sessionValue;
      $('.dial').val(sessionValue).trigger('change');
  })




   $("#play").click(function(){
     console.log('userInput',userInput);

     var start = moment();
     var end = moment(start).add(userInput*60*1000,'milliseconds'); /////////////should be (userInput*60,'seconds')
     intervalID = window.setInterval(checkTime, 1000, end);

     console.log("start time: "+start.format("LTS"));
     //console.log("end time: "+end);

     if($("#taskConfirmed").length == 0) {
        if($("#taskInput").val().length > 0){
          addButtons($("#taskInput").val())
        }
     }

   })

   //make a copy of the input div
   var originalState = $("#inputContainer").clone();
   var completedSessionsArr = [];

   if( JSON.parse( localStorage.getItem( 'completedSessionsArr' )))
	   completedSessionsArr = JSON.parse( localStorage.getItem( 'completedSessionsArr' ));
   else
	   localStorage.setItem("completedSessionsArr", JSON.stringify(completedSessionsArr));


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

  var completedTask = $('.taskLabel').text() || "Session";
  console.log('completedTask',completedTask);


  var id = (completedSessionsArr.length).toString();

  completedSessionsArr.push(
    // 'id' : id,
    // 'task': completedTask,
    // 'time': sessionValue,
    // 'timestamp': moment().format()

    [id, completedTask, sessionValue, moment().format()]

  )

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

    var listItem = document.createElement('li'),
        taskID = document.createElement('label'),
        taskLabel = document.createElement('label'),
        timeLabel = document.createElement('label'),
        delSessBtn = document.createElement('span')

        listItem.id = completedSessionsArr.indexOf(task);

        // id.textContent = task.id;
        // taskLabel.textContent = task.task;
        // timeLabel.textContent = task.time;
        // delSessBtn.textContent = 'x';

        taskID.textContent = task[0];
        taskLabel.textContent = task[1];
        timeLabel.textContent = task[2];
        delSessBtn.textContent = 'x';
        delSessBtn.onclick = deleteThisTask;

        listItem.appendChild(taskID);
        listItem.appendChild(taskLabel)
        listItem.appendChild(timeLabel)
        listItem.appendChild(delSessBtn)

        ul.appendChild(listItem)

  })

}

function deleteThisTask(e){

  var confirmDel = confirm("Are you sure you want to delete?");

  if(confirmDel){
    completedSessionsArr.splice( e.target.parentElement.id, 1 );
    updateSessionList()
  }

}


$("#send").click(function(){
  loadAuth()

})


function loadAuth(callback) {
  gapi.load('client:auth2', initClient);
}

function handleSignInClick() {
  gapi.auth2.getAuthInstance().signIn();
}

function updateSignInStatus(isSignedIn) {
  if (isSignedIn) {
    makeApiCall();
  }
}

function initClient() {
  var API_KEY = 'AIzaSyBvmToW3-LDW--udAD8hJdtLmxVMtguqZU  ';  // TODO: Update placeholder with desired API key.

  var CLIENT_ID = '1003828564878-g615ru3uuprqa5uqcu0osqce5a3q8nil.apps.googleusercontent.com';  // TODO: Update placeholder with desired client ID.

  // TODO: Authorize using one of the following scopes:
  //   'https://www.googleapis.com/auth/drive'
  //   'https://www.googleapis.com/auth/drive.file'
  //   'https://www.googleapis.com/auth/spreadsheets'
  var SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

  gapi.client.init({
    'apiKey': API_KEY,
    'clientId': CLIENT_ID,
    'scope': SCOPE,
    'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  }).then(function() {
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
    updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  });
}


function makeApiCall() {
  var params = {
    // The ID of the spreadsheet to update.
    spreadsheetId: '1-OvO4fs0xxoo9rYTELMQoPXE7iM4umoDVuZoAAlkEFY',  // TODO: Update placeholder value.

    // The A1 notation of a range to search for a logical table of data.
    // Values will be appended after the last row of the table.
    range: 'A1',  // TODO: Update placeholder value.

    // How the input data should be interpreted.
    valueInputOption: 'USER_ENTERED',  // TODO: Update placeholder value.

    // How the input data should be inserted.
    insertDataOption: 'INSERT_ROWS',  // TODO: Update placeholder value.
  };

//   var test = [[
//   "spanish2",
//   "120",
//   "02-11-2017"
//   ],
//   [
//   "programming1",
//   "340",
//   "03-12-2017"
// ]]

  var valueRangeBody = {
    // TODO: Add desired properties to the request body.
    "majorDimension": "ROWS",
"values": completedSessionsArr
  };

  var request = gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
  request.then(function(response) {
    // TODO: Change code below to process the `response` object:
    console.log(response.result);
  }, function(reason) {
    console.error('error: ' + reason.result.error.message);
  });
}

$("#deleteArr").click(function(){

    completedSessionsArr = [];
    console.log(completedSessionsArr);
})

$("#view").click(function(){

    console.log(completedSessionsArr);
})

}
