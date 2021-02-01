const fetch = require("node-fetch");
const { formatNumber } = require("../home/datascrap");

module.exports = async (req, res) => {
  try {
    console.info("/covid19/v2/statewise");
    let data = await getStatesData();
    res.status(200).send(data);
  } catch (err) {
    console.error(err);
    res.status(401).send("Something went wrong");
  }
};

const getStatesData = async () => {
  try {
    let data;

    await fetch("https://api.covid19india.org/data.json")
      .then((res) => res.json())
      .then((json) => {
        let index = 0;
        let state = [];
        let $ = json.statewise;
        for (index of $) {
          state.push({
            state: formatNumber(index.state),
            totalCases: formatNumber(index.confirmed),
            totalDeaths: formatNumber(index.deaths),
            newDeaths: formatNumber(`+${index.deltadeaths}`),
            newCases: formatNumber(`+${index.deltaconfirmed}`),
            totalRecovered: formatNumber(index.recovered),
            activeCases: formatNumber(index.active),
            newRecovered: formatNumber(`+${index.deltarecovered}`),
            seriousCritical: "",
          });
        }
        state.sort((a, b) => {
          let keyA = parseInt(a.totalCases.replace(/\,/g, ""), 10);
          let keyB = parseInt(b.totalCases.replace(/\,/g, ""), 10);
          return keyB - keyA;
        });

        state.push(state.shift());
        data = state;
      });

    return data;
  } catch (error) {
    throw new Error(error);
  }
};
