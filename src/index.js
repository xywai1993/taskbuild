//const { sh, cli } = require("tasksfile");

/**
 * 部署文件———— 图片上传，文件转移等
 * @author yiper.fan 2021年03月16日15:53:44
 */

// const { settings } = require('cluster');
const { readdir, readdirSync, copyFileSync, existsSync, mkdirSync, rmdirSync } = require('fs');
// const {} = require('fs/promises')
// const { join } = require('path');
const path = require('path');
const qiniuUpload = require('./qiniuUpload');

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
    const dir = path.parse(to).dir;
    if (!existsSync(dir)) {
        mkdirSync(dir);
    }
    copyFileSync(file.from, to);
    console.log(`success: from:${file.from}--->to:${to}`);
}

function mainScanFile(from, cb) {
    const root = from;
    /**
     * 深度扫描文件
     * @param {string} from  待扫描文件夹目录
     */
    function scanFile(from, cb) {
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
                    release: path.relative(root, fromUrl),
                    extname: path.extname(name),
                    isDir: item.isDirectory(),
                };
                if (item.isDirectory()) {
                    scanFile(fromUrl, cb);
                } else {
                    cb(file);
                }
            });
        });
    }

    scanFile(from, cb);
}

function mainScanFileSync(from, cb) {
    const root = from;
    /**
     * 深度扫描文件
     * @param {string} from  待扫描文件夹目录
     */
    function scanFile(from, cb) {
        //读取文件属性

        // readdir(from, { withFileTypes: true }, (err, files) => {
        //     files.forEach((item) => {
        //         const name = item.name;
        //         const fromUrl = path.join(from, name);

        //         const file = {
        //             name: item.name,
        //             basename: item.name,
        //             from: fromUrl,
        //             // to: toUrl,
        //             release: path.relative(root, fromUrl),
        //             extname: path.extname(name),
        //             isDir: item.isDirectory(),
        //         };
        //         if (item.isDirectory()) {
        //             scanFile(fromUrl, cb);
        //         } else {
        //             cb(file);
        //         }
        //     });
        // });

        const files = readdirSync(from, { withFileTypes: true });

        files.forEach((item) => {
            const name = item.name;
            const fromUrl = path.join(from, name);

            const file = {
                name: item.name,
                basename: item.name,
                from: fromUrl,
                // to: toUrl,
                release: path.relative(root, fromUrl),
                extname: path.extname(name),
                isDir: item.isDirectory(),
            };
            if (item.isDirectory()) {
                scanFile(fromUrl, cb);
            } else {
                cb(file);
            }
        });
    }

    scanFile(from, cb);
}

function mainQiniuFn(params) {
    const files = [];
    mainScanFileSync(params.root, (file) => {
        console.log(file);
        files.push(file);
    });
    console.log('files', files);
    qiniuUpload(files, params);
}

function main(settings) {
    const settingFn = settings.fnList;

    for (task in settings.taskList) {
        console.log(task);
        const params = settings.taskList[task];
        console.log(params);
        switch (task) {
            case 'qiniuUpload':
                mainQiniuFn(params);
                break;
            case 'fileMove':
                cleanAndRemark(params.deployTo);
                mainScanFile(params.root, (file) => {
                    moveDeploy(file, params.deployTo);
                });
                break;
            case 'htmlMove':
                cleanAndRemark(params.deployTo);
                mainScanFile(params.root, (file) => {
                    const extname = params.extname.map((item) => '.' + item);
                    if (extname.indexOf(file.extname) !== -1) {
                        moveDeploy(file, params.deployTo);
                    }
                });
                break;
            default:
                break;
        }
    }
}
// console.log(__dirname);
console.time('main发费时间：');
const accessKey = 'MOuxWdctTtaTqJCk-2Sx_ZDtthDr8I3CNHgYmTGm';
const secretKey = 'A9K6nk1bfd_eWAINPOfsXnCoKgbXfRgc5HsdUegZ';
main({
    taskList: {
        qiniuUpload: {
            root: path.join(__dirname, '../testdist'),
            publicName: 'test',
            accessKey: 'MOuxWdctTtaTqJCk-2Sx_ZDtthDr8I3CNHgYmTGm',
            secretKey: 'A9K6nk1bfd_eWAINPOfsXnCoKgbXfRgc5HsdUegZ',
        },
        // fileMove: {
        //     root: path.join(__dirname, '../testdist'),
        //     deployTo: path.join(__dirname, '../targetDir'),
        // },
        // htmlMove: {
        //     extname: ['html'],
        //     root: path.join(__dirname, '../testdist'),
        //     deployTo: path.join(__dirname, '../htmlTargetDir'),
        // },
    },
});
console.timeEnd('main发费时间：');
