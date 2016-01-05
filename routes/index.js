var express = require('express');
var router = express.Router();
var dbControl = require('../lib/dbControl');



//引入模板并加载分类

router.get('/' ,dbControl.getType,function(req, res, next) {
    var typelist=res.locals.typelist;
     res.render('news',{typelist:typelist});

});

//前台新闻数据接口
router.get('/newsapi/:tid&:page', dbControl.indexAPI, function(req, res, next) {
    res.send(res.locals.news);
});



module.exports = router;
