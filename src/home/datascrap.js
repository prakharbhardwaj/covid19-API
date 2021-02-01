const request = require("request-promise");
const cheerio = require("cheerio");
const fetch = require("node-fetch");

const scrapdata = async (req, res) => {
  try {
    console.info("/covid19");
    const data = await getWorldData();
    res.status(200).send(data);
  } catch (error) {
    console.error(error);
    res.status(401).send("Something went wrong");
  }
};

const getIndiaData = async () => {
  let data;
  try {
    await fetch("https://api.covid19india.org/data.json")
      .then((res) => res.json())
      .then((json) => {
        let statewise = json.statewise[0];

        data = {
          country: "India",
          totalCases: formatNumber(statewise.confirmed),
          newCases: formatNumber(`+${statewise.deltaconfirmed}`),
          totalDeaths: formatNumber(statewise.deaths),
          newDeaths: formatNumber(`+${statewise.deltadeaths}`),
          totalRecovered: formatNumber(statewise.recovered),
          activeCases: formatNumber(statewise.active),
          newRecovered: formatNumber(`+${statewise.deltarecovered}`),
          seriousCritical: "",
        };
      });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

const getWorldData = async () => {
  try {
    let data;
    let indiaData = await getIndiaData();

    await request({ uri: "https://www.worldometers.info/coronavirus/" })
      .then((response) => {
        return cheerio.load(response);
      })
      .then(($) => {
        let country = [];
        $('div[id="nav-today"]')
          .find("tbody>tr")
          .each((index, element) => {
            const cont = $(element).find("td:nth-child(2)").text().trim();
            if (
              cont == "North America" ||
              cont == "Europe" ||
              cont == "South America" ||
              cont == "Oceania" ||
              cont == "Africa" ||
              cont == "Asia" ||
              cont == "" ||
              cont == "Total:"
            ) {
              console.log;
            } else {
              country.push({
                country: $(element).find("td:nth-child(2)").text().trim(),
                totalCases: $(element).find("td:nth-child(3)").text().trim(),
                newCases: $(element).find("td:nth-child(4)").text().trim(),
                totalDeaths: $(element).find("td:nth-child(5)").text().trim(),
                newDeaths: $(element).find("td:nth-child(6)").text().trim(),
                totalRecovered: $(element)
                  .find("td:nth-child(7)")
                  .text()
                  .trim(),
                newRecovered: $(element).find("td:nth-child(8)").text().trim(),
                activeCases: $(element).find("td:nth-child(9)").text().trim(),
                seriousCritical: $(element)
                  .find("td:nth-child(10)")
                  .text()
                  .trim(),
              });
            }
          });
        country = fltr(country);

        let indiaIndex = country.findIndex((p) => p.country == "India");
        country[indiaIndex] = indiaData;

        country.sort((a, b) => {
          let keyA = parseInt(a.totalCases.replace(/\,/g, ""), 10);
          let keyB = parseInt(b.totalCases.replace(/\,/g, ""), 10);
          return keyB - keyA;
        });

        country.shift();
        data = country;
      });

    return data;
  } catch (error) {
    throw new Error(error);
  }
};

//1234 -> 1,234
const formatNumber = (num) => {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

const fltr = (arr) => {
  arr = arr.filter(isEligible);
  return arr;
};

const isEligible = (value) => {
  if (value !== false || value !== null || value !== 0 || value !== "") {
    return value;
  }
};

module.exports = {
  getWorldData,
  getIndiaData,
  scrapdata,
  formatNumber,
  fltr,
};
