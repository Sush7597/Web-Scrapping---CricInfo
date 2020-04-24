let fs = require('fs');
let request = require('request');
let cheerio = require('cheerio');
let phantom = require('phantom');
//let pro = require('child_process');
let sID = process.argv[2];
let mID = process.argv[3];
let team = process.argv[4];
let URL;
let url_comm = `https://www.espncricinfo.com/series/${sID}/commentary/${mID}`;
getURL();

function req() {

}

function getURL() {
    request(url_comm, function (err, response, html) {
        if (!err && response.statusCode == 200) {
            console.log("Fetching Data...");
            let co = cheerio.load(html);
            console.log("Data Fetched.");
            let data = co(co(".filters .dropdown-menu.med")[0]).find("li a");

            if (co(data.get(0)).html().includes(team)) {
                URL = `https://www.espncricinfo.com` + co(data.get(0)).attr("href");
            }
            else {
                URL = `https://www.espncricinfo.com` + co(data.get(1)).attr("href");
            }

            req();
        }
        else {
            console.log(`Connection could not be established. Status Code - ${response.statusCode}.`);
        }

    });
}