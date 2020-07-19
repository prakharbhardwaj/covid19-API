const request = require('request');
const cheerio = require("cheerio");
const datascrap = require('../home/datascrap')

const fltr = datascrap.fltr

module.exports = (req, res) => {

    request("https://www.worldometers.info/coronavirus/", function (error, response, body) {
        if (error) {
            res.status(404).send({
                status: false,
                message: 'Something went wrong'
            });
        }
        var country = [];
        var $ = cheerio.load(body);
        $('div[id="nav-yesterday"]').find('tbody>tr').each(function (index, element) {
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
                country[index]['newRecovered'] = $(element).find('td:nth-child(8)').text().trim();
                country[index]['activeCases'] = $(element).find('td:nth-child(9)').text().trim();
                country[index]['seriousCritical'] = $(element).find('td:nth-child(10)').text().trim();
            }
        });
        country = fltr(country)

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
}
