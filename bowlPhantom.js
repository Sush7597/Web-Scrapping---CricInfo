var phantom = require('webpage').create();
var fs = require('fs');
var URL = "https://www.espncricinfo.com/series/19322/commentary/1187677?innings=1";
// var URL = "https://www.google.com";
var data = "";
phantom.onConsoleMessage = function (msg) {
    console.log(msg);
}


phantom.open(URL, function (status) {
    if (status !== 'success') {
        console.log('Unable to post!');
    } else {
            window.setInterval(function() {

                var count = phantom.content.match(/class=".embed-container"/);
                console.log(count);

                if(count === null) {
                    phantom.evaluate(function() {
                        window.document.body.scrollTop = document.body.scrollHeight;
                      });                    
                    console.log("Scrolling...");
                    phantom.render('Render.jpeg', {format: 'jpeg', quality: '100'});
                }
                else {
                    data = phantom.content;
                    try {
                        console.log("Writing...");
                        fs.write("./BowlStatsPhantom.html", data, 'w');
                        } catch(e) {
                            console.log(e);
                        }    
                        console.log("Done.");
                    phantom.exit();
                }
            }, 5000);
    }
});

