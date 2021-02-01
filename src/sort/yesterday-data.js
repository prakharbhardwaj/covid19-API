const request = require("request");
const cheerio = require("cheerio");
const datascrap = require("../home/datascrap");

const fltr = datascrap.fltr;

module.exports = (req, res) => {
  try {
    console.info("/covid19/pastData");

    request(
      "https://www.worldometers.info/coronavirus/",
      (error, response, body) => {
        if (error) {
          res.status(404).send({
            status: false,
            message: "Something went wrong",
          });
        }
        let country = [];
        let $ = cheerio.load(body);
        $('div[id="nav-yesterday"]')
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

        country.sort((a, b) => {
          let keyA = parseInt(a.totalCases.replace(/\,/g, ""), 10);
          let keyB = parseInt(b.totalCases.replace(/\,/g, ""), 10);
          return keyB - keyA;
        });
        country.shift();
        res.status(200).send(country);
      }
    );
  } catch (error) {
    console.error(error);
    res.status(401).send("Something went wrong");
  }
};
