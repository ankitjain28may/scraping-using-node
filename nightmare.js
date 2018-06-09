const Nightmare = require('nightmare')
const cheerio = require('cheerio');
const fs = require('fs');
const nightmare = Nightmare({
  switches: {
    'https': '51.15.227.220:3128' // set the proxy server here ...
  },
  show: true
})

// ************ gotoURL ****************

function gotoUrl(url) {
  return new Promise((resolve, reject) => {
    nightmare
      .goto(url)
      .wait('body')
      .evaluate(() => {
        return document.querySelector('body').innerHTML
      })
      .then(async (data) => {
          try {
            const result = await fetchUrl(data);
            const next = await paginate(data, 'a#pagnNextLink')
            results = {
              "urls": result,
              "next": next
            }
            resolve(results)
          } catch (err) {
            console.log(err);
          }
      })
      .catch((err) => {
          reject(err);
          return;
      })
  })
}
fetchUrl = function (html) {
  const $ = cheerio.load(html);
  var links = [];
  try {
    $('#mainResults ul.s-result-list li, #atfResults ul.s-result-list li').each(function(i, elem) {
      var link = $(elem).find('div.s-item-container div.a-row:nth-child(3) > div a').attr('href');
      if (link) {
        links.push(link);
      }
    });
    return links;
  } catch (e) {
    console.log("Not found");
    return;
  }
}
paginate = function (html, selector) {
  const $ = cheerio.load(html);
  var links = [];
  if ($(selector).length) {
    var next = {
      page: "https://www.amazon.in" + $(selector).attr('href'),
      total: $(".pagnDisabled").text(),
      current: $(".pagnCur").text()
    }
    return next;
  }
  return {page: false};
}


// **** Need to write further pagination function and others functions*************


// gotoUrl('https://www.amazon.in');

// scrapeContent = function (body, scrapingItems) {

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

isProductUrl = function (url) {
  const patten = '/dp/';
  if (url.indexOf(patten) > 0) {
    return true;
  }
  else {
    return false;
  }
}

readCategory = function(category = '', limit = 5) {
  fs.readFile('amazon_categories.json',async (err, data) => {
    var Categories = JSON.parse(data);
    totalUrls = {
      'urls': []
    }
    if (category != '') {
      for (var i = Categories[category].length - 1; i >= 0; i--) {
        var pageUrl = Categories[category][i].link;
        var maxPage = limit;
        var pagnCur = 0;
        while(pagnCur <= maxPage) {
          const isUrl = await isProductUrl(pageUrl);
          if (!isUrl) {
            try {
              const urls = await gotoUrl(pageUrl);
              if (urls.next.page) {
                pageUrl = urls.next.page;
                Array.prototype.push.apply(totalUrls.urls, urls.urls);
                // totalUrls.urls.push(urls.urls);
                pagnCur = Number(urls.next.current) + 1;
                if (!limit) {
                  maxPage = Number(urls.next.total);
                }
              } else {
                break;
              }
            } catch (err) {
              console.log(err);
            }
          }
        }
      }
      await nightmare.end();
      fs.writeFileSync('Amazon/urls.json', JSON.stringify(totalUrls, null, 2));
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

readCategory("Men's Fashion");
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