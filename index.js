
const express = require("express");
const cors = require('cors');

const http = require("http");
const dotenv = require('dotenv')
dotenv.config()
const { Server } = require("socket.io");

const app = express();
const PORT = process.env.PORT || 5100;
app.use(cors());
app.use(express.json())

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});
// pass HN8O6gRT8t09CxJl
// user name  abuhayat5mmm

// Socket.io Events
// Handle socket connection

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.URL;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });



        const todoApp = client.db("todoApp");
        const info = todoApp.collection("addTodo");

        const changeStream = info.watch();

        changeStream.on("change", (change) => {
            if (change.operationType === "insert") {
                // console.log("New todo added:", change.fullDocument);


                io.emit("todoAdded", {
                    message: "A new todo has been added!",
                    data: change.fullDocument
                });
            }
        });

        // info.insertOne({ name: 'hayat', role: 'p' })

        app.post('/add-task', async (req, res) => {
            let information = req.body;  // রিকোয়েস্ট বডি
            // console.log(information);
            try {
                // MongoDB collection এ ডেটা ইনসার্ট
                let result = await info.insertOne(information);
                res.status(200).send({
                    success: true,
                    data: result,  // ইনসার্ট হওয়া ডেটা
                });
            } catch (error) {
                res.status(404).send({
                    success: false,
                    error: error.message,
                });
            }
        });

        app.get('/my-all-task' , async (req , res )=>{
            let result = await info.find({}).toArray() ;
            res.status(200).send({
                success : true ,
                data : result
            })
        })



        io.on("connection", (socket) => {
            console.log("New client connected:", socket.id);

            // Send "Hello" to the client after connection
            socket.emit("message", "Hello from server!");

            socket.on("disconnect", () => {
                console.log("Client disconnected:", socket.id);
            });
        });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Socket.io Server is running...");
});

app.get('/me', (req, res) => {
    res.json({ message: "Hello, this is my new route!" });
});

app.get('/new-route', (req, res) => {
    res.json({ message: "This is a new route response!" });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
