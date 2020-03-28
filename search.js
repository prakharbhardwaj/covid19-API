const request = require('request');
const cheerio = require("cheerio");

module.exports.searchdata = function (req, res) {
    const qrycountry = req.query.country

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
        if (index == -1) {
            res.json(`No data available for ${qrycountry}`)
        }
        country = country[index]
        res.json(country);
    })
}