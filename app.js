const express = require('express');
const { readFile } = require('fs').promises;
const app = express();
const bodyParser = require('body-parser')
const port = 8080
const db = require('./queries')

app.use(express.static('public'));


app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)


app.get('/map', async(request, response) => {
    response.send( await readFile('./index.html', 'utf-8'))
});

app.get('/datas', db.getAllData);

app.get('/data', db.getObjectAtLatLng)


app.get('/', async (request, response) => {
    response.send( await readFile('./index2.html', 'utf-8'));
});



app.listen(process.env.PORT || port, () => console.log('App availible on http://localhost:' + port ));

        