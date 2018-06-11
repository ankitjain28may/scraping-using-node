
# scrapers-benchmarks

Benchmarking various scrapers for Amazon Scraping

[request], [zombie], [puppeteer], [phantom], [nightmare]

[request]: https://github.com/request/request
[zombie]: https://github.com/assaf/zombie
[puppeteer]: https://github.com/GoogleChrome/puppeteer
[phantom]: https://github.com/Medium/phantomjs
[nightmare]: https://github.com/segmentio/nightmare

```
> Zombie is not loading the content of Amazon website showing error while loading amazon.in

npm install

node index.js


Run 1 {    request: 6374, puppeteer: 14531, phantom: 35796, nightmare: 22492 }
Run 2 {    request: 545, puppeteer: 3642, phantom: 3993, nightmare: 16902 }
Run 3 {    request: 539, puppeteer: 3678, phantom: 3573, nightmare: 17613 }
Run 4 {    request: 545, puppeteer: 2308, phantom: 3969, nightmare: 17224 }
Run 5 {    request: 556, puppeteer: 2815, phantom: 3548, nightmare: 17857 }
Average: { request: 603, puppeteer: 3403, phantom: 3774, nightmare: 17457 }

```
