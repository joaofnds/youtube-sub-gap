const express = require("express");
const server = express();
const bodyParser = require("body-parser");
const http = require("http").Server(server);
const path = require("path");
const io = require("socket.io")(http);

const { fetchSubs } = require("./youtube");
const { warStats } = require("./war");

const SUB_GAP_CHANGE = "sub-gap-change";

let lastStats = null;

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

// serve frontend static files
server.use("/", express.static(path.join(__dirname, "../frontend")));

// fetch sub count for youtube username
server.get("/sub-count/:username", async ({ params: { username } }, res) => {
  try {
    const subs = await fetchSubs(username);
    res.send(subs);
  } catch (err) {
    res.sendStatus(500);
  }
});

const UPDATE_INTERVAL = process.env.UPDATE_INTERVAL || 5000;
setInterval(async () => {
  lastStats = await warStats();
  io.emit(SUB_GAP_CHANGE, lastStats);
}, UPDATE_INTERVAL);

io.on("connection", socket => socket.emit(SUB_GAP_CHANGE, lastStats));

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`listening on port ${PORT}`));
