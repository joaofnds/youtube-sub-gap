const { fetchSubs } = require("./youtube");
const { SUB_GAP_CHANGE } = require("./websocket-events");

let lastStats = null;

async function fetchStats() {
  const [pewds, tgay] = await Promise.all([
    fetchSubs("pewdiepie"),
    fetchSubs("tseries")
  ]);
  const gap = pewds - tgay; // not getting abs value because tgay will never win
  return { pewds, tgay, gap };
}

updateAndEmitStats = async socket => {
  await updateStats();
  emitStats(socket);
};

updateStats = async () => (lastStats = await fetchStats());

emitStats = socket => socket.emit(SUB_GAP_CHANGE, lastStats);

emitStatsEvery = (socket, interval) =>
  setInterval(async () => await updateAndEmitStats(socket), interval);

module.exports = {
  fetchStats,
  emitStats,
  emitStatsEvery,
  lastStats
};
