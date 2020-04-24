let fs = require('fs');
let request = require('request');
let cheerio = require('cheerio');
let sID = process.argv[2];
let arr = [];
let url_Series = `https://www.espncricinfo.com/scores/series/${sID}`;
var today = new Date();
today.setHours(0, 0, 0, 0);
let num = 0;

request.post(url_Series, function (err, response, html) {
    if (!err && response.statusCode == 200) {

        console.log("Fetching Data...");
        let co = cheerio.load(html);
        let data = co(".scoreCollection__content.cricket");
        console.log("Data Fetched.");
        console.log("Writing data to the file.")
        fs.writeFileSync("./BatStats.html", data);
        let match = co(data);
        let details = match.find(".cscore_info-overview");
        let card = match.find(".cscore_list a");
        for (let i = 0; i < details.length; i++) {
            let str = co(details[i]).text();
            let det = str.split(",");
            let type = det[0].split(" ")[1];
            let date = new Date(det[2]);
            if (str.includes("ODI") || str.includes("T20I")) {
                if (today >= date) {
                    num++;
                    getScore(co(card[3 * i]).attr('href'), type);
                }
            }

        }
    }
    else {
        console.log(`Connection could not be established. Status Code - ${response.statusCode} \n ${err}.`);
    }
});

function getScore(url, type) {
    url = "https://www.espncricinfo.com" + url;
    request(url, function (err, response, html) {
        if (err == null && response.statusCode == 200) {
            console.log("Fetching Data...");
            let co = cheerio.load(html);
            let data = co(".scorecard-section.batsmen");
            let data2 = co(".accordion-header");
            for (let i = 0; i < data.length; i++) {
                let card = co(data.get(i)).find(".wrap.batsmen");
                card.each(function () {
                    let player = co(this).find(".cell.batsmen a").attr('title').replace("View the player profile of ", '');
                    let score = co(co(this).find(".runs").get(0)).text();
                    let team = co(data2.get(i)).text();
                    score = parseInt(score, 10);
                    inArray(player, score, team, type);
                });
            }


            num--;
            if (num == 0) {
                arr.sort(function (obj1, obj2) {
                    return obj2.score - obj1.score;
                });
                console.table(arr);
            }
        }
        else {
            console.log(`Connection could not be established. Status Code - ${response.statusCode} \n ${err}.`);
        }
    });


}

function inArray(player, score, team, type) {
    let ob = {};
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].player == player && arr[i].team == team && arr[i].type == type) {
            arr[i].score += score;
            return;
        }
    }

    ob.player = player;
    ob.score = score;
    ob.team = team;
    ob.type = type;
    arr.push(ob);

}
