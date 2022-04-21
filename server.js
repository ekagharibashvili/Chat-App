const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const mongoose = require("mongoose");
const { Message } = require("./models/message");

app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.promise = Promise;

const dbUrl =
  "mongodb+srv://eka:chat123@chat.c7img.mongodb.net/chatt?retryWrites=true&w=majority";

app.get("/messages", (req, res) => {
  Message.find({}, (err, messages) => {
    res.send(messages);
  });
});

app.post("/messages", async (req, res) => {
  const message = new Message(req.body);
  const savedMessage = await message.save();

  console.log("saved");
  const censored = await Message.findOne({ message: "badword" });
  if (censored) await Message.remove({ __id: censored.id });
  else io.emit("message", req.body);
  res.sendStatus(200);
  /* .catch((err) => {
      res.sendStatus(500);
      console.error(err);
    }); */
});

io.on("connection", (socket) => {
  console.log("a user connected");
});

mongoose.connect(dbUrl, (err) => {
  console.log("mongo db connection", err);
});

const server = http.listen(3000, () => {
  console.log("server is listening on port", server.address().port);
});
