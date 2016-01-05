//数据库处理模块
var mysql = require('../config/mysql');
var db = mysql();
var moment = require('moment');
var dbContrl = {
    getType:function(req,res,next){
         var sql = 'select * from `category` ';
        db.query(sql, function(err, rows, fields) {
            res.locals.typelist = rows;
            next();
        });
    },
    //查询所有关键字新闻
    getAll: function(req, res, next) {
         var where="";
        if(req.query.keywords!==""){
            where = "where `main_title` like'%" + req.query.keywords + "%'";
        }
        var sql = 'select * from `news` '+where;
        db.query(sql, function(err, rows, fields) {
            res.locals.news = rows;
            next();
        });

    },
    //检查管理员登录
    checkAdmin: function(req, res, next) {
        var name = req.body.name;
        var password = req.body.password;
        var sql = "select *  from `admin` where `name`='" + name + "' and `password`='" + password + "'";
        db.query(sql, function(err, rows, fields) {
            res.locals.news = rows;
            next();
        });
    },
    //关键字或页码查询
    getKeyAndPage:function(req,res,next){
        var pagesize = 8;
        var pageget = req.query.page;
        var page = (pageget - 1) * pagesize;
       var where="";
       var keywords=decodeURI(req.query.keywords);
        if(keywords!==""){
            where = "where `main_title` like '%" + keywords + "%'";
        }
        //前台默认tid为1
        var sql = 'select * from `news` '+where+' order by `id` desc limit ' + page + ',' + pagesize;
        db.query(sql, function(err, rows, fields) {
            res.locals.news = rows;
            next();
        });
    },
    //读取一条新闻
    readOne: function(req, res, next) {
        var eid = req.params.eid;
        var sql = 'select * from `news` where `id`=' + eid;
        db.query(sql, function(err, rows, fields) {
            res.locals.news = rows;
            next();
        });
    },
    //删除一条新闻
    deleteOne: function(req, res, next) {
        var did = req.query.did;
        var sql = 'delete from `news` where `id`=' + did;

        db.query(sql, function(err, rows, fields) {
            if (err) {
                res.locals.flag = 0;
            } else {
                res.locals.flag = 1;
            }

            next();
        });
    },
    //删除多条
    deleteAll: function(req, res, next) {
        var listid = req.body.listid;
        var ids = listid.join(',');
        var sql = 'delete from `news` where `id` in (' + ids + ')';
        db.query(sql, function(err, rows, fields) {
            if (err) {
                res.locals.flag = 0;
            } else {
                res.locals.flag = 1;

            }
            next();
        });

    },
    //编辑
    editOne: function(req, res, next) {
        var id = req.query.id;
        var main_title2 = req.query.main_title2;
        var second_abs2 = req.query.second_abs2;
        var tid2 = req.query.tid2;
        var picture2 = "";
        if (req.query.picture2 !== "") {
            picture2 = req.query.picture2;
        }
        var link2 = "#";
        if (req.query.link2) {
            link = req.query.link2;
        }

        var sql = "UPDATE `news` SET  `main_title` =  '" + main_title2 + "' ,`second_abs`='" + second_abs2 + "',`tid`='" + tid2 + "',`picture`='" + picture2 + "',`link`='" + link2 + "' WHERE `id`='" + id + "';";
        db.query(sql, function(err, rows, fields) {
            if (err) {
                res.locals.flag = 0;
            } else {
                res.locals.flag = 1;
            }
            next();
        });
    },
    //添加
    add: function(req, res, next) {
        var main_title = req.body.main_title;
        var second_abs = req.body.second_abs;
        var tid = req.body.tid;
        var picture = req.body.picture;
        var link = '#';
        if (req.body.link) {
            link = req.body.link;
        }
        var time = moment().format('YYYY-MM-DD HH:mm:ss');
        var sqladd = "INSERT INTO `news` VALUES (' '," + tid + ",'" + main_title + "', '" + second_abs + "', '" + picture + "', '" + link + "', '" + time + "');";
        db.query(sqladd, function(err, rows, fields) {
            if (rows.insertId) {
                res.locals.flag = 1;
            }
            next();
        });


    },
    indexAPI: function(req, res, next) {
        var pagesize = 8;
        var pageget = req.params.page;
        var page = (pageget - 1) * pagesize;
        //前台默认tid为1
        var tid = req.params.tid;
        var where = 'where `tid` =' + tid;
        var sql = 'select * from `news` ' + where + ' order by `id` desc limit ' + page + ',' + pagesize;
        db.query(sql, function(err, rows, fields) {
            res.locals.news=rows;
            next();
        });
    }


}

module.exports = dbContrl;
