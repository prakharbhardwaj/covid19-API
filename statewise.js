const request = require('request');
const cheerio = require("cheerio");

module.exports.statewise = function statewise(req, res) {

    request("https://www.covid19india.org/", function (error, response, body) {
        if (error) {
            res.status(404).send({
                status: false,
                message: 'Something went wrong'
            });
        }
        var country = [];
        var $ = cheerio.load(body);
        console.log($())
        $('tbody>tr').each(function (index, element) {
            country[index] = {};
            country[index]['state'] = $(element).find('td:nth-child(1)').text().trim();
            country[index]['confirmed'] = $(element).find('td:nth-child(2)').text().trim();
            country[index]['active'] = $(element).find('td:nth-child(3)').text().trim();
            country[index]['recovered'] = $(element).find('td:nth-child(4)').text().trim();
            country[index]['deceased'] = $(element).find('td:nth-child(5)').text().trim();
        });
        // let index = country.findIndex(p => p.country == "Total:")
        // index += 1
        // country = country.slice(0, index)

        // country.sort((a, b) => {
        //     var keyA = a.totalCases.replace(/\,/g, '')
        //     var keyB = b.totalCases.replace(/\,/g, '')
        //     keyA = parseInt(keyA, 10)
        //     keyB = parseInt(keyB, 10)
        //     if (keyA > keyB) return -1;
        //     if (keyA < keyB) return 1;
        //     return 0;
        // })
        // country.push(country.shift())
        res.json(country)
    })
}