const { Server } = require("socket.io");

export default (req, res) => {
  if (req.method === "OPTIONS") {
    return res.status(200).send("OK");
  }

  // Initialize Socket.io with the server
  const io = new Server(res.socket.server);

  io.on("connection", (socket) => {
    console.log("A user connected");

    // Listen for chat messages
    socket.on("chat message", (msg) => {
      io.emit("chat message", msg); // Broadcast the message to all clients
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  res.socket.server.io = io; // Attach io instance to the server
  res.status(200).send("Socket.io server is running.");
};
