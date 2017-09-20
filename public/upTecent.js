var fs = require('fs');
var path = require('path');
var config = require('./config');
// 腾讯云sdk配置
var COS = require('cos-nodejs-sdk-v5');

var cos = new COS({
  // 必选参数
  AppId: config.AppId,
  SecretId: config.SecretId,
  SecretKey: config.SecretKey,
  // 可选参数
  FileParallelLimit: 3,    // 控制文件上传并发数
  ChunkParallelLimit: 3,   // 控制单个文件下分片上传并发数
  ChunkSize: 1024 * 1024,  // 控制分片大小，单位 B
});

// 任务id
var TaskId;

// 获取服务
function getService() {
    cos.getService(function (err, data) {
        console.log(err || data);
    });
}

// 上传文件
function putObject(filename,filepath) {
        // 调用方法
        cos.putObject({
            Bucket: config.Bucket, /* 必须 */
            Region: config.Region,
            Key: filename, /* 必须 */
            TaskReady: function (tid) {
                TaskId = tid;
            },
            onProgress: function (progressData) {
                // console.log(JSON.stringify(progressData));
            },
            // 格式1. 传入文件内容
            // Body: fs.readFileSync(filepath),
            // 格式2. 传入文件流，必须需要传文件大小
            Body: fs.createReadStream(filepath),
            ContentLength: fs.statSync(filepath).size
        }, function (err, data) {
            if (err) {
                console.log(err);
            }
        });
    
}


module.exports = putObject