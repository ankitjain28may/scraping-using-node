const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: true })
const cheerio = require('cheerio');
const fs = require('fs');


function gotoUrl(url) {
    return new Promise((resolve, reject) => {
        nightmare
            .goto('https://google.com')
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


// async function a() {
//     arr = [1, 2, 3];
//     results = [];
//     try {
//         const [ data, data1] = await Promise.all([gotoUrl('abc')]);
//         console.log(data);
//     }
//     catch (e) {
//         console.log(e);
//     }
// }
// a();

(async () => {
    results = [];
    for (var i = 0; i < 10; i++) {
        const data = await gotoUrl('await');
        results.push(data);
    }
    await nightmare.end();
    console.log(results);
})()