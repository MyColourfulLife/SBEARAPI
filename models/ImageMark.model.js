var mongoose = require('mongoose')
var Schema = mongoose.Schema

/**
 * fileName: 文件名
 * deviceType：设备类型
 * deviceName: 设备名称
 * fileSize:文件尺寸 宽高
 * createDate：创建日期
 * markFrame: 标注信息
 * remoteUrl: 文件远程连接
 */
var MarkSchema = new Schema({
    fileName: {
        type:String,
    },
    deviceType: {
        type:String,

    },
    deviceName:{
        type:String,

    },
    fileSize:{
        type:String,

    },
    createTime:{
        type:String,

    },
    markFrame:{
        type:String,

    },
    remoteUrl:{
        type:String,

    },
    deviceUUID:{
        type:String,

    },
    date:{
        type:Date,
        default:Date.now
    }
  });
MarkSchema.index({fileName:1})
  // mongoose.model 表示实例化Schema
module.exports = mongoose.model('Mark', MarkSchema);