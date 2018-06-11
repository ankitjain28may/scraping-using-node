var rp = require('request-promise');
const cheerio = require('cheerio');

module.exports = async () =>  {
  const data = await rp('https://www.amazon.in/Computer-Accessories/b/ref=sd_allcat_sbc_mobcomp_comp_acc/260-0319244-6767707?ie=UTF8&node=1375248031');
  try {
    const result = await fetchUrl(data);
    const next = await paginate(data, 'a#pagnNextLink')
    results = {
      "urls": result,
      "next": next
    }
    return results
  } catch (err) {
    console.log(err);
  }
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