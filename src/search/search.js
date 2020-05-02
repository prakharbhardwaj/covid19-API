const request = require('request');
const cheerio = require("cheerio");
const fetch = require('node-fetch')
const datascrap = require('../home/datascrap')

const formatNumber = datascrap.formatNumber

module.exports.searchdata = function (req, res) {
    let qrycountry = req.query.country

    fetch('https://api.covid19india.org/data.json')
        .then(res => res.json())
        .then(json => {
            let statewise = json.statewise[0]

            covid19india = {
                country: 'India',
                totalCases: formatNumber(statewise.confirmed),
                newCases: formatNumber(`+${statewise.deltaconfirmed}`),
                totalDeaths: formatNumber(statewise.deaths),
                newDeaths: formatNumber(`+${statewise.deltadeaths}`),
                totalRecovered: formatNumber(statewise.recovered),
                activeCases: formatNumber(statewise.active),
                seriousCritical: ''
            }
            if (qrycountry == "India") {
                res.status(200).json(covid19india)
            } else {
                request("https://www.worldometers.info/coronavirus/", function (error, response, body) {
                    if (error) {
                        res.status(404).send({
                            status: false,
                            message: 'Something went wrong'
                        });
                    }
                    var country = [];
                    var $ = cheerio.load(body);
                    $('div[id="nav-today"]').find('tbody>tr').each(function (index, element) {
                        const cont = $(element).find('td:nth-child(1)').text().trim()
                        if (cont == qrycountry) {
                            country = {};
                            country['country'] = $(element).find('td:nth-child(1)').text().trim();
                            country['totalCases'] = $(element).find('td:nth-child(2)').text().trim();
                            country['newCases'] = $(element).find('td:nth-child(3)').text().trim();
                            country['totalDeaths'] = $(element).find('td:nth-child(4)').text().trim();
                            country['newDeaths'] = $(element).find('td:nth-child(5)').text().trim();
                            country['totalRecovered'] = $(element).find('td:nth-child(6)').text().trim();
                            country['activeCases'] = $(element).find('td:nth-child(7)').text().trim();
                            country['seriousCritical'] = $(element).find('td:nth-child(8)').text().trim();
                            return true
                        }
                    });
                    if (country.length == 0) {
                        res.status(404).json(`No data available for ${qrycountry}`)
                    }
                    res.json(country);
                })
            }
        })
}