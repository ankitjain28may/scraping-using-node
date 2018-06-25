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

  var results = {
    'status': '',
    'response': {},
    'error': {}
  };
  try {
    await rp({
      uri: url,
      method: 'GET',
      resolveWithFullResponse: true
    }).then(async (response) => {
      results.status = true;
      results.response = response;
      [links, results.response.body] = getLink(response.body, req.body.options.context, req.body.options.link_selector);
      const body = await Promise.all(links).then(values => {
        return values;
      });
      results.response.body = getInnerPage(results.response.body, req.body.options.context, body, req.body.options.inner_page_selector);
    });
  }
  catch(err)  {
    results.status = false;
    results.error = err;
  }
  res.send(JSON.stringify(results));
});

getLink = function (html, context, link_selector) {
  var selector = context + " " + link_selector;
  var links = [];
  const $ = cheerio.load(html);
  try {
    $(selector).each(function(i, elem) {
      link = $(elem).attr('href');
      links.push(
        rp({
          uri: link,
          method: 'GET',
          resolveWithFullResponse: true
        })
      );
    });
    return [links, $.html(context)];
  } catch (e) {
    console.log(e);
  }
}

getInnerPage = function (html, selector, pages, inner_page_selector) {
  const $ = cheerio.load(html, {
    normalizeWhitespace: true,
  });
  try {
    $(selector).each(function(i, elem) {
      const $c = cheerio.load(pages[i].body);
        $(this).append('<affiliatesconnect>' + $c(inner_page_selector).html() + '</affiliatesconnect');
    });
    $('script').remove();
    return $.html(selector);
  } catch (e) {
    console.log(e);
  }
}

app.listen(port);
console.log("Server started at port " + port);
