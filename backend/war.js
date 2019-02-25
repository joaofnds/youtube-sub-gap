const { fetchSubs } = require("./youtube");

async function warStats() {
  const pewds = await fetchSubs("pewdiepie");
  const tgay = await fetchSubs("tseries");
  const gap = pewds - tgay; // not getting abs value because tgay will never win
  return { pewds, tgay, gap };
}

module.exports = { warStats };
