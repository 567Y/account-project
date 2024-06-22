const express = require('express');
const router = express.Router();
// 导入密码加密包
const md5 = require("md5");
// 导入jwt
const jwt = require("jsonwebtoken");

// 导入数据库配置文件
const connection = require("../../config/account")
// 注册页面
router.get('/reg',(req,res)=>{
    // 渲染页面访问auth/reg.ejs文件
   res.render("auth/reg")
})


//注册用户操作
router.post('/reg', async (req, res) => {
    // 用户注册给密码加密
    connection.query("insert into login values( ?,md5(?))",[req.body.username,req.body.password],(err,result)=>{
        if(err){
            res.status(500)
            res.render("err",{msg:"注册失败",url:"/reg"})
            return;
        }
        res.render("success",{msg:"注册成功",url:"/login"})
    })
  });


//   登录页面
router.get("/login",(req,res)=>{
    res.render("auth/login")
})
//   登录操作
router.post("/login", (req,res)=>{
    // 获取在请求体中传的用户名和密码
    let {username,password} = req.body;
                                            // 把登录的密码也加密 与数据库里面加密的密码做对比 一样就登录成功
    connection.query("select * from login where username=? and password = md5(?)",[username,password],(err,result)=>{
       
        if(result.length >0){
            //设置session信息 session信息如果与数据库做了连接 那么会将这些信息保存在数据库中
            // 登录成功以后session也会返回在响应请求头中利用Set-Cookie返回一个s_id作为用户的唯一标识
            req.session.username = req.body.username;
            res.render("success",{msg:"登录成功",url:"/account"})
        }else{
            res.status(500)
            res.render("err",{msg:"账号或密码错误",url:"/login"})
            return;
        }
    })
})

// 退出登录
router.get("/logout",(req,res)=>{
    req.session.destroy(()=>{
        res.render("success",{msg:"退出成功",url:"/login"});
    })
})
// 暴露
module.exports = router;
