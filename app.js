// 使用express生成一个web应用实例
var express = require("express");
var app = express();

// 使用8080端口
var port = process.env.PORT || 7070;

var bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// 引入路由
var uploadRoute = require('./routes/uploadRoute');
// 使用路由 当访问'http.../api/upload时会走上面定义的处理函数
app.use("/api", uploadRoute);

app.listen(port); //监听端口
console.log(`服务启动在${port}端口`);
