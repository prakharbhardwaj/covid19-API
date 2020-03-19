const express = require('express')
const app = express()
const request = require('request');
const cheerio = require("cheerio");

app.get('/covid19', (req, res) =>

    request("https://www.worldometers.info/coronavirus/", function (error, response, body) {
        if (error) {
            res.send(response.statusCode);
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
        res.json(country);
    })
)

app.listen(1212, () => console.log(`App running on http://localhost:1212`))