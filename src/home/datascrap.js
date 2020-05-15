const request = require('request');
const cheerio = require("cheerio");
const fetch = require('node-fetch')
const pr = require('../past-recovery/past_recovery.json')

module.exports.scrapdata = function (req, res) {
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
                newRecovered: formatNumber(`+${statewise.deltarecovered}`),
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
                $('div[id="nav-today"]').find('tbody>tr').each(function (index, element) {
                    const cont = $(element).find('td:nth-child(2)').text().trim()
                    if (cont == 'North America' || cont == 'Europe' || cont == 'South America' || cont == 'Oceania' || cont == 'Africa' || cont == 'Asia' || cont == '' || cont == 'Total:') {
                        console.log('Not included')
                    } else {
                        country[index] = {};
                        country[index]['country'] = $(element).find('td:nth-child(2)').text().trim();
                        country[index]['totalCases'] = $(element).find('td:nth-child(3)').text().trim();
                        country[index]['newCases'] = $(element).find('td:nth-child(4)').text().trim();
                        country[index]['totalDeaths'] = $(element).find('td:nth-child(5)').text().trim();
                        country[index]['newDeaths'] = $(element).find('td:nth-child(6)').text().trim();
                        country[index]['totalRecovered'] = $(element).find('td:nth-child(7)').text().trim();
                        country[index]['activeCases'] = $(element).find('td:nth-child(8)').text().trim();
                        country[index]['newRecovered'] = formatReco(country[index]['country'], country[index]['totalRecovered'])
                        country[index]['seriousCritical'] = $(element).find('td:nth-child(9)').text().trim();
                    }
                });
                country = fltr(country)

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
                res.status(200).send(country)
            })
        })
}

//1234 -> 1,234
function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function fltr(arr) {
    arr = arr.filter(isEligible);
    return arr;
}

function isEligible(value) {
    if (value !== false || value !== null || value !== 0 || value !== "") {
        return value;
    }
}

//new recovery data
function formatReco(country, nroc) {
    try {
        let proc = pr[country].recovery
        let val = nroc.replace(/\,/g, '') - proc.replace(/\,/g, '')
        if (isNaN(val) || val == '0') {
            return ''
        } else {
            return `+${formatNumber(val)}`
        }
    }
    catch (e) {
        return ''
    }
}

module.exports.formatNumber = formatNumber
module.exports.fltr = fltr
module.exports.formatReco = formatReco
