var express = require('express')

var app = express();
var PORT = process.env.port || 8081;

app.use(express.static('public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});
app.listen(PORT);

console.log('http://localhost:' + PORT + '로 서버 실행됨');