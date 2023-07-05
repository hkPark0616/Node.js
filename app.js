// pm2 사용법
// 시작 : pm2 start app.js ( + --watch 옵션 : 변동사항 있을 때 재시작)
// 확인 : pm2 status
// 종료 : pm2 delete [종료할 프로세스 id]

const express = require("express");
const router = express.Router();
const app = express();
const port = 3001;
const db = require('./db');
var fs = require('fs')
var ejs = require('ejs')

app.set("view engine", "ejs")
const path = require('path'); 
app.set('views', path.join(__dirname, 'views'));

const mysql = require('mysql2');

const connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'rainbow@6861',
  port:3306,
  database:'nodejs'
});


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
app.use('/', express.static("images"));


/*router.get('/board', (req, res) => {
  res.sendFile(__dirname + '/views/board.html');
  
});*/
// app.get('/board/:cur', function(req, res, next) {
//   db.getAllMemos((rows) =>{
//     res.render(__dirname + '/views/board.ejs', { rows : rows });
//   });
// });

app.get("/board/:cur", function (req, res) {

  //페이지당 게시물 수 : 한 페이지 당 10개 게시물
  var page_size = 10;
  //페이지의 갯수 : 1 ~ 10개 페이지
  var page_list_size = 10;
  //limit 변수
  var no = "";
  //전체 게시물의 숫자
  var totalPageCount = 0;

  var queryString = 'SELECT count(*) AS cnt FROM board';
  connection.query(queryString, function (error2, data) {
      if (error2) {
          console.log(error2 + "메인 화면 mysql 조회 실패");
          return
      }
      //전체 게시물의 숫자
      totalPageCount = data[0].cnt

      //현제 페이지 
      var curPage = req.params.cur;

      console.log("현재 페이지 : " + curPage, "전체 페이지 : " + totalPageCount);


      //전체 페이지 갯수
      if (totalPageCount < 0) {
          totalPageCount = 0
      }

      var totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
      var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수         
      var curSet = Math.ceil(curPage / page_list_size) // 현재 셋트 번호
      var startPage = ((curSet - 1) * 10) + 1 //현재 세트내 출력될 시작 페이지
      var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지


      //현재페이지가 0 보다 작으면
      if (curPage < 0) {
          no = 0
      } else {
          //0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
          no = (curPage - 1) * 10
      }

      console.log('[0] curPage : ' + curPage + ' | [1] page_list_size : ' + page_list_size + ' | [2] page_size : ' + page_size + ' | [3] totalPage : ' + totalPage + ' | [4] totalSet : ' + totalSet + ' | [5] curSet : ' + curSet + ' | [6] startPage : ' + startPage + ' | [7] endPage : ' + endPage)

      var result2 = {
          "curPage": curPage,
          "page_list_size": page_list_size,
          "page_size": page_size,
          "totalPage": totalPage,
          "totalSet": totalSet,
          "curSet": curSet,
          "startPage": startPage,
          "endPage": endPage
      };


      fs.readFile(__dirname + '/views/board.ejs', 'utf-8', function (error, data) {

          if (error) {
              console.log("ejs오류" + error);
              return
          }
          console.log("몇번부터 몇번까지냐~~~~~~~" + no)

          var queryString = 'SELECT * FROM board ORDER BY date DESC LIMIT ?,?';
          connection.query(queryString, [no, page_size], function (error, result) {
              if (error) {
                  console.log("페이징 에러" + error);
                  return
              }
                  
              res.send(ejs.render(data, {
                  data: result,
                  pasing: result2
              }));
          });
      }); 
  });

});

app.get("/main", function (req, res) {

  res.redirect('board/' + 1);

});
              
app.get('/write', (req, res) => {
  res.sendFile(__dirname + '/views/write.html');
});       

app.use('/insert', function(req, res, next){
  let title = req.body.title;
  let name = req.body.name;
  let content = req.body.content;

  db.insertMemo(content, title, name);
  
  res.redirect('/main');
});

app.get('/memo', (req, res) => {
  let title = req.query.title;
  let value = req.query.value;

  db.getMemo(title, value, (rows) => {
    res.render(__dirname + '/views/memo.ejs', {rows : rows});
  });
});     

