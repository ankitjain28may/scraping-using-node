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
  console.time("Start");
  // var url = 'https://www.amazon.in/b/ref=s9_acss_bw_cg_BXFBSTYA_2a1_w?node=14019572031&pf_rd_m=A1K21FY43GMZF8&pf_rd_s=merchandised-search-4&pf_rd_r=B556JYM2P9PRCMTQRWG1&pf_rd_t=101&pf_rd_p=c73a670f-a8d1-44d8-a012-dd6e4be9fe37&pf_rd_i=13995270031';
  // var context = 'li.s-result-item.celwidget  ';
  // var link_selector = 'div.a-fixed-left-grid-col.a-col-right > div > div > a.a-link-normal.s-access-detail-page.s-color-twister-title-link.a-text-normal';
  // var inner_page_selector = '#dp-container';
  var url = req.body.url;
  var context = req.body.options.context;
  var link_selector = req.body.options.link_selector;
  var inner_page_selector = req.body.options.inner_page_selector;

  var results = {
    'status': '',
    'response': {},
    'error': {},
  };
  try {
    await rp({
      uri: url,
      method: 'GET',
      resolveWithFullResponse: true
    }).then(async (response) => {
      results.status = true;
      results.response = response;
      [links, results.response.body] = getLink(response.body, context, link_selector);
      console.timeEnd("Start");
      console.time("Start-ALL");
      const body = await Promise.all(links.map(url =>
        rp(url)
      )).then(values => {
        return values;
      });
      console.log("Done--");
      console.timeEnd("Start-ALL");
      console.time("Appending");
      results.response.body = getInnerPage(results.response.body, context, body, inner_page_selector);
      console.timeEnd("Appending");
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
  var body = "";
  const $ = cheerio.load(html);
  try {
    $(selector).each(function(i, elem) {
      link = $(elem).attr('href');
      links.push(link);
    });
    return [links, $.html(context)];
  } catch (e) {
    console.log(e);
  }
}

getInnerPage = function (html, selector, pages, inner_page_selector) {
  const $ = cheerio.load(html);
  $('script').remove();
  var new_html = "";
  try {
    $(selector).each(function(i, elem) {
      const $c = cheerio.load(pages[i]);
        $c('script').remove();
        $(this).append('<affiliatesconnect>' + $c(inner_page_selector).html() + '</affiliatesconnect');
        new_html += $.html(elem);
    });
    return new_html;
  } catch (e) {
    console.log(e);
  }
}
//
  // var links = ['http://google.com', 'http://gmail.com'];
  // var promises = [rp('http://google.com'), rp('http://gmail.com')];
  // const body = await Promise.all(links.map(link => rp(link))).then(values => {
  //   console.log(values);
  // });
  // res.send("Done");
// });

app.listen(port);
console.log("Server started at port " + port);
