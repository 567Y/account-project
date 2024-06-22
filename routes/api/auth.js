const express = require("express");
const router = express.Router();
// 导入密码加密包
const md5 = require("md5");
// 导入jwt
let jwt = require("jsonwebtoken");
// 导入数据库配置文件
const connection = require("../../config/account");

//   登录操作
router.post("/login", async (req, res) => {
  // 获取在请求体中传的用户名和密码
  let { username, password } = req.body;
  // 把登录的密码也加密 与数据库里面加密的密码做对比 一样就登录成功
  connection.query("select * from login where username=? and password = md5(?)",[username, password],(err, result) => {
      if (result.length > 0) {
        //设置session信息 session信息如果与数据库做了连接 那么会将这些信息保存在数据库中
        // 登录成功以后session也会返回在响应请求头中利用Set-Cookie返回一个s_id作为用户的唯一标识
        req.session.username = req.body.username;
        // 创建(生成)token
        // sign方法内的数据是存放在token中的用户信息 用户登录成功以后要将数据返回给用户 所以里面一般存储用户信息
        // jwt.sign(数据, 加密字符串, 配置对象)
        const token = jwt.sign({
            username:result.username
        },'yijinpeng',{
            expiresIn:60 * 60 * 24 * 7//token过期时间 这里设置了七天
        })
        res.json({
            code:"200",
            msg:"登录成功",
            data:token
        })
      } else {
        res.json({
            code:"500",
            msg:"登录失败,账号或密码错误",
            data:null
        })
        return;
      }
    }
  );
});

// 退出登录
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.render("success", { msg: "退出成功", url: "/login" });
  });
});
// 暴露
module.exports = router;
