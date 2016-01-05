//跟PHP+Mysql想比，修改了异步接口
$(document).ready(function() {
    //页码
    var page = 1;

    //每页显示条数，修改请同步newsapi.php
    var pagesize = 8;
    var $listbox = $(".list-item ul");
    //替换模板对应数据
    String.prototype.temp = function(obj) {
        return this.replace(/\$\w+\$/gi, function(matchs) {
            var returns = obj[matchs.replace(/\$/g, "")];
            return (returns + "") == "undefined" ? "" : returns;
        });
    };


    //新闻读取方法
    var readnews = function(tid, page) {
            var newList = "";
            var newTemp = "";
            $(".refresh").attr("data-tid", tid);
            $(".navigator li a").removeClass("on");
            $(".navigator li a[data-tid='" + tid + "']").addClass("on");
            //读取新闻api
            $.ajax({
                url: "/newsapi/" + tid + "&" + page,
                type: "get",
                dataType: "json",
                async: false,
                beforeSend: function() {
                    $(".load").show();
                },
                success: function(data) {
                    defaultIfShowMore(data.length);
                    $.each(data, function(index, value) {
                        //有图片的选择模板1，没图片的选择模板2
                        var tplnum = choseNewsTemp(value.picture);
                        if (tplnum == 1) {
                            newTemp = $("#temparea1").val();
                        } else {
                            newTemp = $("#temparea2").val();
                        };

                        //相距时间输出
                        value.time = getDifferTime(value.time);
                        //新闻数据整合
                        newList += newTemp.temp(value);
                    });
                },
                complete: function() {
                    $(".load").hide();
                }
            });

            //新闻数据添加到对应层
            $listbox.append(newList);
        }
        //判断使用哪个模板，返回模板id
    var choseNewsTemp = function(pic) {
        var tplnum = 1;
        if (pic == "") {
            tplnum = 2;
        }
        return tplnum;
    };
    //是否显示加载更多按钮
    function defaultIfShowMore(num) {
        if (num < pagesize) {
            $(".refresh").hide();
        } else {
            $(".refresh").show();
        }
    }

    //相距时间
    function getDifferTime(t) {
        var nowtime = Date.parse(new Date());
        nowtime = nowtime / 1000;
        var addtime = Date.parse(new Date(t));
        addtime = addtime / 1000
        var intervalTime = Math.floor((nowtime - addtime) / 60);
        var intervalShow = "";
        if (intervalTime < 60) {
            intervalShow = intervalTime + "分钟";
        } else if (intervalTime > 60) {
            intervalShow = Math.floor(intervalTime / 60) + "小时";
        }
        return intervalShow;
    }

    //导航点击事件
    $(".navigator li a").click(function() {
        var tid = $(this).attr("data-tid");
        //每切换一次分类，先清空一次容器，页码归1

        $listbox.html("");
        page = 1;
        readnews(tid, page);
    });

    //加载更多按钮点击事件
    $(".refresh").click(function() {
        var tid = $(this).attr("data-tid");
        page++;
        readnews(tid, page);
    });

    //默认加载第一分类第page页
    readnews(1, page);
});
