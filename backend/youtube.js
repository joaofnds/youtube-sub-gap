require("dotenv").config();

const fetch = require("node-fetch");

const YOUTUBE_KEY = process.env.YOUTUBE_KEY;
const CHANNELS_URL = "https://www.googleapis.com/youtube/v3/channels";

const buildQuery = username => {
  let query = "";
  query += `?part=statistics`;
  query += `&forUsername=${username}`;
  query += `&key=${YOUTUBE_KEY}`;
  return query;
};

const buildURL = username => `${CHANNELS_URL}${buildQuery(username)}`;

const fetchSubs = async username => {
  const url = buildURL(username);
  const response = await fetch(url);
  const body = await response.json();
  return extractSubCount(body);
};

const extractSubCount = responseBody =>
  responseBody.items[0].statistics.subscriberCount;

module.exports = { fetchSubs };
