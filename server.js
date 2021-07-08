const express = require("express");
const path = require('path');
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
const io = require("socket.io")(server);
const formatMessage = require('./utils/messages');
const {
 	userJoin,
 	getCurrentUser,
  	userLeave,
  	getRoomUsers
} = require('./utils/users');


const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  	debug: true,
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/peerjs", peerServer);



app.get("/", (req, res) => {
  	res.render('login')
})

app.get("/home", (req, res) => {
  	res.render('home')
})

app.get("/chatpage", (req, res) => {
  	res.render('chatpage')
})

app.get("/chat", (req, res) => {
  	res.render('chat')
})
 
app.get("/videochat", (req, rsp) => {
  	rsp.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  	res.render("room", { roomId: req.params.room });
});


const botName = 'Mitron Bot ';

io.on("connection", (socket) => {

  	// For VideoChat Application----------------------------------
 	socket.on("join-room", (roomId, userId) => {
    	socket.join(roomId);
    	socket.to(roomId).broadcast.emit("user-connected", userId);

    	socket.on("message", (message) => {
      		io.to(roomId).emit("createMessage", message);
    	});

    	socket.on('disconnect', () => {
      		socket.leave(roomId);
      		socket.to(roomId).broadcast.emit('user-disconnected', userId);
    	})
  	});



  	// For ChatBot Application------------------------------------
  	socket.on('joinRoom', ({ username, room }) => {
    	const user = userJoin(socket.id, username, room);
    	socket.join(user.room);
    	socket.emit('message', formatMessage(botName, ' Welcome to ChatCord!'));
    	socket.broadcast
    		.to(user.room)
      		.emit(
        	'message',
        	formatMessage(botName, ` ${user.username} has joined the chat`)
      		);

    	io.to(user.room).emit('roomUsers', {
      		room: user.room,
      		users: getRoomUsers(user.room)
    	});
  	});

  	socket.on('chatMessage', msg => {
    	const user = getCurrentUser(socket.id);
    	io.to(user.room).emit('message', formatMessage(user.username, msg));
  	});

  	socket.on('disconnect', () => {
    	const user = userLeave(socket.id);
    	if (user) {
    		io.to(user.room).emit(
        		'message',
        		formatMessage(botName, ` ${user.username} has left the chat`)
      		);

	      	io.to(user.room).emit('roomUsers', {
	        	room: user.room,
	        	users: getRoomUsers(user.room)
	      	});
    	}
  	});
  	

});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));