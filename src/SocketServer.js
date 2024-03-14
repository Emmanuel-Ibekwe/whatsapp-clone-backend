let onlineUsers = [];
export default function(socket, io) {
  // user joins or opens the application
  socket.on("join", user => {
    console.log("user has joined: ", user);
    socket.join(user);
    // add joined user to online users
    if (!onlineUsers.some(u => u.userId === user)) {
      console.log(`user: ${user} is now online`);
      onlineUsers.push({ userId: user, socketId: socket.id });
    }

    // send online users to frontend
    io.emit("get-online-users", onlineUsers);
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
    console.log(`user has just disconnected`);
    io.emit("get-online-users", onlineUsers);
  });

  // join a conversation
  socket.on("join conversation", conversation => {
    socket.join(conversation);
    console.log("user has joined conversation", conversation);
  });

  //   send and receive message
  socket.on("send message", message => {
    console.log("new message received ", message);
    console.log("message.conversation: ", message.conversation);

    let conversation = message.conversation;
    console.log("conversation ", conversation);
    if (!conversation?.users) return;
    conversation.users.forEach(user => {
      if (user._id === message.sender._id) return;
      console.log("Heading to emit message");
      socket.in(user._id).emit("receive message", message);
    });
  });
}
