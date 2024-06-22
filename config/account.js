// 导入mysql
const mysql = require("mysql");

// 创建配置连接
module.exports = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"123456",
    database:"account_manager"
})


