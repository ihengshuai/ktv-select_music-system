declare const __isDev__: boolean;

interface Window {
  config: any;

  /**
   * 定义 sharedworker 方法
   */
  onconnect: (e: MessageEvent) => void | any;
}
