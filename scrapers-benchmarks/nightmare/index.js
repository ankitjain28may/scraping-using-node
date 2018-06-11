const Nightmare = require('nightmare')
const cheerio = require('cheerio');
const fs = require('fs');
const nightmare = Nightmare({
  show: false
})

// module.exports = () => Nightmare({ show: true })
//   .goto('http://google.com')
//   .end()



function gotoUrl(url) {
  return new Promise((resolve, reject) => {
    Nightmare({ show: false })
      .goto(url)
      .wait('body')
      .end()
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

isProductUrl = function (url) {
  const patten = '/dp/';
  if (url.indexOf(patten) > 0) {
    return true;
  }
  else {
    return false;
  }
}

readCategory = function(category = "Men's Fashion", limit = 5) {
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

module.exports = async () => {
  const data = await gotoUrl('https://www.amazon.in/Computer-Accessories/b/ref=sd_allcat_sbc_mobcomp_comp_acc/260-0319244-6767707?ie=UTF8&node=1375248031');
  return data;
}