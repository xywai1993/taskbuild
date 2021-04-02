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
interface MoveTaskParams {
    /**
     * 在列表中的文件后缀将被转移
     * @default ['html']
     */
    extname?: string[];
    /**
     * 要部署的源文件目录，完整路径
     */
    root: string;
    /**
     * 部署目录，完整路径
     */
    deployTo: string;
    /**
     * 部署方式是否为 '覆盖' , 假如为true，部署目录将会被清空， false则不会被清空
     * @default true
     */
    cover: boolean;
}
export interface settings {
    taskList: [
        {
            taskName: 'qiniuUpload';
            params: qiniuUploadTaskParams;
        } | {
            taskName: 'fileMove' | 'htmlMove';
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
 */
declare function startTask(settings: settings): void;
export { startTask };
