const express = require('express')
const app = express()

const port = process.env.PORT || 1212
const datascrap = require('./datascrap')
const sorting = require('./sort')
const searching = require('./search')
const india = require('./statewise')
const news = require('./latest_news')

app.get('/', (req, res) => {
    // res.send('<h1>Prka</h1>')
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

app.listen(port, () => console.log(`App running on http://localhost:${port}`))