const express = require("express");
const router = express.Router();
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/main.html');
});

app.listen(port, () => {
  console.log("서버가 실행됩니다.");
});

app.use('/', express.static("/css"));


app.get('/board', (req, res) => {
  res.sendFile(__dirname + '/views/board.html');
});
              
app.get('/write', (req, res) => {
  res.sendFile(__dirname + '/views/write.html');
});                                                                                                                                          