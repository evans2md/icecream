var http = require('http'),
    express = require('express'),
    fs = require('fs'),
    port = process.env.VCAP_APP_PORT || 8080,
    app = express(),
    server;
    
    
require("cf-deployment-tracker-client").track();
    
app.use(express.static(__dirname + "/client"));

app.listen(port, function() {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});

//app.route('saveData', methods = ['POST','GET'])
//    .get(function (req, res){
//        res.send('get');
//    })
//    .post(function (req, res){
//        res.send('get');
//        //fs.appendFile('data.csv', userData, function (err) {
//         //   if (err) throw err;
//        //console.log('Saved!');
//        //})
//    });
//});
//
//        
//    })
//    fs.appendFile('mynewfile1.txt', 'Hello content!', function (err) {
//  if (err) throw err;
//  console.log('Saved!');
//});


// set port
http.createServer(app).listen(3000);

console.log("server running on port 3000");
