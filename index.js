const express = require('express')
const app = express()

const port = process.env.PORT || 1212

// const cron = require('./cron')
const datascrap = require('./src/home/datascrap')
const sorting = require('./src/sort/sort')
const searching = require('./src/search/search')
const searchV2 = require('./src/search/search_v2')
const india = require('./src/india/statewise')
const news = require('./src/news/latest_news')
const indiaV2 = require('./src/india/statewise_v2')
const recoveryData = require('./src/past-recovery/past_recovery')

app.get('/', (req, res) => {
    res.send(
        `<h1>covid-19-api</h1>
        <h3>APIs to track the latest COVID-19 data along with other stuff like news, searching and sorting options.</h3>
        <h3>Check the latest API document on <a href="https://documenter.getpostman.com/view/6913280/SzYgRFJK?version=latest" target="_blank" style="color:#FF632C"><b>Postman</b></a>🚀</h3>
        <h4>by <a href="https://prakharbhardwaj.github.io/"target="_blank">Prakhar Bhardwaj</a>👨🏻‍💻</h4>`)
})
app.get('/covid19', datascrap.scrapdata)
app.get('/covid19/sort', sorting.sortdata)
app.get('/covid19/search', searching.searchdata)
app.get('/covid19/news', news.news)
app.get('/covid19/statewise', india.statewise)
app.get('/covid19/v2/search', searchV2.searchdata)
app.get('/covid19/v2/statewise', indiaV2.statewise)
app.get('/covid19/private/data/recoveryData', recoveryData.scrapdata)

app.listen(port, () => console.log(`App running on http://localhost:${port}`))