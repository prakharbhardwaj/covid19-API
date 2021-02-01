const request = require("request");
const { getWorldData } = require("../home/datascrap");

module.exports.sortdata = async (req, res) => {
  try {
    let sortType = await req.query.sortby;
    let data = await getWorldData();
    console.info(`/covid19/sort/${sortType}`);

    switch (sortType) {
      case "cases":
        res.json(data);
        break;
      case "deaths":
        data.sort((a, b) => {
          let keyA = parseInt(a.totalDeaths.replace(/\,/g, ""), 10) || 0;
          let keyB = parseInt(b.totalDeaths.replace(/\,/g, ""), 10) || 0;
          return keyB - keyA;
        });
        data.push(data.shift());
        res.json(data);
        break;
      case "recovers":
        data.sort((a, b) => {
          let keyA = parseInt(a.totalRecovered.replace(/\,/g, ""), 10 || 0);
          let keyB = parseInt(b.totalRecovered.replace(/\,/g, ""), 10) || 0;
          return keyB - keyA;
        });
        data.push(data.shift());
        res.json(data);
        break;
      case "newcases":
        data.sort((a, b) => {
          let keyA = parseInt(a.newCases.replace(/\,/g, ""), 10) || 0;
          let keyB = parseInt(b.newCases.replace(/\,/g, ""), 10) || 0;
          return keyB - keyA;
        });
        data.push(data.shift());
        res.json(data);
        break;
      default:
        res.status(200).send({
          message: "Prakhar Bhardwaj",
        });
    }
  } catch (error) {
    console.error(error);
    res.status(401).send("Something went wrong");
  }
};
