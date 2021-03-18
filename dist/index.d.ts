export declare function __dirname(): string;
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
     * 类似fileMove
     */
    root: string;
    /**
     * 类似fileMove
     */
    deployTo: string;
}
interface settings {
    taskList: [{
        taskName: 'qiniuUpload';
        params: qiniuUploadTaskParams;
    } | {
        taskName: 'fileMove' | 'htmlMove';
        params: MoveTaskParams;
    } | {
        taskName: 'cleanDir';
        params: cleanDirTaskParams;
    }];
}
/**
 * 主函数
 * @param {object} settings
 */
declare function startTask(settings: settings): void;
export { startTask };
