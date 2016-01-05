 function ck() {
     var name = $('#username').val();
     var password = $('#password').val();
     //如果用户名为空
     if (name == "") {
         $('.loginmsg').text("用户名不为空!");
         $('.loginmsg').show();
         return false;
     }
     //如果密码为空
     if (password == "") {
         $('.loginmsg').text("密码不为空!");
         $('.loginmsg').show();
         return false;
     }
     //如果用户名和密码不为空，则检查数据库是否存在此记录
     if (name !== "" && password !== "") {
         var result;
         $.ajax({
             url: "/admin/logincheck/",
             type: "post",
             data: {
                 name: name,
                 password: password
             },
             async: false,
             success: function(flag) {
                console.log(flag);
                 if(flag.length!==1){
                     result = "no";
                 }
             }
         });
         //如果数据库不存在，则登录失败
         if (result == "no") {
             $('.loginmsg').text("用户名或密码错误!");
             $('.loginmsg').show();
             return false;
         } else {
           sessionStorage.setItem("admin","1");
           location.href="/admin/";
           //原想post这里为true调整到首页的，改get这里用false先
             return false;            
         }

     }
 }
