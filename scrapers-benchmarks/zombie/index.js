const Browser = require('zombie');

module.exports = () => (new Browser()).visit('http://amazon.in')
