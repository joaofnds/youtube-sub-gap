const express = require("express");
const server = express();
const bodyParser = require("body-parser");
const http = require("http").Server(server);
const path = require("path");
const io = require("socket.io")(http);

const { fetchSubs } = require("./youtube");
const { emitStats, emitStatsEvery } = require("./war");

server.use(bodyParser.urlencoded({ extended: true }));

// serve frontend static files
server.use("/", express.static(path.join(__dirname, "../frontend")));

// fetch sub count for youtube `:username`
server.get("/sub-count/:username", async ({ params: { username } }, res) => {
  try {
    const subs = await fetchSubs(username);
    res.send(subs);
  } catch (err) {
    res.sendStatus(500);
  }
});

server.all("*", (_, res) => res.sendStatus(404));

// update war stats every UPDATE_INTERVAL milliseconds
const UPDATE_INTERVAL = process.env.UPDATE_INTERVAL || 5000;
emitStatsEvery(io, UPDATE_INTERVAL);

// emit war stats when server boot up
updateStats();

// send lastStats for each new connection
io.on("connection", emitStats);

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`listening on port ${PORT}`));
