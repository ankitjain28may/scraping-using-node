
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

Run 1 { request: 5264, puppeteer: 23908, phantom: 18731, nightmare: 18105 }
Run 2 { request: 4767, puppeteer: 16639,  phantom: 12913,  nightmare: 16314 }
Run 3 { request: 3590, puppeteer: 6964,  phantom: 11732,  nightmare: 7145 }
Run 4 { request: 3055, puppeteer: 12170,  phantom: 14384,  nightmare: 22128 }
Run 5 { request: 7150, puppeteer: 23481,  phantom: 14454,  nightmare: 22794 }
Average: { request: 4765, puppeteer: 16632,  phantom: 14442,  nightmare: 17297 }


```
