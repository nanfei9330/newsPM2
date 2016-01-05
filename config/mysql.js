/****数据库连接*******/
var mysql=require('mysql');
var config=require('./config.js');
module.exports=function(){
	var db=mysql.createConnection(config.mysql);
	db.connect();

	return db;
};

