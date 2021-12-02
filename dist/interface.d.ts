export interface HtmlTaskParams {
    /**
     * 在列表中的文件后缀将被转移
     * @default ['.html']
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
    cover?: boolean;
}
export interface MoveTaskParams {
    /**
     * 在列表中的文件后缀将不会被转移
     * @default []
     * @example ['.json','.md']
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
    cover?: boolean;
}
