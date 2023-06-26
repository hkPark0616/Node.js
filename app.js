const express = require("express");
const router = express.Router();
const app = express();
const port = 3001;
const db = require('./db');

app.set("view engine", "ejs")
const path = require('path'); 
app.set('views', path.join(__dirname, 'views'));

const mysql = require('mysql2');

app.use(express.urlencoded({extended: false}));
/*app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/main.html');
});*/
app.get('/', function(req, res, next) {
  db.getAllMemos((rows) =>{
    res.render(__dirname + '/views/main.ejs', { rows : rows });
  });
});

app.listen(port, () => {
  console.log("서버가 실행됩니다.");
  console.log("http://localhost:3001/");
});

app.use('/', express.static("css"));


/*router.get('/board', (req, res) => {
  res.sendFile(__dirname + '/views/board.html');
  
});*/
app.get('/board', function(req, res, next) {
  db.getAllMemos((rows) =>{
    res.render(__dirname + '/views/board.ejs', { rows : rows });
  });
});

              
app.get('/write', (req, res) => {
  res.sendFile(__dirname + '/views/write.html');
});       

app.use('/insert', function(req, res, next){
  let title = req.body.title;
  let name = req.body.name;
  let content = req.body.content;

  db.insertMemo(content, title, name);
  
  res.redirect('board');
});