interface settings {
    /**
     * 任务列表
     */
    taskList: {
        /**
         * 上传到七牛
         */
        qiniuUpload?: {
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
        };
        /**
         * 文件移动
         */
        fileMove?: {
            /**
             * 要移动的文件目录，完整路径，不会改变原目录
             */
            root: string;
            /**
             * 移动到哪里，完整路径
             */
            deployTo: string;
        };
        htmlMove?: {
            /**
             * 在列表中的文件后缀将被移动，不会改变原目录
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
        };
    };
}
declare function main(setting: settings): void;
export = main;
