const express = require('express');
const rp = require('request-promise');
const cheerio = require('cheerio');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 9000;

app.use(bodyParser.json({limit: '50mb'})); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' })); // support encoded bodies

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
  var break_in_parts = req.body.options.break_in_parts;
  var no_of_parts = req.body.options.no_of_parts;
  var left_html = req.body.options.left_html;
  var inner_feeds_scraper = req.body.options.inner_feeds_scraper;

  var results = {
    'status': '',
    'response': {},
    'error': {},
    'left': '',
    'left_html': ''
  };
  try {
    if (break_in_parts && left_html != "") {
      console.log("Running for Left-over links");
      results.response.body = left_html;
      results.response.statusCode = 200;
    } else {
      await rp({
        uri: url,
        method: 'GET',
        resolveWithFullResponse: true
      }).then(async (response) => {
        results.response = response;
      });
      console.log("Fetching");
    }
    [links] = getLink(results.response.body, context, link_selector, break_in_parts, no_of_parts);
    console.log(links);
    console.timeEnd("Start");
    if (inner_feeds_scraper) {
      console.time("Start-InnerFetching");
      const body = await Promise.all(links.map(url =>
        rp(url)
      )).then(values => {
        return values;
      });
      console.log("Done--");
      console.timeEnd("Start-InnerFetching");
      console.time("Appending");
      [results.response.body, results.left_html, results.left] = getInnerPage(results.response.body, context, body, inner_page_selector, break_in_parts, no_of_parts);
      console.log(results.left);
      console.timeEnd("Appending");
    }

    results.status = true;
  }
  catch(err)  {
    results.status = false;
    results.error = err;
  }
  res.send(JSON.stringify(results));
});

getLink = function (html, context, link_selector, break_in_parts, no_of_parts) {
  var selector = context + " " + link_selector;
  var links = [];

  const $ = cheerio.load(html);
  try {
    $(selector).each(function(i, elem) {
      if (break_in_parts && i >= no_of_parts) {
        return;
      } else {
        link = $(elem).attr('href');
        links.push(link);
      }
    });
    return [links];
  } catch (e) {
    console.log(e);
  }
}

getInnerPage = function (html, selector, pages, inner_page_selector, break_in_parts, no_of_parts) {
  const $ = cheerio.load(html);
  $('script').remove();
  var new_html = "";
  var left_html = "";
  var left = 0;
  try {
    $(selector).each(function(i, elem) {
      if (break_in_parts && i >= no_of_parts) {
        left_html = left_html + $.html(elem);
        left += 1;
      } else {
        const $c = cheerio.load(pages[i]);
        $c('script').remove();
        $(this).append('<affiliatesconnect>' + $c(inner_page_selector).html() + '</affiliatesconnect');
        new_html += $.html(elem);
      }
    });
    return [new_html, left_html, left];
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
