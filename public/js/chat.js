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



// Join button for global chat-------------------------
function JoinChat() {
    location.href = '/chat'
}



// ChatBot Functionalities-----------------------------
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  	ignoreQueryPrefix: true,
});


const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });


// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  	outputRoomName(room);
  	outputUsers(users);
});


// Message from server
socket.on('message', (message) => {
  	console.log(message);
  	outputMessage(message);
  	chatMessages.scrollTop = chatMessages.scrollHeight;
});


// Message submit
chatForm.addEventListener('submit', (e) => {
  	e.preventDefault();

  	// Get message text
  	let msg = e.target.elements.msg.value;
  	msg = msg.trim();
  	if (!msg) {
    	return false;
  	}

  	// Emit message to server
  	socket.emit('chatMessage', msg);

  	// Clear input
  	e.target.elements.msg.value = '';
  	e.target.elements.msg.focus();
});


// Output message to DOM
function outputMessage(message) {
  	const div = document.createElement('div');
  	div.classList.add('message');
  	const p = document.createElement('p');
  	p.classList.add('meta');
  	p.innerText = message.username;
  	p.innerHTML += `<span>${message.time}</span>`;
  	div.appendChild(p);
  	const para = document.createElement('p');
  	para.classList.add('text');
  	para.innerText = message.text;
  	div.appendChild(para);
  	document.querySelector('.chat-messages').appendChild(div);
}


// Add room name to DOM
function outputRoomName(room) {
  	roomName.innerText = room;
}


// Add users to DOM
function outputUsers(users) {
  	userList.innerHTML = '';
  	users.forEach((user) => {
    	const li = document.createElement('li');
    	li.innerText = user.username;
    	userList.appendChild(li);
  	});
}


//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  	const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  	if (leaveRoom) {
    	window.location = '/chatpage';
  	} 
  	else {
  	}
});