//const { sh, cli } = require("tasksfile");

/**
 * 执行部署任务———— 图片上传，文件转移等
 * @author yiper.fan 2021年03月17日20:13:57
 */

import { readdir, readdirSync, copyFileSync, existsSync, mkdirSync, rmdirSync, rmSync } from 'fs';

import path from 'path';
// const qiniuUpload = require('./qiniuUpload');
import { fileURLToPath } from 'url';

/**
 * 获取文件路径 ，作用类似 Common 模块的 __dirname
 * @param importMeta import.mate
 * @returns
 */
export function __dirname(importMeta: ImportMeta) {
    if (!importMeta) {
        console.warn('importMeta参数不能为空');
        return '';
    }
    return path.dirname(fileURLToPath(importMeta.url));
}
import { qiniuUpload } from './qiniuUpload.js';

export interface customFile {
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

    try {
        rmSync(dir, { recursive: true });
    } catch (error) {
        console.log(error);
    }

    console.log(`${dir},删除成功`);
    if (!rmSelf) {
        mkdirSync(dir, { recursive: true });
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
        mkdirSync(dir, { recursive: true });
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

interface cleanDirTaskParams {
    root: string;
    /**
     * 是否删除目录
     * @default false
     */
    rmSelf: boolean;
}
export function cleanDirTask(params: cleanDirTaskParams) {
    const _params = Object.assign({ rmSelf: false }, params);
    cleanAndRemark(_params.root, _params.rmSelf);
}

// console.log(__dirname);

// exports.modules = main;
export interface qiniuUploadTaskParams {
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

interface MoveTaskParams {
    /**
     * 在列表中的文件后缀将被转移
     * @default ['html']
     */
    extname?: string[];
    /**
     * 要部署的源文件目录，完整路径，不支持相对路径
     */
    root: string;
    /**
     * 部署目录，完整路径，不支持相对路径
     */
    deployTo: string;
    /**
     * 部署方式是否为 '覆盖' , 假如为true，部署目录将会被清空， false则不会被清空
     * @default true
     */
    cover: boolean;
}
function htmlMoveTask(params: MoveTaskParams) {
    const _params = Object.assign({ extname: ['html'] }, params);
    const extname = _params.extname.map((item) => '.' + item);
    params.cover && cleanAndRemark(_params.deployTo);
    mainScanFileSync(_params.root, (file: customFile) => {
        if (extname.indexOf(file.extname) !== -1) {
            moveDeploy(file, _params.deployTo);
        }
    });
}

function fileMoveTask(params: MoveTaskParams) {
    params.cover && cleanAndRemark(params.deployTo);
    mainScanFileSync(params.root, (file: customFile) => {
        moveDeploy(file, params.deployTo);
    });
}

export interface settings {
    taskList: [
        | {
              taskName: 'qiniuUpload';
              params: qiniuUploadTaskParams;
          }
        | {
              taskName: 'fileMove' | 'htmlMove';
              params: MoveTaskParams;
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
                fileMoveTask(params as MoveTaskParams);
                break;
            case 'htmlMove':
                htmlMoveTask(params as MoveTaskParams);
                break;
            case 'cleanDir':
                cleanDirTask(params as cleanDirTaskParams);
            default:
                break;
        }
    });
}

// module.exports = startTask;
export { startTask };
