var express = require('express');
var router = express.Router();
// 导入数据库配置文件
const connection = require("../../config/account")

// 连接到数据库
connection.connect((err)=>{
    if(err){
        console.log("连接失败:"+err.stack);
        return;
    }
    console.log("已连接，连接ID:"+connection.threadId)
});

// 检测是否登录的中间件
const checkIsLoginMiddleware = (req,res,next)=>{
  // 判断session中是否保存了用户登录的用户名 如果没有证明没有登录
    if(!req.session.username){
      return res.redirect("/login")
    }
    next();
}

const moment = require("moment");

router.get("/",(req,res)=>{
  res.redirect("/account")
})

// console.log(moment(new Date()).format("YYYY-MM-DD"))
router.get('/account',checkIsLoginMiddleware,(req, res)=> {
  // 将数据库的数据呈现在页面上
  connection.query("select * from account",(err,result,fields)=>{
    if(err){
      res.status(500).send("查询失败");
      return
    }
    // console.log(result);
    res.render("list",{accounts:result,moment:moment});
    
})
});

router.get('/account/create',checkIsLoginMiddleware,(req,res,next)=>{
  res.render("create")
})

router.post('/account',checkIsLoginMiddleware, (req, res)=> {
  // 添加事项 将数据添加到数据库中 req.body 可以获取请求体中的数据 通过body-parser包 
  connection.query('INSERT INTO account SET ?', req.body, (err, result) => {
    if (err) {
      res.status(500).send("添加失败");
      return
    }
    res.render("success",{msg:"添加成功",url:"/account"});
  });
});

// 删除数据
router.get("/account/:id",checkIsLoginMiddleware,(req,res)=>{
  // 获取在url的字符串参数
  const {id} = req.params
  connection.query("delete from account where id = ?",id,(err,result)=>{
    if(err){
      res.status(500).send("删除失败");
      return
    }
    res.render("success",{msg:"删除成功",url:"/account"})

  })
})

module.exports = router;
