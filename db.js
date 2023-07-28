const mysql = require('mysql2');

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'rainbow@6861',
    port:3306,
    database:'nodejs'
});

function getAllMemos(callback){
    connection.query('SELECT * FROM board ORDER BY date DESC;', (err, rows, fields) => {
        if(err) throw err;
        callback(rows);
    });
}

function getMemosPagenation(no, page_size, callback){
    connection.query(`SELECT * FROM board ORDER BY date DESC LIMIT ${no}, ${page_size}`, (err, rows, fields) => {
        if(err) throw err;
        callback(rows);
    });
}

function insertMemo(content, title, name){
    connection.query(`INSERT INTO board (content, date, name, title) VALUES ('${content}',NOW(),'${name}', '${title}')`);
}

function getMemo(title, value, callback){
    connection.query(`SELECT num, title, name, date, content, watch FROM board WHERE title = '${title}' && num = '${value}';`, (err, rows, fields) => {
        if(err) throw err;
        callback(rows);
    });
}

function watchCount(title, value){
    connection.query(`UPDATE board SET watch = watch + 1 WHERE title = '${title}' && num = '${value}'`);
}

function getUser(id, nickname, callback){
    connection.query(`SELECT * FROM user WHERE id = '${id}';`, (err, rows, fields) => {
        if(err) throw err;
        callback(rows);
    });
}

function insertUser(id, password, nickname){
    connection.query(`INSERT INTO user(id, password, nickname) VALUES ('${id}','${password}', '${nickname}');`);
}

function checkUser(id, callback){
    connection.query(`SELECT password FROM user WHERE id = '${id}';`, (err, rows, fields) => {
        if(err) throw err;
        callback(rows);
    });
}

function getInfo(title, value, name, callback){
    connection.query(`SELECT * FROM board WHERE title = '${title}' && num = '${value}' && name = '${name}';`, (err, rows, fields) => {
        if(err) throw err;
        callback(rows);
    });
}

function memoUpdate(title, value, name, content){
    connection.query(`UPDATE board SET content = '${content}' WHERE title = '${title}' 
                            AND num = '${value}' AND name = '${name}';`);
}

function memoDelete(title, name, value){
    connection.query(`DELETE FROM board WHERE title = '${title}' && num = '${value}' && name = '${name}';`)
}

function commendInsert(value, content, user, commendId){
    connection.query(`INSERT INTO commend(memo_id, commend_name, commend_date, commend_content, commend_id) 
    VALUES ('${value}', '${user}', NOW(), '${content}', '${commendId}');`);
}

function getCommend(value, offset, limit, callback) {
    connection.query(
      `SELECT * FROM commend WHERE memo_id = '${value}' ORDER BY commend_date DESC LIMIT ${offset}, ${limit};`,
      (err, rows, fields) => {
        if (err) throw err;
        callback(rows);
      }
    );
  }

  function getCommendCount(value, callback) {
    connection.query(`SELECT COUNT(*) AS count FROM commend WHERE memo_id = '${value}';`, (err, rows, fields) => {
      if (err) throw err;
      callback(rows); // 댓글 전체 개수를 콜백으로 전달
    });
  }


function getRecommend(commendId, offset, limit, callback) {
    connection.query(
      `SELECT * FROM recommend WHERE commend_id = '${commendId}' ORDER BY recommend_date DESC LIMIT ${offset}, ${limit};`,
      (err, rows, fields) => {
        if (err) throw err;
        callback(rows);
      }
    );
}

function insertRecommend(commend_id, recommend_name, recommend_content, recommend_id){
    connection.query(`INSERT INTO recommend 
            VALUES ('${commend_id}','${recommend_name}', NOW(), '${recommend_content}', '${recommend_id}');`
    );
}
module.exports = {
    getAllMemos,
    insertMemo,
    getMemo,
    watchCount,
    getUser,
    insertUser,
    checkUser,
    getInfo,
    memoUpdate,
    memoDelete,
    getMemosPagenation,
    commendInsert,
    getCommend,
    getCommendCount,
    getRecommend,
    insertRecommend
}