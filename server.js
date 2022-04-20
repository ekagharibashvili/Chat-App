const express = require("express");
const app = express();

app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const messages = [
  { name: "Tim", message: "Hi" },
  { name: "Jane", message: "Hello" },
];

app.get("/messages", (req, res) => {
  res.send(messages);
});

app.post("/messages", (req, res) => {
    messages.push(req.body);  
    return res.sendStatus(200);
});

const server = app.listen(3000, () => {
  console.log("server is listening on port", server.address().port);
});
