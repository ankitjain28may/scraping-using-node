var Xray = require('x-ray');
var x = Xray();

x('https://www.amazon.in/Men-Watches/b/ref=sd_allcat_sbc_mfashion_watches?ie=UTF8&node=2563504031', '#search-results li', [{
  title: 'div.s-item-container div.a-row.a-spacing-none div.a-row.a-spacing-mini:first-child',
  price: 'div.s-item-container div.a-row.a-spacing-none div:nth-child(3)',
  link: 'div.s-item-container div.a-row.a-spacing-none div.a-row.a-spacing-mini:first-child a@href'
}])
  .paginate('#search-results div#bottomBar #pagn span.pagnRA a@href')
  .limit(2)
  .write('results_xray.json')