const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const mongoose = require("mongoose");
const { Message } = require("./models/message");

app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const dbUrl =
  "mongodb+srv://ekagari:chatapp123@cluster0.ehrkk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

app.get("/messages", (req, res) => {
  Message.find({}, (err, messages) => {
    res.send(messages);
  });
});

app.post("/messages", (req, res) => {
  const message = new Message(req.body);
  message.save((err) => {
    if (err) sendStatus(500);
    Message.findOne({ message: "badword" }, (err, censored) => {
      if (censored) {
        console.log("censored words found", censored);
        Message.remove({ __id: censored.id }, (err) => {
          console.log("removed censored message");
        });
      }
    });
    io.emit("message", req.body);
    return res.sendStatus(200);
  });
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
