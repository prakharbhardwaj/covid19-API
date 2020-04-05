const request = require('request');
const cheerio = require("cheerio");
const fetch = require('node-fetch')
const datascrap = require('./datascrap')

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
                    $('tbody>tr').each(function (index, element) {
                        country[index] = {};
                        country[index]['country'] = $(element).find('td:nth-child(1)').text().trim();
                        country[index]['totalCases'] = $(element).find('td:nth-child(2)').text().trim();
                        country[index]['newCases'] = $(element).find('td:nth-child(3)').text().trim();
                        country[index]['totalDeaths'] = $(element).find('td:nth-child(4)').text().trim();
                        country[index]['newDeaths'] = $(element).find('td:nth-child(5)').text().trim();
                        country[index]['totalRecovered'] = $(element).find('td:nth-child(6)').text().trim();
                        country[index]['activeCases'] = $(element).find('td:nth-child(7)').text().trim();
                        country[index]['seriousCritical'] = $(element).find('td:nth-child(8)').text().trim();
                    });
                    let index = country.findIndex(p => p.country == qrycountry)
                    console.log(index)
                    if (index == -1) {
                        res.status(404).json(`No data available for ${qrycountry}`)
                    }
                    country = country[index]
                    res.json(country);
                })
            }
        })
}