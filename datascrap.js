const request = require('request');
const cheerio = require("cheerio");
const fetch = require('node-fetch')

module.exports.scrapdata = function (req, res) {
    fetch('https://api.covid19india.org/data.json')
        .then(res => res.json())
        .then(json => {
            let statewise = json.statewise[0]
            let keyValue = json.key_values[0]

            covid19india = {
                country: 'India',
                totalCases: formatNumber(statewise.confirmed),
                newCases: formatNumber(`+${keyValue.confirmeddelta}`),
                totalDeaths: formatNumber(statewise.deaths),
                newDeaths: formatNumber(`+${keyValue.deceaseddelta}`),
                totalRecovered: formatNumber(statewise.recovered),
                activeCases: formatNumber(statewise.active),
                seriousCritical: ''
            }

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
                let index = country.findIndex(p => p.country == "Total:")
                index += 1
                country = country.slice(0, index)

                let indiaIndex = country.findIndex(p => p.country == "India")
                country[indiaIndex] = covid19india

                country.sort((a, b) => {
                    var keyA = a.totalCases.replace(/\,/g, '')
                    var keyB = b.totalCases.replace(/\,/g, '')
                    keyA = parseInt(keyA, 10)
                    keyB = parseInt(keyB, 10)
                    if (keyA > keyB) return -1;
                    if (keyA < keyB) return 1;
                    return 0;
                })
                country.push(country.shift())
                res.json(country);
            })
        })
}

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

module.exports.formatNumber = formatNumber