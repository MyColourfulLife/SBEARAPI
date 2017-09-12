//生成express创建路由
var express = require("express");
// 创建一个路由对象
var router = express.Router();
// 使用使用formidable 处理文件类的请求
var formidable = require("formidable");
// 使用path 路径拼接等
var path = require("path");
// 使用fs来处理文件
var fs = require("fs");

// 提供一个接口
router.post("/upload", (req, res) => {
  console.log("收到文件上传请求");

  // 使用formidable 处理收到的文件请求
  var form = new formidable.IncomingForm();
  // 配置参数
  form.encoding = "utf-8";
  // 设置文件存储路径
  form.uploadDir = "./images";
  // 保留后缀名
  form.keepExtensions = true;
  // 设置单个文件大小限制
  form.maxFieldsSize = 5 * 1024 * 1024;

  // 解析请求 存储图片
  form.parse(req, (err, fields, files) => {
    //错误处理
    if (err) {
      res.json({
        code: 0,
        message: `${err.message}`
      });
      return;
    }

    // 文件为空处理
    if (!files || Object.keys(files).length === 0) {
      res.json({
        code: 0,
        message: `文件不能为空`
      });
      return;
    }

    //   修改文件名
    var oldPath = files.file.path;
    var newPath = path.join(form.uploadDir, files.file.name);
    fs.rename(oldPath, newPath, err => {
      if (err) {
        console.log(err.message);
        return;
      }
      // 修改名称成功
    });

    res.json({
      code: 1,
      message:`${files.file.name} 上传成功`
    });
  });
});

module.exports = router;