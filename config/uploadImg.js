/** 
*
*  @author: Mr_Wei 
*  @version: 1.0.0 
*  @description: 封装上传图片方法
*  @Date: 2019/10/16 08:35
*
*/ 

const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const formatTime = require('silly-datetime');

/* 图片上传 */
module.exports = (req, res) => {
    let form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = path.join(__dirname, '../static/poster');
    form.keepExtensions = true;
    form.maxFieldsSize = 5 * 1024 *1024;
    form.parse(req, (err, fields, files) => {
        let file = files.file;
        /* 如果出错，则拦截 */
        if(err) {
            return res.status(500).json({status: "500", result: '服务器内部错误'});
        }
        if(file.size > form.maxFieldsSize) {
            fs.unlink(file.path);
            return res.status(412).json({status: "412", result: '图片不能超过5M'});
        }

        let extName = '';

        switch (file.type) {
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;
            case 'image/jpg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;
        }
        if(extName.length == 0) {
            return res.status(412).json({status: "412", result: '只支持jpg和png格式图片'});
        }

        /* 拼接新的文件名 */
        let time = formatTime.format(new Date(), 'YYYYMMDDHHmmss');
        let num = Math.floor(Math.random() * 8999 + 10000);
        let imageName = `${time}_${num}.${extName}`;
        let newPath = form.uploadDir + '/' + imageName;

        fs.rename(file.path, newPath, (err) => {
            if(err) {
                return res.status(412).json({status: "412", result: '图片上传失败'});
            } else {
                return res.send({'status': 200, 'msg': '图片上传成功', result: {poster: imageName}});
            }
        })
    })
};
