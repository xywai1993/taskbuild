// const qiniu = require('qiniu');
import qiniu from 'qiniu';
// const path = require('path');
import path from 'path';

const failFiles: string[] = [];

import { customFile, qiniuUploadTaskParams } from './index';

// HTML文件不上传
const exFile = ['.html'];

export function qiniuUpload(files: customFile[], params: qiniuUploadTaskParams) {
    //todo: 七牛配置 根据项目自行填写 accessKey，secretKey
    const accessKey = params.accessKey;
    const secretKey = params.secretKey;
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const options = {
        scope: 'image',
    };
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken = putPolicy.uploadToken(mac);

    const config = new qiniu.conf.Config();
    // 空间对应的机房
    // config.zone = qiniu.zone.Zone_z2;
    const formUploader = new qiniu.form_up.FormUploader(config);
    const project_dir_name = params.publicName;

    /**
     * 七牛上传
     * @param {object} file 待上传文件
     * @param {string} project_dir_name 项目名
     */
    function Upload(file: customFile, project_dir_name: string, uploadToken: string, putExtra: any) {
        if (exFile.indexOf(file.extname) !== -1) {
            return;
        }

        var localFile = file.from;

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
        });

        // return content;
    }

    files.forEach((item) => {
        const putExtra = new qiniu.form_up.PutExtra();
        Upload(item, project_dir_name, uploadToken, putExtra);
    });
}

// module.exports = qiniuUpload;
