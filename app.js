var phantom = require('x-ray-phantom');
var Xray = require('x-ray');
x = Xray().driver(phantom({webSecurity:false}));

x('https://www.amazon.in/Men-Watches/b/ref=sd_allcat_sbc_mfashion_watches?ie=UTF8&node=2563504031', '#search-results li', [{
  title: 'div.s-item-container div.a-row.a-spacing-none div.a-row.a-spacing-mini:first-child',
  price: 'div.s-item-container div.a-row.a-spacing-none div:nth-child(3)',
  link: 'div.s-item-container div.a-row.a-spacing-none div.a-row.a-spacing-mini:first-child a@href'
}])
  .paginate('#pagnNextLink@href')
  .limit(3)
  .write('results.json')
