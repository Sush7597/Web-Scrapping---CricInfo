let fs = require('fs');
let request = require('request');
let cheerio = require('cheerio');
//let pro = require('child_process');
let sID = process.argv[2];
let mID = process.argv[3];

let url_Scard = `https://www.espncricinfo.com/series/${sID}/scorecard/${mID}`;
let url_Comm = `https://www.espncricinfo.com/series/${sID}/commentary/${mID}`;

//Player with max wickets
// request(url_Scard , function(err , response , html){
// if(err == null && response.statusCode == 200)
// {
//     console.log("Fetching Data...");
//     let co = cheerio.load(html);
//     let data = co(".scorecard-section.bowling tbody tr");
//     console.log("Data Fetched.");
//     console.log("Writing data to the file.")
//     fs.writeFileSync("./ScoreCard.html" , data);
//     let max = 0;
//     let player = "";
//     data.each(function(){
//         let wkts = parseInt(co(co(this).find("td").get(5)).html() , 10);
//         if(max < wkts)
//         {
//         max = wkts;
//         player = co(this).find("td a").html();
//         }
//     });
//     console.log("Player who got maximum wickets : " + player);
// }
// else
// {
//     console.log(`Connection could not be established. Status Code - ${response.statusCode}.`);
// }
// });


// Getting last bowl commentary
request(url_Comm , function(err , response , html){
if(!err && response.statusCode == 200)
{
    console.log("Fetching Data...");
    let co = cheerio.load(html);
    let data = co(".main-content .commentary-item.pre .description");
    console.log("Data Fetched.");
    console.log("Writing data to the file.")
    fs.writeFileSync("./Commentary.html" , data);
    console.log(co(co(data).get(0)).text());
}
else
{
    console.log(`Connection could not be established. Status Code - ${response.statusCode}.`);
}

});
