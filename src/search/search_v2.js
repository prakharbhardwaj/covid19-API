const request = require("request");
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const { getIndiaData, formatNumber } = require("../home/datascrap");
const _ = require("lodash");

// const formatReco = datascrap.formatReco

module.exports = async (req, res) => {
  try {
    console.info("/covid19/v2/search");
    let qrycountry = await req.query.country;
    let qryState = await req.query.state;
    let qryType = await req.query.type;
    let covid19india = {};

    switch (qryType) {
      case "IN":
        fetch("https://api.covid19india.org/data.json")
          .then((res) => res.json())
          .then((json) => {
            let statewise = json.statewise;
            statewise = _.find(statewise, ["state", `${qrycountry}`]);
            if (statewise == undefined) {
              covid19india = {
                country: qrycountry,
                totalCases: "0",
                newCases: "0",
                totalDeaths: "0",
                newDeaths: "0",
                totalRecovered: "0",
                activeCases: "0",
                newRecovered: "0",
                seriousCritical: "0",
              };
            } else {
              covid19india = {
                country: qrycountry,
                totalCases: formatNumber(statewise.confirmed),
                newCases: formatNumber(`+${statewise.deltaconfirmed}`),
                totalDeaths: formatNumber(statewise.deaths),
                newDeaths: formatNumber(`+${statewise.deltadeaths}`),
                totalRecovered: formatNumber(statewise.recovered),
                activeCases: formatNumber(statewise.active),
                newRecovered: formatNumber(`+${statewise.deltarecovered}`),
                seriousCritical: "",
              };
            }

            res.status(200).json(covid19india);
          });
        break;
      case "ST":
        fetch("https://api.covid19india.org/state_district_wise.json")
          .then((res) => res.json())
          .then((json) => {
            try {
              let districtwise =
                json[`${qryState}`]["districtData"][`${qrycountry}`];
              if (districtwise == undefined) {
                covid19india = {
                  country: qrycountry,
                  totalCases: "0",
                  newCases: "0",
                  totalDeaths: "0",
                  newDeaths: "0",
                  totalRecovered: "0",
                  activeCases: "0",
                  newRecovered: "0",
                  seriousCritical: "0",
                };
              } else {
                covid19india = {
                  country: qrycountry,
                  totalCases: formatNumber(districtwise.confirmed),
                  newCases: formatNumber(`+${districtwise.delta.confirmed}`),
                  totalDeaths: formatNumber(districtwise.deceased),
                  newDeaths: formatNumber(`+${districtwise.delta.deceased}`),
                  totalRecovered: formatNumber(districtwise.recovered),
                  activeCases: formatNumber(districtwise.active),
                  newRecovered: formatNumber(
                    `+${districtwise.delta.recovered}`
                  ),
                  seriousCritical: "",
                };
              }
              res.status(200).json(covid19india);
            } catch (e) {
              covid19india = {
                country: qrycountry,
                totalCases: "0",
                newCases: "0",
                totalDeaths: "0",
                newDeaths: "0",
                totalRecovered: "0",
                activeCases: "0",
                newRecovered: "0",
                seriousCritical: "0",
              };
              res.status(200).json(covid19india);
            }
          });
        break;
      case "WD":
        if (qrycountry == "India") {
          const data = await getIndiaData();
          res.status(200).json(data);
        } else {
          request(
            "https://www.worldometers.info/coronavirus/",
            (error, response, body) => {
              if (error) {
                res.status(404).send({
                  status: false,
                  message: "Something went wrong",
                });
              }
              let country;
              let $ = cheerio.load(body);
              $('div[id="nav-today"]')
                .find("tbody>tr")
                .each((index, element) => {
                  const cont = $(element).find("td:nth-child(2)").text().trim();
                  if (cont == qrycountry) {
                    country = {
                      country: $(element).find("td:nth-child(2)").text().trim(),
                      totalCases: $(element)
                        .find("td:nth-child(3)")
                        .text()
                        .trim(),
                      newCases: $(element)
                        .find("td:nth-child(4)")
                        .text()
                        .trim(),
                      totalDeaths: $(element)
                        .find("td:nth-child(5)")
                        .text()
                        .trim(),
                      newDeaths: $(element)
                        .find("td:nth-child(6)")
                        .text()
                        .trim(),
                      totalRecovered: $(element)
                        .find("td:nth-child(7)")
                        .text()
                        .trim(),
                      newRecovered: $(element)
                        .find("td:nth-child(8)")
                        .text()
                        .trim(),
                      activeCases: $(element)
                        .find("td:nth-child(9)")
                        .text()
                        .trim(),
                      seriousCritical: $(element)
                        .find("td:nth-child(10)")
                        .text()
                        .trim(),
                    };
                    return true;
                  }
                });

              if (!country) {
                res.status(404).json(`No data available for ${qrycountry}`);
              } else {
                res.json(country);
              }
            }
          );
        }
        break;
      default:
        res.status(200).json("COVID-19 API");
    }
  } catch (error) {
    console.error(error);
    res.status(401).send("Something went wrong");
  }
};
