const qiniu = require('qiniu');
const { project_dir_name, localHtmlPath, localPath } = require('./project.config');
//todo html文件发布目录 根据项目自行填写

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

const fialFiles = [];
const exFile = ['index.html'];
function upload(content, file, settings) {
    // console.log(content, file, settings);
    //console.log(file);
    if (exFile.indexOf(file.basename) !== -1) {
        return content;
    }

    var localFile = file.fullname;
    console.log('file.release', file.release, 'file.url:', file.url);
    var formUploader = new qiniu.form_up.FormUploader(config);
    var putExtra = new qiniu.form_up.PutExtra();
    var key = project_dir_name + file.url;
    // 文件上传
    formUploader.putFile(uploadToken, key, localFile, putExtra, function (respErr, respBody, respInfo) {
        if (respErr) {
            throw respErr;
        }
        if (respInfo.statusCode == 200) {
            console.log(respBody);
        } else {
            console.log(respInfo.statusCode);
            console.log(respBody);
            fialFiles.push(file.basename);
        }
        console.log('上传失败的', fialFiles);
    });

    return content;
}

fis.media('prod')

    .match('/dist/*.html', {
        release: '$1',
        // domain: 'https://image.douba.cn/kmzs',
        deploy: fis.plugin('local-deliver', {
            to: localHtmlPath,
        }),
    })
    .match('/dist/(**)', {
        release: '$1',
        // url: 'https://image.douba.cn/kmzs/',
        // domain: 'https://image.douba.cn/kmzs',
        postprocessor: upload,
    });

//开发环境发布
fis.media('dev').match('/build/(**)', {
    release: '$1',
    // domain: 'https://image.douba.cn/kmzs',
    deploy: fis.plugin('local-deliver', {
        to: localPath,
    }),
});
// .match('/build/(**)', {
//     release: '$1',
//     // url: 'https://image.douba.cn/kmzs/',
//     // domain: 'https://image.douba.cn/kmzs',
//     postprocessor: upload
// });

// .match('*.css', {
//     preprocessor: fis.plugin('cssnext', {
//         sourceMap: false // 默认
//     }),
//     optimizer: fis.plugin('clean-css')
// })
// .match('{问题.md,package.json,package-lock.json}', {
//     release: false
// })
// .match('*', {
//     deploy: fis.plugin('local-deliver', {
//         to: deployTo
//     })
// })
// .match('::package', {
//     postpackager: fis.plugin('loader')
// });
