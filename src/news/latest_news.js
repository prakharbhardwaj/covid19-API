const fetch = require('node-fetch')
const { formatDistance, format } = require('date-fns')

module.exports.news = (req, res) => {
    var index = 0
    let latestNews = []
    try {
        fetch('https://api.covid19india.org/updatelog/log.json')
            .then(res => res.json())
            .then(json => {
                let $ = json
                    .slice(-5)
                    .reverse()
                for (index in $) {
                    latestNews[index] = {}
                    latestNews[index]['update'] = $[index].update.replace('\n', ' ');
                    latestNews[index]['time'] =
                        formatDistance(
                            new Date($[index].timestamp * 1000),
                            new Date()
                        ) + ' ago'
                }
                res.status(200).send(latestNews)
            })
    }
    catch (err) {
        res.status(404).send(err)
    }
}