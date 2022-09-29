const express = require('express');
const request = require('request');
require('dotenv').config()
const app = express()
const port = 3000

const googleMapsApiKey = process.env.googleMapsApiKey;

app.use(express.static('public'))

app.get('/geocode', (req, res) => {
    // need to sanitize req.query.lat and req.query.long
    request(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${req.query.lat},${req.query.long}&key=${googleMapsApiKey}`, function (error, response, body) {
        res.send(JSON.parse(body).results[0].formatted_address)
    });
})

app.get('/nearest-road', (req, res) => {
    // send lat and long get nearest road lat and long like:
    // {"latitude":41.76916258266522,"longitude":-87.94925735613717}
    request(`https://roads.googleapis.com/v1/nearestRoads?points=${req.query.lat},${req.query.long}&key=${googleMapsApiKey}`, (request, response, body) => {
        console.log(JSON.parse(body))
        res.send(JSON.parse(body).snappedPoints ? JSON.parse(body).snappedPoints[0].location : req.query)
    });
})

app.get('/directions', (req, res) => {
    const {
        fromLat, fromLong, toLat, toLong
    } = req.query;
    request(`https://maps.googleapis.com/maps/api/directions/json?mode=WALKING&origin=${fromLat},${fromLong}&destination=${toLat},${toLong}&key=${googleMapsApiKey}`, (request, response, body) => {
        res.send(JSON.parse(body).routes[0].legs)
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
