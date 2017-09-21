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
var bodyParser = require('body-parser')


// 引入上传图片的方法
var upTecent = require('../public/upTecent');
var baseTecentPath = "http://labeluploads-1254220375.cosgz.myqcloud.com/";

var mongoose = require("mongoose");
var Mark = require("../models/ImageMark.model");
Mark.ensureIndexes({"fileName":1},(err)=>{
  if (err) {
    console.log('索引创建失败',err.message);
  }
})
mongoose.Promise = require('bluebird');

// 数据库名

var testENV = false;//测试环境默认为真，如果是false则为生产环境
var loacalTest = "127.0.0.1";
var remoteTest = "192.168.1.180";

var host = testENV ? remoteTest: "120.76.102.238";
var port = 27017;
var username = "idbear_mongodb";
var password = testENV ? "idbear_2015_mongodb_test" : "Ca!!6Xei#5zidae$6aer%ai7u_Yo@4ee";
var database = "idbear";

var db_url = `mongodb://${host}:${port}/${database}`;
// 链接mongodb 非本地测试用 使用本地测试时 注释下面代码
mongoose.connect(db_url,{user:username,pass:password,useMongoClient:true})

// 链接mongodb 本地测试 生产环境注释下面代码
// mongoose.connect(db_url);

mongoose.connection.on("connected", () => {
  console.log(`Mongoose connection  open to ${database}`);
});

mongoose.connection.on("error", err => {
  console.log(`Mongoose connection error ${err}`);
});

mongoose.connection.once("open", () => {
  console.log("数据库启动了");
});

/**
 * 获取所有的文件信息
 */
router.get('/files',(req,res)=>{
  Mark.find({}).exec().then(files=>{
    res.json({
      code:1,
      data: files
    });
  }).catch(err=>{
    res.json({
      code : 0,
      message: err.message
    });
  });
 
});

/**
 * 根据文件名称获取文件信息
 */
router.get('/fileInfo/:fileName',(req,res)=>{
Mark.find({
  fileName:req.params.fileName
}).exec((err,file)=>{
  if (err) {
    res.json({
      code:0,
      message:err.message
    });
    return;
  } 

  res.json({
    code:1,
    data:file
  });

});
});

/**
 * 获取uuid字段下的所有文件
 */
router.get('/filesByUUID/:uuid',(req,res)=>{

Mark.find({
  deviceUUID:req.params.uuid
}).exec((err,files)=>{

  if (err) {
    res.json({
      code:0,
      message:err.message
    });
    return;
  } 

  res.json({
    code:1,
    data:files
  });


});


});







// 上传文件的接口
router.post("/upload", (req, res) => {
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

  // 允许多个文件上传
  form.multiples = true;

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

    // 单张和多张图片上传 约定参数为file
    // 多张
    if (Array.isArray(files.file)) {
      files.file.forEach(function(file) {
        changeFileName(file);
        
        saveFields(fields);
      }, this);

      res.json({
        code:1,
        data:`${files.file.length} 个文件上传成功`
    });

    } else {
      // 单张
      changeFileName(files.file);
      saveFields(fields);
      res.json({
        code:1,
        data:`${files.file.name} 上传成功`
    });

    }
  });

});

// cb为回调函数，修改错误时，返回修改错误的文件名
changeFileName = (file, cb) => {
  var oldPath = file.path;
  var newPath = path.join(path.dirname(oldPath), file.name);
  fs.rename(oldPath, newPath, (err) => {
    if (err) {
      console.log(err.message);
    } else {
      upTecent(file.name,newPath);
    }
  });
};

// 存入数据库
saveFields = (fields)=>{
  if (!fields) {
    console.log('nothing to save');
    return;
  }

  Mark.update({fileName:fields.fileName},{
    $set:{
      fileName : fields.fileName,
      deviceType : fields.deviceType,
      deviceName : fields.deviceName,
      fileSize : fields.fileSize,
      createTime : fields.createTime,
      markFrame : fields.markFrame,
      remoteUrl : baseTecentPath + fields.fileName,
      deviceUUID  : fields.uuid,
      date:Date.now
    }
  },{upsert:true},(err,res)=>{
    if (err) {
      console.log(err.message);
    }
    if (res) {
      // console.log(res);
    }

  })
}


module.exports = router;
