const express = require('express')
const app = express()

const port = process.env.PORT || 1212
const datascrap = require('./datascrap')
const sorting = require('./sort')
const india = require('./statewise')

app.get('/covid19', datascrap.scrapdata)
app.get('/covid19/sort', sorting.sortdata)
// app.get('/covid19/statewise', india.statewise)

app.listen(port, () => console.log(`App running on http://localhost:${port}`))