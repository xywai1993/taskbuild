//const { sh, cli } = require("tasksfile");
/**
 * 执行部署任务———— 图片上传，文件转移等
 * @author yiper.fan 2021年03月17日20:13:57
 */
import { readdir, readdirSync, copyFileSync, existsSync, mkdirSync, rmdirSync } from 'fs';
import path from 'path';
// const qiniuUpload = require('./qiniuUpload');
import { fileURLToPath } from 'url';
/**
 * 获取文件路径 ，作用类似 Common 模块的 __dirname
 * @param importMeta import.mate
 * @returns
 */
export function __dirname(importMeta) {
    return path.dirname(fileURLToPath(importMeta.url));
}
import { qiniuUpload } from './qiniuUpload.js';
/**
 * 清空文件夹下所有内容
 *@param {string} dir 文件夹路径
 *@param {boolean} rmSelf 是否删除本身 默认false
 */
function cleanAndRemark(dir, rmSelf = false) {
    // sh(`rm -rf ${deployTo}`);
    rmdirSync(dir, { recursive: true });
    console.log(`${dir},删除成功`);
    if (!rmSelf) {
        mkdirSync(dir);
        console.log(`${dir},创建成功`);
    }
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
                }
                else {
                    cb(file);
                }
            });
        });
    }
    scanFile(from, cb);
}
/**
 * 同步扫码文件夹
 * @param {path} from
 * @param {Function} cb
 */
function mainScanFileSync(from, cb) {
    const root = from;
    /**
     * 深度扫描文件
     * @param {string} from  待扫描文件夹目录
     */
    function scanFile(from, cb) {
        //读取文件属性
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
            }
            else {
                cb(file);
            }
        });
    }
    scanFile(from, cb);
}
function cleanDirTask(params) {
    const _params = Object.assign({ rmSelf: false }, params);
    cleanAndRemark(_params.root, _params.rmSelf);
}
function qiniuUploadTask(params) {
    const files = [];
    mainScanFileSync(params.root, (file) => {
        console.log(file);
        files.push(file);
    });
    qiniuUpload(files, params);
}
function htmlMoveTask(params) {
    const _params = Object.assign({ extname: ['html'] }, params);
    const extname = _params.extname.map((item) => '.' + item);
    cleanAndRemark(_params.deployTo);
    mainScanFile(_params.root, (file) => {
        if (extname.indexOf(file.extname) !== -1) {
            moveDeploy(file, _params.deployTo);
        }
    });
}
function fileMoveTask(params) {
    cleanAndRemark(params.deployTo);
    mainScanFile(params.root, (file) => {
        moveDeploy(file, params.deployTo);
    });
}
/**
 * 主函数
 * @param {object} settings
 */
function startTask(settings) {
    settings.taskList.forEach((item) => {
        const params = item.params;
        switch (item.taskName) {
            case 'qiniuUpload':
                qiniuUploadTask(params);
                break;
            case 'fileMove':
                fileMoveTask(params);
                break;
            case 'htmlMove':
                htmlMoveTask(params);
                break;
            case 'cleanDir':
                cleanDirTask(params);
            default:
                break;
        }
    });
}
// module.exports = startTask;
export { startTask };
