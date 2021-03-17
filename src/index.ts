//const { sh, cli } = require("tasksfile");

/**
 * 部署文件———— 图片上传，文件转移等
 * @author yiper.fan 2021年03月16日15:53:44
 */

// const { settings } = require('cluster');
// const { readdir, readdirSync, copyFileSync, existsSync, mkdirSync, rmdirSync } = require('fs');

import { readdir, readdirSync, copyFileSync, existsSync, mkdirSync, rmdirSync } from 'fs';
// const {} = require('fs/promises')
// const { join } = require('path');
// const path = require('path');
import path from 'path';
// const qiniuUpload = require('./qiniuUpload');
import { qiniuUpload } from './qiniuUpload.js';

interface customFile {
    name: string;
    basename: string;
    from: string;
    // to: toUrl,
    release: string;
    extname: string;
    isDir: boolean;
}

/**
 * 清空文件夹下所有内容
 *@param {string} dir 文件夹路径
 *@param {boolean} rmSelf 是否删除本身 默认false
 */
function cleanAndRemark(dir: string, rmSelf: boolean = false) {
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
function moveDeploy(file: customFile, deployTo: string) {
    const to = path.join(deployTo, file.release);
    const dir = path.parse(to).dir;
    if (!existsSync(dir)) {
        mkdirSync(dir);
    }
    copyFileSync(file.from, to);
    console.log(`success: from:${file.from}--->to:${to}`);
}

function mainScanFile(from: string, cb: Function) {
    const root = from;
    /**
     * 深度扫描文件
     * @param {string} from  待扫描文件夹目录
     */
    function scanFile(from: string, cb: Function) {
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

/**
 * 同步扫码文件夹
 * @param {path} from
 * @param {Function} cb
 */
function mainScanFileSync(from: string, cb: Function) {
    const root = from;
    /**
     * 深度扫描文件
     * @param {string} from  待扫描文件夹目录
     */
    function scanFile(from: string, cb: Function) {
        //读取文件属性

        const files = readdirSync(from, { withFileTypes: true });

        files.forEach((item) => {
            const name = item.name;
            const fromUrl = path.join(from, name);

            const file: customFile = {
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

interface settings {
    taskList: [
        | {
              taskName: 'qiniuUpload';
              params: qiniuUploadTaskParams;
          }
        | {
              taskName: 'fileMove' | 'htmlMove';
              params: htmlMoveTaskParams;
          }
        | {
              taskName: 'cleanDir';
              params: cleanDirTaskParams;
          }
    ];
}

/**
 * 主函数
 * @param {object} settings
 */
function startTask(settings: settings) {
    settings.taskList.forEach((item) => {
        const params = item.params;
        switch (item.taskName) {
            case 'qiniuUpload':
                qiniuUploadTask(<qiniuUploadTaskParams>params);
                break;
            case 'fileMove':
                fileMoveTask(params as htmlMoveTaskParams);
                break;
            case 'htmlMove':
                htmlMoveTask(params as htmlMoveTaskParams);
                break;
            case 'cleanDir':
                cleanDirTask(params as cleanDirTaskParams);
            default:
                break;
        }
    });
}

interface cleanDirTaskParams {
    root: string;
    rmSelf: boolean;
}
function cleanDirTask(params: cleanDirTaskParams) {
    const _params = Object.assign({ rmSelf: false }, params);
    cleanAndRemark(_params.root, _params.rmSelf);
}

// console.log(__dirname);

// exports.modules = main;
interface qiniuUploadTaskParams {
    /**
     * 要上传的文件目录，完整路径
     */
    root: string;
    /**
     *  https://image.douba.cn/${publicName}/file
     */
    publicName: string;
    /**
     * 七牛accessKey
     */
    accessKey: string;
    /**
     * 七牛secretKey
     */
    secretKey: string;
}
function qiniuUploadTask(params: qiniuUploadTaskParams) {
    const files: customFile[] = [];
    mainScanFileSync(params.root, (file: customFile) => {
        console.log(file);
        files.push(file);
    });
    qiniuUpload(files, params);
}

interface htmlMoveTaskParams {
    /**
     * 在列表中的文件后缀将被转移
     * @default ['html']
     */
    extname?: string[];
    /**
     * 类似fileMove
     */
    root: string;
    /**
     * 类似fileMove
     */
    deployTo: string;
}
function htmlMoveTask(params: htmlMoveTaskParams) {
    const _params = Object.assign({ extname: ['html'] }, params);
    const extname = _params.extname.map((item) => '.' + item);
    cleanAndRemark(_params.deployTo);
    mainScanFile(_params.root, (file: customFile) => {
        if (extname.indexOf(file.extname) !== -1) {
            moveDeploy(file, _params.deployTo);
        }
    });
}

function fileMoveTask(params: htmlMoveTaskParams) {
    cleanAndRemark(params.deployTo);
    mainScanFile(params.root, (file: customFile) => {
        moveDeploy(file, params.deployTo);
    });
}

// module.exports = startTask;
export { startTask };