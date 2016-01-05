//模块
var express=require('express');
var path=require('path');
var app=express();
var bodyParser = require('body-parser');
var home=require('./routes/index');
var admin=require('./routes/admin');

//模板引擎设置
app.set('view engine','ejs');
app.set('views',__dirname + '/views');
app.use(express.static('public'));
app.use(express.static(__dirname));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
    extended: true
})); // for parsing application/x-www-form-urlencoded

//设置路由
app.use('/',home);
app.use('/admin',admin);



//404处理
app.use(function(req, res) {
  res.status(404).send('Sorry,we cant find the page');
});




app.listen(8888);
module.exports = app;
console.log("启动端口：8888");

/*
任务9作业：版本3
主要在用户体验上优化，修复中文搜索问题，编辑错误返回的提示
*/