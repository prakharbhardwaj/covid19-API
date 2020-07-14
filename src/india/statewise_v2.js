const fetch = require('node-fetch');
const datascrap = require('../home/datascrap')

const formatNumber = datascrap.formatNumber

module.exports.statewise = function statewise(req, res) {
    try {
        fetch('https://api.covid19india.org/data.json')
            .then(res => res.json())
            .then(json => {
                var index = 0
                var state = []
                let $ = json.statewise
                for (index in $) {
                    state[index] = {};
                    state[index]['state'] = formatNumber($[index].state)
                    state[index]['totalCases'] = formatNumber($[index].confirmed)
                    state[index]['totalDeaths'] = formatNumber($[index].deaths)
                    state[index]['newDeaths'] = formatNumber(`+${$[index].deltadeaths}`)
                    state[index]['newCases'] = formatNumber(`+${$[index].deltaconfirmed}`)
                    state[index]['totalRecovered'] = formatNumber($[index].recovered)
                    state[index]['activeCases'] = formatNumber($[index].active)
                    state[index]['newRecovered'] = formatNumber(`+${$[index].deltarecovered}`)
                    state[index]['seriousCritical'] = ''
                }
                state.sort((a, b) => {
                    var keyA = a.totalCases.replace(/\,/g, '')
                    var keyB = b.totalCases.replace(/\,/g, '')
                    keyA = parseInt(keyA, 10)
                    keyB = parseInt(keyB, 10)
                    if (keyA > keyB) return -1;
                    if (keyA < keyB) return 1;
                    return 0;
                })
                state.push(state.shift())
                res.status(200).send(state)
            })
    }
    catch (err) {
        res.status(404).send(err)
    }
}