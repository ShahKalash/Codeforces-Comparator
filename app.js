const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const https = require('https');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

var id1 = "";
var id2 = "";
const arr1 = [];
const arr2 = [];
app.get('/', (req, res) => {
    arr1.length = 0;
    arr2.length = 0;
    res.render('index');
});
app.post('/', (req, res) => {
    id1 = req.body.id1;
    id2 = req.body.id2;
    res.redirect('/standing');
});

app.get('/standing', (req, res) => {
    var url = "https://codeforces.com/api/user.rating?handle=KalashShah";
    if (id1 !== "")
        url = "https://codeforces.com/api/user.rating?handle=" + id1;
    https.get(url, (response1) => {
        console.log('statusCode:', response1.statusCode);
        console.log('headers:', response1.headers);

        let rawData = '';

        response1.on('data', (chunk) => {
            rawData += chunk; // Accumulate received data
        });

        response1.on('end', () => {
            try {
                const parsedData = JSON.parse(rawData);
                // console.log(parsedData.result);
                arr1.push(parsedData.result);
                // console.log(arr1);
                if (id2 !== "")
                    url = "https://codeforces.com/api/user.rating?handle=" + id2;
                https.get(url, (response2) => {
                    console.log('statusCode:', response2.statusCode);
                    console.log('headers:', response2.headers);

                    let rawData = '';

                    response2.on('data', (chunk) => {
                        rawData += chunk; // Accumulate received data
                    });

                    response2.on('end', () => {
                        try {
                            const parsedData2 = JSON.parse(rawData);
                            // console.log(parsedData.result);
                            arr2.push(parsedData2.result);
                            res.render('standing', { arr1: arr1, arr2: arr2 });
                        } catch (error) {
                            console.error('Error parsing JSON:', error);
                        }
                    });


                });
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        });



    });

})
app.listen(3000, () => {
    console.log('listening on port 3000');
})