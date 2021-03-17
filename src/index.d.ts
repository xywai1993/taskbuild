interface settings {
    /**
     * 任务列表
     */
    taskList: [
        | {
              /**
               * 上传到七牛
               */
              taskName: 'qiniuUpload';
              params: {
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
          }
        | {
              /**
               * 转移文件，转移后不会改变源目录，仅拷贝
               */
              taskName: 'fileMove';
              params: {
                  /**
                   * 要移动的文件目录，完整路径，不会改变原目录
                   */
                  root: string;
                  /**
                   * 移动到哪里，完整路径
                   */
                  deployTo: string;
              };
          }
        | {
              /**
               * 特定文件后缀转移，转移后不会改变源目录，仅拷贝
               */
              taskName: 'htmlMove';
              params: {
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
              };
          }
        | {
              /**
               * 清空文件夹下的内容
               */
              taskName: 'cleanDir';
              params: {
                  /**
                   * 是否删除文件夹
                   * @default false
                   */
                  rmSelf?: false;
                  /**
                   * 要移除的文件目录，完整路径
                   */
                  root: string;
              };
          }
    ];
}
declare function startTask(setting: settings): void;
export = startTask;
