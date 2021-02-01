const fetch = require("node-fetch");
const { formatDistance } = require("date-fns");

module.exports = (req, res) => {
  var index = 0;
  let latestNews = [];
  try {
    console.info("/covid19/news");
    fetch("https://api.covid19india.org/updatelog/log.json")
      .then((res) => res.json())
      .then((json) => {
        let $ = json.reverse();
        for (index of $) {
          latestNews.push({
            update: index.update,
            time:
              formatDistance(new Date(index.timestamp * 1000), new Date()) +
              " ago",
          });
        }
        res.status(200).send(latestNews);
      });
  } catch (err) {
    console.error(err);
    res.status(401).send(err);
  }
};
