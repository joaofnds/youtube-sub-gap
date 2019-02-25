const server = require("express")();
const bodyParser = require("body-parser");
const { fetchSubs } = require("./youtube");

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.get("/", (_, res) => res.json(200));

server.get("/sub-count/:username", async ({ params: { username } }, res) => {
  try {
    const subs = await fetchSubs(username);
    res.send(subs);
  } catch (err) {
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`listening on port ${PORT}`));
