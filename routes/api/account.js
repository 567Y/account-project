// 将数据以接口的形式返回出去
const express = require("express");
const router = express.Router();
// 导入jwt
const jwt = require("jsonwebtoken");
// 导入数据库配置文件
const connection = require("../../config/account");

// 声明校验token中间件
const chcekTokenMiddenware = (req, res, next) => {
  // token一般登录成功以后前端都会放在请求头中
  // 所以后端写接口的时候直接从请求头中获取token 如果没有获取到那么就证明前端没有获取到token或者没有把token放到请求头中
  let token = req.get("token");
  if (!token) {
    return res.json({
      code: "2003",
      msg: "token 缺失",
      data: null,
    });
  }
  // 如果有token 就校验token是否正确
  jwt.verify(token, "yijinpeng", (err, data) => {
    if (err) {
      return res.json({
        code: "2004",
        msg: "token校验失败",
        data: null,
      });
    }
    // 保存用户信息 在请求对象中存储了一个user 里面保存的是创建token的时候存储用户信息
    req.user = data;
    next();
  });
};
// 获取所有账单数据 并返回接口
router.get("/account", chcekTokenMiddenware, function (req, res, next) {
  // console.log(req.user)
  connection.query("select * from account", (err, result) => {
    if (err) {
      return res.json({
        code: "1001",
        msg: "读取失败",
        data: null,
      });
    }
    res.json({
      code: "200",
      msg: "读取成功",
      data: result,
    });
  });
});

// 新增账单 并返回接口
router.post("/account", chcekTokenMiddenware, (req, res) => {
  connection.query("insert into account set ?", req.body, (err, result) => {
    if (err) {
      return res.json({
        code: "500",
        msg: "新增失败",
        data: null,
      });
    }
    res.json({
      code: "200",
      msg: "新增成功",
      data: result,
    });
  });
});

// 删除账单 并返回接口
router.delete("/account/remove/:id", chcekTokenMiddenware, (req, res) => {
  let id = req.params.id;
  connection.query("delete from account where id = ?", id, (err, result) => {
    if (err) {
      return res.json({
        code: "500",
        msg: "删除失败",
        data: null,
      });
    }
    res.json({
      code: "200",
      msg: "删除成功",
      // 删除条数
      data: result.affectedRows,
    });
  });
});

// 获取单个账单信息
router.get("/account/:id", chcekTokenMiddenware, (req, res) => {
  //获取 id 参数
  let id = req.params.id;
  connection.query("select * from account where id = ?", id, (err, result) => {
    if (result.length > 0) {
      res.json({
        code: "200",
        msg: "查询成功",
        data: result,
      });
    } else {
      res.json({
        code: "500",
        msg: "查询失败",
        data: null,
      });
    }
  });
});

// 更新单个账单信息
router.patch("/account/:id", chcekTokenMiddenware, async (req, res) => {
  // 获取 id 参数值
  const { id } = req.params;
  connection.query(
    "UPDATE account SET ? WHERE id = ?",[req.body, id],(err, result) => {
      // result.affectedRows更新数量 如果更新了那么就会有最少一个数据发生了改变 反之就是没更新成功
      if (result.affectedRows > 0) {
        res.json({
          code: "200",
          msg: "更新成功~~",
          data: result.affectedRows,
        });
      }else{
        res.json({
          code: "500",
          msg: "更新失败~~",
          data: null,
        });
      }
    }
  );
});

module.exports = router;
