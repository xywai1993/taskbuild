//const { sh, cli } = require("tasksfile");

/**
 * 部署文件———— 图片上传，文件转移等
 * @author yiper.fan 2020年11月06日19:59:08
 */

const { settings } = require('cluster');
const { readdir, copyFileSync, existsSync, mkdirSync, rmdirSync } = require('fs');
const { join } = require('path');
const path = require('path');
const qiniuUpload = require('./qiniuUpload');

// 目标文件夹
const deployTo = './targetDir';
//待转移的文件夹
const srcDeployTo = './dist';

/**
 * 删除并且重新创建文件夹
 *@param {string} dir 文件夹路径
 */
function cleanAndRemark(dir) {
    // sh(`rm -rf ${deployTo}`);
    rmdirSync(dir, { recursive: true });
    console.log(`${dir},删除成功`);
    mkdirSync(dir);
    console.log(`${dir},创建成功`);
}

/**
 * 移动文件到部署目录
 * @param {*} file 待移动的文件
 * @param {*} deployTo 部署目录
 */
function moveDeploy(file, deployTo) {
    const to = path.join(deployTo, file.release);
    if (file.isDir && !existsSync(to)) {
        mkdirSync(to);
    } else {
        copyFileSync(file.from, to);
        console.log(`success: from:${file.from}--->to:${to}`);
    }
}

function main(settings) {
    const settingFn = settings.fnList;

    if (settingFn.move) {
        cleanAndRemark(settings.moveTo);
    }

    if (settingFn.htmlMove) {
        cleanAndRemark(settings.htmlMoveTo);
    }
    // 主程序
    scanFile(settings.dist);

    /**
     * 深度扫描文件
     * @param {string} from  待扫描文件夹目录
     * @param {Object<Function>} 回调函数
     */
    function scanFile(from) {
        //读取文件属性
        readdir(from, { withFileTypes: true }, (err, files) => {
            files.forEach((item) => {
                const name = item.name;
                const fromUrl = path.join(from, name);

                const file = {
                    name: item.name,
                    basename: item.name,
                    from: fromUrl,
                    // to: toUrl,
                    release: path.relative(settings.dist, fromUrl),
                    extname: path.extname(name),
                };
                if (item.isDirectory()) {
                    file.isDir = true;
                    scanFile(fromUrl);
                } else {
                    file.isDir = false;

                    // 上传文件
                    if (settingFn.upload) {
                        settings.fnList.upload.call(null, file, settings);
                    }
                }

                // 移动文件
                if (settingFn.move) {
                    settings.fnList.move.call(null, file, settings);
                }

                //转移HTML
                if (settingFn.htmlMove) {
                    if (file.extname === '.html') {
                        settings.fnList.htmlMove.call(null, file, settings);
                    }
                }
            });
        });
    }
}
// console.log(__dirname);
main({
    dist: path.join(__dirname, '../dist'), // 源目标目录
    moveTo: path.join(__dirname, '../targetDir'), // 转移到哪里
    htmlMoveTo: path.join(__dirname, '../htmlTargetDir'), // HTML部署目录
    qiniuName: 'test', // 七牛上传文件前缀名 注意：必须与构建工具的base参数相同
    fnList: {
        // 下面不需要的方法请注释掉，否则会执行相应的方法
        move: (file, settings) => {
            moveDeploy(file, settings.moveTo);
        },
        htmlMove: (file, settings) => {
            moveDeploy(file, settings.htmlMoveTo);
        },
        upload: (file, settings) => {
            qiniuUpload(file, settings.qiniuName);
        },
    },
});
