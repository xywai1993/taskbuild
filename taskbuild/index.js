//const { sh, cli } = require("tasksfile");
const { readdir, copyFileSync, existsSync, mkdirSync, rmdirSync } = require('fs');
const path = require('path');
const qiniuUpload = require('./qiniuUpload');

// 目标文件夹
const deployTo = './targetDir';
//待转移的文件夹
const srcDeployTo = './dist';

/**
 * 删除文件夹
 *@param {string} dir 文件夹路径
 */
function clean(dir) {
    // sh(`rm -rf ${deployTo}`);
    rmdirSync(dir, { recursive: true });
    console.log(`${dir},删除成功`);
}

function moveDeploy(from, to) {
    main(from, to);
}

// 读取文件且复制
function main(from, to) {
    if (!existsSync(to)) {
        mkdirSync(to);
    }
    //读取文件属性
    readdir(from, { withFileTypes: true }, (err, files) => {
        files.forEach((item) => {
            // console.log(item);

            const name = item.name;
            const formUrl = path.join(from, name);
            const toUrl = path.join(to, name);
            if (item.isDirectory()) {
                readAndCopy(formUrl, toUrl);
            } else {
                const f = path.join(from, name);
                const t = path.join(to, name);

                const file = {
                    name: item.name,
                    basename: item.name,
                    from: f,
                    to: t,
                    release: f.replace(/^dist\//, ''),
                    extname: path.extname(name),
                };
                //复制
                try {
                    copyFileSync(f, t);
                    qiniuUpload(file, 'test');
                } catch (error) {
                    console.log(error);
                }
                console.log(file);
                console.log(`success:  filename:${name} ## from:${f}--->to:${t}`);
            }
        });
    });
}

clean(deployTo);
moveDeploy(srcDeployTo, deployTo);
