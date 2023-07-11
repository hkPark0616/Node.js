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

module.exports = {
    getAllMemos,
    insertMemo,
    getMemo,
    getUser,
    insertUser
}