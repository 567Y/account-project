var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// 引入 express-session MySQLStore  MySQLStore是让session和mysql数据库做连接 返回的session信息存入到数据库中
const session = require("express-session");
const MySQLStore = require('express-mysql-session')(session);
// 导入路由
const indexRouter = require('./routes/web/index');
const accountRouter = require("./routes/api/account");
const authRouter = require("./routes/web/auth");
const authApiRouter = require("./routes/api/auth")


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
// 全局使用bodyParser获取请求体数据
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// 访问public文件夹下面的静态资源
app.use(express.static(path.join(__dirname, 'public')));

// 设置mysql的配置项 与session做连接
const options = {
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '123456',
	database: 'account_manager'
};

const sessionStore = new MySQLStore(options);
// session中间件
app.use(session({
	key: 'sid',
	secret: 'yijinpeng',
	store: sessionStore,
	resave: false,
	saveUninitialized: false
}));

// 测试session是否成功连接mysql数据库
// Optionally use onReady() to get a promise that resolves when store is ready.
sessionStore.onReady().then(() => {
	// MySQL session store ready for use.
	console.log('MySQLStore ready');
}).catch(error => {
	// Something went wrong.
	console.error(error);
});















app.use('/', indexRouter);
app.use("/",authRouter);
app.use("/api",accountRouter);
app.use("/api",authApiRouter)

//404页面
app.use(function(req, res, next) {
    res.render("404")
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
