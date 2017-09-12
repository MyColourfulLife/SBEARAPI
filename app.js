// 使用express生成一个web应用实例
var express = require("express");
var app = express();

// 使用8080端口
var port = process.env.PORT || 8080;

// 引入路由
var uploadRoute = require('./routes/uploadRoute');
// 使用路由 当访问'http.../api/upload时会走上面定义的处理函数
app.use("/api", uploadRoute);

app.listen(port); //监听端口
console.log(`服务启动在${port}端口`);
