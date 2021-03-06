/**
 * 执行部署任务———— 图片上传，文件转移等
 * @author yiper.fan 2021年03月17日20:13:57
 */
import { HtmlTaskParams, MoveTaskParams } from './interface.js';
/**
 * 获取文件路径 ，作用类似 Common 模块的 __dirname
 * @param importMeta import.mate
 * @returns
 */
export declare function __dirname(importMeta: ImportMeta): string;
export interface customFile {
    name: string;
    basename: string;
    from: string;
    release: string;
    extname: string;
    isDir: boolean;
}
interface cleanDirTaskParams {
    root: string;
    /**
     * 是否删除目录
     * @default false
     */
    rmSelf: boolean;
}
export declare function cleanDirTask(params: cleanDirTaskParams): void;
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
export interface settings {
    taskList: [
        {
            taskName: 'qiniuUpload';
            params: qiniuUploadTaskParams;
        } | {
            taskName: 'htmlMove';
            params: HtmlTaskParams;
        } | {
            taskName: 'fileMove';
            params: MoveTaskParams;
        } | {
            taskName: 'cleanDir';
            params: cleanDirTaskParams;
        }
    ];
}
/**
 * 主函数
 * @param {object} settings
 * @example startTask({taskList:[{taskName:'fileMove',params:{}}]})
 */
declare function startTask(settings: settings): void;
export { startTask };
