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

function insertMemo(content, title, name){
    connection.query(`INSERT INTO board (content, date, name, title) VALUES ('${content}',NOW(),'${name}', '${title}')`);
}

function getMemo(title, value, callback){
    connection.query(`SELECT num, title, name, date, content FROM board WHERE title = '${title}' && num = '${value}';`, (err, rows, fields) => {
        if(err) throw err;
        callback(rows);
    });
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

module.exports = {
    getAllMemos,
    insertMemo,
    getMemo,
    getUser,
    insertUser,
    checkUser,
    getInfo,
    memoUpdate,
    memoDelete
}