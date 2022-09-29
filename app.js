const express = require('express');
const res = require('express/lib/response');
const request = require('request');
const app = express()
const port = 3000

const googleMapsApiKey = "";

app.use(express.static('public'))

app.get('/geocode', (req, res) => {
    // need to sanitize req.query.lat and req.query.long
    request(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${req.query.lat},${req.query.long}&key=${googleMapsApiKey}`, function (error, response, body) {
        res.send(JSON.parse(body).results[0].formatted_address)
    });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
