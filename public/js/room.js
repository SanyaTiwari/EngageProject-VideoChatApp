const socket = io("/");
const chatInputBox = document.getElementById("chat_message");
const all_messages = document.getElementById("all_messages");
const main__chat__window = document.getElementById("main__chat__window");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

var peer = new Peer(undefined, {
	path: "/peerjs",
	host: "mitron-videochatapp.herokuapp.com",
	port: "3000",
});

let myVideoStream;

var getUserMedia =
	navigator.getUserMedia ||
	navigator.webkitGetUserMedia ||
	navigator.mozGetUserMedia;


navigator.mediaDevices
	.getUserMedia({
		video: true,
    	audio: true,
  	})
  	.then((stream) => {
    	myVideoStream = stream;
    	addVideoStream(myVideo, stream);

    	peer.on("call", (call) => {
      		call.answer(stream);
      		const video = document.createElement("video");

      		call.on("stream", (userVideoStream) => {
        		addVideoStream(video, userVideoStream);
      		});
    	});

    	socket.on("user-connected", (userId) => {
      		connectToNewUser(userId, stream);
    	});

    	socket.on("user-disconnected", (userId) => {
      		disconnectUser(userId, stream);
    	});

	    document.addEventListener("keydown", (e) => {
	    	if (e.which === 13 && chatInputBox.value != "") {
	        	socket.emit("message", chatInputBox.value);
	        	chatInputBox.value = "";
	      	}
    	});

	    socket.on("createMessage", (msg) => {
	    	console.log(msg);
	      	let li = document.createElement("li");
	      	li.innerHTML = msg;
	      	all_messages.append(li);
	      	main__chat__window.scrollTop = main__chat__window.scrollHeight;
	    });
  	});


peer.on("call", function (call) {
  	getUserMedia(
    	{ video: true, audio: true },
    	function (stream) {
      		call.answer(stream);
      		const video = document.createElement("video");
      		call.on("stream", function (remoteStream) {
        		addVideoStream(video, remoteStream);
      		});
    	},
    	function (err) {
      		console.log("Failed to get local stream", err);
    	}
  	);
});

peer.on("open", (id) => {
  	socket.emit("join-room", ROOM_ID, id);
});



const connectToNewUser = (userId, streams) => {
  	var call = peer.call(userId, streams);
  	console.log(call);
  	var video = document.createElement("video");
  	call.on("stream", (userVideoStream) => {
    	console.log(userVideoStream);
    	addVideoStream(video, userVideoStream);
  	});
};

const addVideoStream = (videoEl, stream) => {
  	videoEl.srcObject = stream;
  	videoEl.addEventListener("loadedmetadata", () => {
    	videoEl.play();
  	});

  	videoGrid.append(videoEl);
  	let totalUsers = document.getElementsByTagName("video").length;
  	if (totalUsers > 1) {
    	for (let index = 0; index < totalUsers; index++) {
      		document.getElementsByTagName("video")[index].style.width =
        		100 / totalUsers + "%";
    	}
  	}
};

const disconnectUser = (userId, streams) => {
  	var videoTrack = stream.getVideoTracks();
	if (videoTrack.length > 0) {
		userStream.removeTrack(videoTrack[0]);
		var video = document.querySelector('video');
		$('video').css('display', 'none');
	}
};


// Audio Button--------------------------------------
const muteUnmute = () => {
  	const enabled = myVideoStream.getAudioTracks()[0].enabled;
  	if (enabled) {
    	myVideoStream.getAudioTracks()[0].enabled = false;
    	setUnmuteButton();
  	} 
  	else {
    	setMuteButton();
    	myVideoStream.getAudioTracks()[0].enabled = true;
  	}
};

const setUnmuteButton = () => {
  	const html = `<i class="unmute fa fa-microphone-slash"></i>
  	<span class="unmute">Unmute</span>`;
  	document.getElementById("muteButton").innerHTML = html;
};

const setMuteButton = () => {
  	const html = `<i class="fa fa-microphone"></i>
  	<span>Mute</span>`;
  	document.getElementById("muteButton").innerHTML = html;
};



// Video Button------------------------------------
const playStop = () => {
  	let enabled = myVideoStream.getVideoTracks()[0].enabled;
  	if (enabled) {
    	myVideoStream.getVideoTracks()[0].enabled = false;
    	setPlayVideo();
  	} 
  	else {
    	setStopVideo();
    	myVideoStream.getVideoTracks()[0].enabled = true;
  	}
};

const setPlayVideo = () => {
  	const html = `<i class="unmute fas fa-video-slash"></i>
  	<span class="unmute">Play Video</span>`;
  	document.getElementById("playPauseVideo").innerHTML = html;
};

const setStopVideo = () => {
  	const html = `<i class=" fa fa-video-camera"></i>
  	<span class="">Pause Video</span>`;
  	document.getElementById("playPauseVideo").innerHTML = html;
};



// Share Screen Button------------------------------
const shareButton = document.getElementById('ShareScreenBtn');

function handleSuccess(stream) {
  	shareButton.disabled = true;
  	const video = document.querySelector('video');
  	video.srcObject = stream;

  	stream.getVideoTracks()[0].addEventListener('ended', () => {
    	errorMsg('The user has ended sharing the screen');
    	shareButton.disabled = false;
    	setPlayVideo();
    	myVideoStream.getVideoTracks()[0].enabled = false;
  	});
}

const shareScreen = () => {
  	navigator.mediaDevices.getDisplayMedia({video: true})
      	.then(handleSuccess, handleError);
};

if ((navigator.mediaDevices && 'getDisplayMedia' in navigator.mediaDevices)) {
  	shareButton.disabled = false;
} 
else {
  	errorMsg('getDisplayMedia is not supported');
}

function handleError(error) {
  	errorMsg(`getDisplayMedia error: ${error.name}`, error);
}

function errorMsg(msg, error) {
  	const errorElement = document.querySelector('#errorMsg');
  	errorElement.innerHTML += `<p>${msg}</p>`;
  	if (typeof error !== 'undefined') {
    	console.error(error);
  	}
}


// Chat Button-------------------------------------
const openCloseChat = () => {
  	const enabled = document.getElementById("chatBox").style.display;
  	if (enabled == "none" || enabled == "") {
    	document.getElementById("chatBox").style.display = "flex";
    	disableChat();
  	} 
  	else {
    	document.getElementById("chatBox").style.display = "none";
    	enableChat();
  	}
};

const disableChat = () => {
  	const html = `<i class="unmute fas fa-comment-slash"></i>
  	<span>Hide Chat</span>`;
  	document.getElementById("chatButton").innerHTML = html;
};

const enableChat = () => {
  	const html = `<i class="fa fa-comment"></i>
  	<span>Chat</span>`;
  	document.getElementById("chatButton").innerHTML = html;
};


// Leave Button---------------------------------------
const leaveMeet = () => {
  	location.href = '/home';
}
