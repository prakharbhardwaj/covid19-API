const fetch = require('node-fetch');
const datascrap = require('./datascrap')

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
                    if ($[index].deltaconfirmed == 0 && $[index].deltadeaths == 0) {
                        state[index]['state'] = formatNumber($[index].state)
                        state[index]['totalCases'] = formatNumber($[index].confirmed)
                        state[index]['totalDeaths'] = formatNumber($[index].deaths)
                        state[index]['newDeaths'] = '-'
                        state[index]['newCases'] = '-'
                        state[index]['totalRecovered'] = formatNumber($[index].recovered)
                        state[index]['activeCases'] = formatNumber($[index].active)
                        state[index]['seriousCritical'] = ''
                    }
                    else if ($[index].deltadeaths == 0) {
                        state[index]['state'] = formatNumber($[index].state)
                        state[index]['totalCases'] = formatNumber($[index].confirmed)
                        state[index]['totalDeaths'] = formatNumber($[index].deaths)
                        state[index]['newDeaths'] = '-'
                        state[index]['newCases'] = formatNumber(`+${$[index].deltaconfirmed}`)
                        state[index]['totalRecovered'] = formatNumber($[index].recovered)
                        state[index]['activeCases'] = formatNumber($[index].active)
                        state[index]['seriousCritical'] = ''
                    } else if ($[index].deltaconfirmed == 0) {
                        state[index]['state'] = formatNumber($[index].state)
                        state[index]['totalCases'] = formatNumber($[index].confirmed)
                        state[index]['totalDeaths'] = formatNumber($[index].deaths)
                        state[index]['newDeaths'] = formatNumber(`+${$[index].deltadeaths}`)
                        state[index]['newCases'] = '-'
                        state[index]['totalRecovered'] = formatNumber($[index].recovered)
                        state[index]['activeCases'] = formatNumber($[index].active)
                        state[index]['seriousCritical'] = ''
                    }
                    else {
                        state[index]['state'] = formatNumber($[index].state)
                        state[index]['totalCases'] = formatNumber($[index].confirmed)
                        state[index]['totalDeaths'] = formatNumber($[index].deaths)
                        state[index]['newDeaths'] = formatNumber(`+${$[index].deltadeaths}`)
                        state[index]['newCases'] = formatNumber(`+${$[index].deltaconfirmed}`)
                        state[index]['totalRecovered'] = formatNumber($[index].recovered)
                        state[index]['activeCases'] = formatNumber($[index].active)
                        state[index]['seriousCritical'] = ''
                    }
                }
                state.push(state.shift())
                res.status(200).send(state)
            })
    }
    catch (err) {
        res.status(404).send(err)
    }
}