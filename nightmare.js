const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: true })
const cheerio = require('cheerio');
const fs = require('fs');

gotoUrl = function(url) {
  return nightmare
    .goto(url)
    .wait('#dp-container')
    .evaluate(() => document.querySelector('#dp-container').innerHTML)
    .end()
    .then(function(body) {
      console.log(body);
    })
    .catch(error => {
      console.error('Search failed:', error)
    })
}


// gotoUrl('https://www.amazon.in');

// scrapeContent = function (body, scrapingItems) {

// }

// paginate = function (url, selector) {
//   // nightmare
//   return url
// }
readCategory = function (category = '') {
  fs.readFile('amazon_categories.json', (err, data) => {
    var Categories = JSON.parse(data);
    if (category != '') {
      Categories[category].reduce(function (accumulator, ele) {
        console.log(accumulator);
        console.log(ele.link);
        return accumulator.then(function(results) {
          return nightmare
            .goto(ele.link)
            // .wait('#dp-container')
            // .evaluate(() => document.querySelector('#dp-container').innerHTML)
            .title()
            // .end()
            .then(function(body) {
              console.log("H");
            })
            .catch(error => {
              console.error('Search failed:', error)
            })
        })
      }, Promise.resolve([])).then(function(results){
        console.log(results);
      });
    }
  });
}

scrapeAllCategories = function (html, callback) {
  var baseUrl = 'https://www.amazon.in'
  var Categories = {};
  const $ = cheerio.load(html);
  $('.popover-grouping').each(function(i, elem) {
    var categoryText = $(elem).find('.popover-category-name').text();
    Categories[categoryText] = [];
    $(elem).find('li a').each(function (j, cat) {
      var obj = {
        title : $(cat).text(),
        link : baseUrl + $(cat).attr('href')
      };
      Categories[categoryText].push(obj);
    });
  });
  fs.writeFileSync('amazon_categories.json', JSON.stringify(Categories, null, 2));
  callback();
}

// scraper = function (url) {
//   nightmare
//     .goto(url)
//     .wait('#shopAllLinks')
//     .evaluate(() => document.querySelector('#shopAllLinks').innerHTML)
//     .end()
//     .then(function (body) {
//       scrapeAllCategories(body, readCategory('Echo & Alexa'));
//     })
//     .catch(error => {
//       console.error('Search failed:', error)
//     })
// }

// scraper('https://www.amazon.in/gp/site-directory');

readCategory('Echo & Alexa');
//
