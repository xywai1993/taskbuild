const qiniu = require('qiniu');
const path = require('path');

//todo: 七牛配置 根据项目自行填写 accessKey，secretKey
const accessKey = 'MOuxWdctTtaTqJCk-2Sx_ZDtthDr8I3CNHgYmTGm';
const secretKey = 'A9K6nk1bfd_eWAINPOfsXnCoKgbXfRgc5HsdUegZ';
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
const options = {
    scope: 'image',
};
var putPolicy = new qiniu.rs.PutPolicy(options);
var uploadToken = putPolicy.uploadToken(mac);

const config = new qiniu.conf.Config();
// 空间对应的机房
config.zone = qiniu.zone.Zone_z2;

const failFiles = [];
const exFile = ['index.html'];

/**
 * 七牛上传
 * @param {object} file 待上传文件
 * @param {string} project_dir_name 项目名
 */
function qiniuUpload(file, project_dir_name) {
    console.log(file);
    if (exFile.indexOf(file.basename) !== -1) {
        return;
    }

    var localFile = file.from;

    var formUploader = new qiniu.form_up.FormUploader(config);
    var putExtra = new qiniu.form_up.PutExtra();
    var key = path.join(project_dir_name, file.release);
    // 文件上传
    formUploader.putFile(uploadToken, key, localFile, putExtra, function (respErr, respBody, respInfo) {
        if (respErr) {
            throw respErr;
        }
        if (respInfo.statusCode == 200) {
            console.log(respBody);
        } else {
            failFiles.push(file.basename);
        }
        console.log('上传失败的', failFiles);
    });

    // return content;
}

module.exports = qiniuUpload;
