//const { sh, cli } = require("tasksfile");
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
        console.log(`success:  filename:${file.name} ## from:${file.from}--->to:${to}`);
    }
}

function main(settings) {
    cleanAndRemark(settings.moveTo);
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
                // console.log(item);

                const name = item.name;
                const formUrl = path.join(from, name);
                // const toUrl = path.join(to, name);

                // const r = RegExp(`^${settings.dist}\/`);
                // console.log(r, formUrl.replace(r, ''));
                // console.log(path.relative(settings.dist, formUrl));
                const file = {
                    name: item.name,
                    basename: item.name,
                    from: formUrl,
                    // to: toUrl,
                    release: path.relative(settings.dist, formUrl),
                    extname: path.extname(name),
                };
                if (item.isDirectory()) {
                    file.isDir = true;
                    scanFile(formUrl);
                } else {
                    file.isDir = false;

                    // 上传文件
                    if (settings.fnList.upload) {
                        settings.fnList.upload(file);
                    }
                }

                // 移动文件
                if (settings.fnList.move) {
                    settings.fnList.move(file);
                }
            });
        });
    }
}
// console.log(__dirname);
main({
    dist: path.join(__dirname, '../dist'), // 源目标目录
    moveTo: path.join(__dirname, '../targetDir'), // 转移到哪里
    qiniuName: 'test', // 七牛上传文件前缀名
    fnList: {
        move: (file) => {
            moveDeploy(file, path.join(__dirname, '../targetDir'));
        },
        // upload: (file) => {
        //     qiniuUpload(file, 'test');
        // },
    },
});
