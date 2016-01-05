$(document).ready(function() {
    if (sessionStorage.getItem("admin") !== "1") {
        location.href = "/admin/login/";
    }
    //网上拿的，获取url参数
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
    //从老师处摘取的
    var $_GET = (function() {
        var url = window.document.location.href.toString();
        var u = url.split("?");
        if (typeof(u[1]) == "string") {
            u = u[1].split("&");
            var get = {};
            for (var i in u) {
                var j = u[i].split("=");
                get[j[0]] = j[1];
            }
            return get;
        } else {
            return {};
        }

    })();


    //获取url参数page
    var page = 1;
    var pagesize = 8;
    if (getQueryString("page")) {
        page = getQueryString("page");
    }
    $("#page").val(page);

    //每页显示条数，修改请同步newsapi.php
    var keywords = "";
    if (getQueryString("keywords")) {
        keywords = ($_GET["keywords"]);
    }
    var $listbox = $("#listbody");
    //替换模板对应数据
    String.prototype.temp = function(obj) {
        return this.replace(/\$\w+\$/gi, function(matchs) {
            var returns = obj[matchs.replace(/\$/g, "")];
            return (returns + "") == "undefined" ? "" : returns;
        });
    };

    //新闻读取
    var readnews = function(keywords, page) {
        var newList = "";
        var newTemp = $("#trtpl").val();;
        //读取新闻api
        $.ajax({
            url: "/admin/api/",
            type: "get",
            dataType: "json",
            data: {
                page: page,
                keywords: keywords
            },
            async: false,
            success: function(data) {
                $.each(data, function(index, value) {
                    //新闻数据整合
                    value.time = showTime(value.time);
                    value.typename = returnTypeName(value.tid);
                    newList += newTemp.temp(value);
                });
            }
        });

        //新闻数据添加到对应层
        $listbox.html(newList);
    };
    /************************数据处理*****************************/

    //分类tid处理
    function returnTypeName(tid) {
        var typename = "";
        switch (tid) {
            case 1:
                typename = "社会";
                break;
            case 2:
                typename = "百家";
                break;
            case 3:
                typename = "本地";
                break;
            case 4:
                typename = "娱乐";
                break;
        }
        return typename;
    }

    //格式处理
    function showTime(t) {
        var addtime = Date.parse(new Date(t));
        return new Date(parseInt(addtime)).toLocaleString();
    }



    /***********************页码处理***************************/

    //页码启动以及点击事件
    function writePage(num) {
        $(".tcdPageCode").createPage({
            pageCount: num,
            current: 1,
            backFn: function(p) {
                readnews(keywords, p);
            }
        });
    }

    //页码初始化
    function startPage() {
        $.ajax({
            url: "/admin/page/",
            type: "get",
            dataType: "json",
            data: {
                keywords: keywords
            },
            async: false,
            success: function(data) {
                var p = Math.ceil(data.length / pagesize);
                writePage(p);
            }
        });
    }

    /***********************初始化***************************/
    //默认内容加载
    readnews(keywords, page);
    //分页栏加载
    startPage();


    /**********************新闻删除************************/
    //全选全不选
    $(".chk_all").click(function() {
        $("input[name='listid[]']").prop("checked", this.checked);
    });


    //删除多条
    $("#delbtn").click(function() {
        var checknum = $("input[name='listid[]']:checked").length;
        if (checknum > 0) {
            return msg();
        } else {
            alert("没选中删除项!");
            return false;
        }
    });

    //删除时对话框
    function msg() {
        var gnl = confirm("你真的确定要删除吗?");
        if (gnl == true) {
            return true;
        } else {
            return false;
        }
    };

    //删除单条    
    $(document).on("click", ".delete", function() {
        var did = $(this).attr("data-did");
        var r = "";
        if (msg()) {
            $.ajax({
                url: "/admin/del/",
                type: "get",
                data: {
                    did: did
                },
                async: false,
                success: function(data) {
                    if (data.success == 1) {
                        location.href = "/admin/";
                    }
                },
                error: function(data) {
                    alert("未知错误删除失败！");
                }
            });
        };
    });


    /**********************新闻编辑************************/
    //编辑读取
    $(document).on("click", ".edit", function() {
        $("#editnews .alert").hide();
        //显示编辑层
        $('a[href="#editnews"]').tab('show');
        var eid = $(this).attr("data-eid");
        //读取数据
        $.ajax({
            url: "/admin/searchid/" + eid,
            type: "get",
            dataType: "json",
            async: false,
            success: function(data) {
                $.each(data, function(index, value) {
                    $("input[name='id']").val($(value).attr("id"));
                    $("input[name='main_title2']").val(value.main_title);
                    $("input[name='second_abs2']").val(value.second_abs);
                    $(".selector").find("option[value='" + value.tid + "']").attr("selected", true);
                    $("input[name='picture2']").val(value.picture);
                    $("input[name='link2']").val(value.link);
                });
            }
        });
    });

    //编辑
    $("#editbtn").click(function() {
        var id = $("#editform input[name='id']").val();
        var main_title2 = $("#editform input[name='main_title2']").val();
        main_title2=main_title2.replace("\'","\"");
        var second_abs2 = $("#editform input[name='second_abs2']").val();
        second_abs2=second_abs2.replace("\'","\"");
        var tid2 = $("#editform select[name='tid2']").val();
        var picture2 = $("#editform input[name='picture2']").val();
        var link2 = $("#editform input[name='link2']").val();
        $.ajax({
            url: '/admin/edit/',
            type: "get",
            async: false,
            data: {
                id: id,
                main_title2: main_title2,
                second_abs2: second_abs2,
                tid2: tid2,
                picture2: picture2,
                link2: link2
            },
            success: function(data) {
                if (data.success == 1) {
                    $("#editnews .alert-success").show();
                } else {
                    $("#editnews .alert-danger").show();
                }
            },
            error: function() {
                $("#editnews .alert-alert-danger").show();
            }
        });
    });

    $("#newstab").click(function() {
        location.href = "/admin/";
    });


});
