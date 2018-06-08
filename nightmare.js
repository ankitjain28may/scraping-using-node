const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: true })
const cheerio = require('cheerio');
const fs = require('fs');

// ************ gotoURL ****************

function gotoUrl(url) {
  return new Promise((resolve, reject) => {
    nightmare
      .goto(url)
      .title()
      .then((data) => {
          resolve(data)
      })
      .catch((err) => {
          reject(err);
          return;
      })
  })
}

// **** Need to write further pagination function and others functions*************


// gotoUrl('https://www.amazon.in');

// scrapeContent = function (body, scrapingItems) {

// }

// paginate = function (url, selector) {
//   // nightmare
//   return url
// }
//

// *****************Working*************

// readCategory = function (category = '') {
//   fs.readFile('amazon_categories.json', (err, data) => {
//     var Categories = JSON.parse(data);
//     if (category != '') {
//       Categories[category].reduce(function (total, ele) {
//         return total.then(function(results) {
//           return nightmare
//             .goto(ele.link)
//             // .wait('#dp-container')
//             // .evaluate(() => document.querySelector('#dp-container').innerHTML)
//             .title()
//             // .end()
//             .then(function(body) {
//               results.push(body);
//               return results;
//             })
//             .catch(error => {
//               console.error('Search failed:', error)
//             })
//         })
//       }, Promise.resolve([])).then(function(results){
//         console.log(results);
//         nightmare.end()
//       });
//     }
//   });
// }

// *****************Not Working*************

readCategory =async function(category = '') {
  fs.readFile('amazon_categories.json',async (err, data) => {
    var Categories = JSON.parse(data);
    data = []
    if (category != '') {
      for (var i = Categories[category].length - 1; i >= 0; i--) {
        const res = await gotoUrl(Categories[category][i].link);
        console.log(res);
      }
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

// *****************Useless (Rough) *************


// var euros = [29.76, 41.85, 46.5];

// var sum = euros.reduce( function(total, amount){
//   return total
//     .then(function (amount) {
//       return new Promise((resolve, reject) => {
//         console.log("H");
//         return resolve();
//       });
//     })
//   }, Promise.resolve([])).then(function(results){
//     console.log(results);
//   });

// function doubleAfter2Seconds(x) {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       resolve(x * 2);
//     }, 2000);
//   });
// }
// async function addAsync(x) {
//   const a = await doubleAfter2Seconds(10);
//   const b = await doubleAfter2Seconds(20);
//   const c = await doubleAfter2Seconds(30);
//   return x + a + b + c;
// }

// addAsync(10).then((sum) => {
//   console.log(sum);
// });
//

// function a() {
//     a = [1, 2, 3, 4]
//     const promise = Promise.all(a.map(async (ele) => {
//         try {
//             const data = await nightmare
//                 .goto('https://google.com')
//                 .title()
//         }
//         catch (e) {
//             console.log(e)
//         }
//     })).then((data) =>
//         console.log(data)
//       ).catch((err) => console.log(err));
// }
// a()