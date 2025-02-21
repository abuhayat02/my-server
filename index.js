
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const PORT = process.env.PORT || 5100;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

// Socket.io Events
// Handle socket connection
io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Send "Hello" to the client after connection
    socket.emit("message", "Hello from server!");

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});
// io.on("connection", (socket) => {
//     console.log("New client connected:", socket.id);

//     socket.on("message", (data) => {
//         console.log(`Received: ${data}`);
//         io.emit("message", `Echo: ${data}`); // সকল ক্লায়েন্টে পাঠানো
//     });

//     socket.on("disconnect", () => {
//         console.log("Client disconnected:", socket.id);
//     });
// });

app.get("/", (req, res) => {
    res.send("Socket.io Server is running...");
});

app.get('/me', (req, res) => {
    res.json({ message: "Hello, this is my new route!" });
});

// নতুন route
app.get('/new-route', (req, res) => {
    res.json({ message: "This is a new route response!" });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
