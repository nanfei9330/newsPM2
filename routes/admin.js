var express = require('express');
var router = express.Router();
var dbControl = require('../lib/dbControl');


//后台首页
router.get('/', function(req, res, next) {
    res.render('admin');
});



//登录页
router.get('/login', function(req, res, next) {
    res.render('login');
});

//登录检查

router.post('/logincheck', dbControl.checkAdmin, function(req, res, next) {
    res.send(res.locals.news);
});

//搜索接口
router.get('/api', dbControl.getKeyAndPage, function(req, res, next) {
    res.send(res.locals.news);
});

//默认页码总数查询
router.get('/page', dbControl.getAll, function(req, res, next) {
    res.send(res.locals.news);
});

//删除执行，成功删除则返回首页
router.get('/del/', dbControl.deleteOne, function(req, res, next) {
    res.json({
        success: res.locals.flag
    });
});

//批量删除执行，成功则返回首页
router.post('/deleteall/', dbControl.deleteAll, function(req, res, next) {
    if (res.locals.flag == 1) {
        res.redirect('/admin/');
    }
});

//编辑查询
router.get('/searchid/:eid', dbControl.readOne, function(req, res, next) {
    res.send(res.locals.news);
});

//编辑执行
router.get('/edit/', dbControl.editOne, function(req, res, next) {
    res.json({
        success: res.locals.flag
    });
});

//添加--添加成功则返回首页
router.post('/add/',dbControl.add, function(req, res, next) {
    if (res.locals.flag == 1) {
        res.render('tips', {
            say: "新闻添加成功"
        });
    }


});







module.exports = router;
