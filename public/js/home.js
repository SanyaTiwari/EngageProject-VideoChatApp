// Date & Time----------------------------------------

function displayDateTime() {
    var details = new Date();
    var ampm = details.getHours() >= 12 ? ' PM' : ' AM';

    var monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
    var month = details.getMonth();
    var date = details.getDate().toString();
    var result = monthList[month] + ' ' + date;

    var hours = details.getHours( ) % 12;
    hours = hours ? hours : 12;
  	var minutes = details.getMinutes().toString();
  	if(minutes.length == 1) minutes = 0 + minutes;
  	var seconds = details.getSeconds().toString();
  	if(seconds.length == 1) seconds = 0 + seconds;

  	result = result + ", " +  hours + ":" +  minutes + ":" +  seconds + ampm;
    document.getElementById('DateTime').innerHTML = result;
  	display();
}

function display() {
  	var refresh = 0;
  	mytime=setTimeout('displayDateTime()', refresh);
}

display();



// Carousel-------------------------------------------

$('.carousel').carousel({
  	interval: 7000
})


// Button functionalities-----------------------------

document.getElementById("NewRoomBtn").onclick = function () {
  	location.href = '/videochat';
};
 
document.getElementById("JoinBtn").onclick = function () {
  	var ID = document.getElementById("IDinput").value;
  	location.href = ID;
};