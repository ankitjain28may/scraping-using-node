const express = require('express');
const rp = require('request-promise');
const cheerio = require('cheerio');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 9000;

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', (req, res) => {
  res.send("Node Server for Affiliates Connect Module");
})

app.post('/get-static' ,async (req, res) => {
  var url = req.body.url;
  var headers;
  var data;
  await rp({
    uri: url,
    method: 'GET',
    resolveWithFullResponse: true
  }).then((response) => {
    headers = response.headers;
    data = response.body;
  });
  res.send(JSON.stringify({'body': data, 'headers': headers}));
});


app.listen(port);
console.log("Server started at port " + port);
