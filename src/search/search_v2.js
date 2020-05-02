const request = require('request');
const cheerio = require("cheerio");
const fetch = require('node-fetch')
const datascrap = require('../home/datascrap')
const _ = require('lodash')

const formatNumber = datascrap.formatNumber
const formatReco = datascrap.formatReco

module.exports.searchdata = function (req, res) {
    let qrycountry = req.query.country
    let qryState = req.query.state
    let qryType = req.query.type
    console.log(qrycountry, qryState, qryType)
    let covid19india = {}
    switch (qryType) {
        case 'IN':
            fetch('https://api.covid19india.org/data.json')
                .then(res => res.json())
                .then(json => {
                    let statewise = json.statewise
                    statewise = _.find(statewise, ['state', `${qrycountry}`])
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
                            seriousCritical: "0"
                        }
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
                            seriousCritical: ''
                        }
                    }

                    res.status(200).json(covid19india)
                })
            break;
        case 'ST':
            fetch('https://api.covid19india.org/state_district_wise.json')
                .then(res => res.json())
                .then(json => {
                    try {
                        let districtwise = json[`${qryState}`]["districtData"][`${qrycountry}`]
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
                                seriousCritical: "0"
                            }
                        } else {
                            covid19india = {
                                country: qrycountry,
                                totalCases: formatNumber(districtwise.confirmed),
                                newCases: formatNumber(`+${districtwise.delta.confirmed}`),
                                totalDeaths: formatNumber(districtwise.deceased),
                                newDeaths: formatNumber(`+${districtwise.delta.deceased}`),
                                totalRecovered: formatNumber(districtwise.recovered),
                                activeCases: formatNumber(districtwise.active),
                                newRecovered: formatNumber(`+${districtwise.delta.recovered}`),
                                seriousCritical: ''
                            }
                        }
                        res.status(200).json(covid19india)
                    }
                    catch (e) {
                        covid19india = {
                            country: qrycountry,
                            totalCases: "0",
                            newCases: "0",
                            totalDeaths: "0",
                            newDeaths: "0",
                            totalRecovered: "0",
                            activeCases: "0",
                            newRecovered: "0",
                            seriousCritical: "0"
                        }
                        res.status(200).json(covid19india)
                    }
                })
            break;
        case 'WD':
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
                                    country['newRecovered'] = formatReco(country['country'], country['totalRecovered'])
                                    country['seriousCritical'] = $(element).find('td:nth-child(8)').text().trim();
                                    return true
                                }
                            });
                            if (country.length == 0) {
                                res.status(404).json(`No data available for ${qrycountry}`)
                            } else {
                                res.json(country);
                            }
                        })
                    }
                })
            break;
        default:
            res.status(200).json('COVID-19 API')
    }

}