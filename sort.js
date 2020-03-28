const request = require('request');
const cheerio = require("cheerio");

module.exports.sortdata = function (req, res) {
    const sortType = req.query.sortby

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

        switch (sortType) {
            case 'cases':
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
                break;
            case 'deaths':
                country.sort((a, b) => {
                    var keyA = a.totalDeaths.replace(/\,/g, '')
                    var keyB = b.totalDeaths.replace(/\,/g, '')
                    keyA = parseInt(keyA, 10) || 0
                    keyB = parseInt(keyB, 10) || 0
                    if (keyA > keyB) return -1;
                    if (keyA < keyB) return 1;
                    return 0;
                })
                country.push(country.shift())
                res.json(country);
                break;
            case 'recovers':
                country.sort((a, b) => {
                    var keyA = a.totalRecovered.replace(/\,/g, '')
                    var keyB = b.totalRecovered.replace(/\,/g, '')
                    keyA = parseInt(keyA, 10) || 0
                    keyB = parseInt(keyB, 10) || 0
                    if (keyA > keyB) return -1;
                    if (keyA < keyB) return 1;
                    return 0;
                })
                country.push(country.shift())
                res.json(country);
                break;
            case 'newcases':
                country.sort((a, b) => {
                    var keyA = a.newCases.replace(/\,/g, '')
                    var keyB = b.newCases.replace(/\,/g, '')
                    keyA = parseInt(keyA, 10) || 0
                    keyB = parseInt(keyB, 10) || 0
                    if (keyA > keyB) return -1;
                    if (keyA < keyB) return 1;
                    return 0;
                })
                country.push(country.shift())
                res.json(country);
                break;
            default:
                res.status(200).send({
                    message: "Prakhar Bhardwaj"
                })
        }
    })
}