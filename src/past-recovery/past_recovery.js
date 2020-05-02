const request = require('request');
const cheerio = require("cheerio");
const fs = require('fs')

module.exports.scrapdata = function (req, res, next) {
    try {
        request("https://www.worldometers.info/coronavirus/", function (error, response, body) {
            if (error) {
                res.status(404).send({
                    status: false,
                    message: 'Something went wrong'
                });
            }
            var past_recovery = new Object();

            var $ = cheerio.load(body);
            $('div[id="nav-yesterday"]').find('tbody>tr').each(function (index, element) {
                const cont = $(element).find('td:nth-child(1)').text().trim()
                if (cont == 'North America' || cont == 'Europe' || cont == 'South America' || cont == 'Oceania' || cont == 'Africa' || cont == 'Asia' || cont == '' || cont == "Total:") {
                    console.log('Not included')
                } else {
                    let contry_name = $(element).find('td:nth-child(1)').text().trim();
                    let recovery = $(element).find('td:nth-child(6)').text().trim();
                    past_recovery[contry_name] = {
                        "recovery": recovery
                    }
                }
            });

            fs.writeFile('src/past-recovery/past_recovery.json', JSON.stringify(past_recovery), function (err) {
                if (err) throw err;
                console.log('Saved!');
            });

            res.status(200).send("Saved Data")
        })
    }
    catch (e) {
        res.status(403).send("Something went wrong")
    }
}
