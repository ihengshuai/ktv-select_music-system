import { HTTP_DATA_TYPE } from "@/constants/http";
import { AxiosRequestConfig } from "axios";

export interface IHttpRequestConfig extends AxiosRequestConfig {
  /** 以叉桩形式拼接地址 */
  urlPath?: Record<string, string | number | boolean | undefined | null>;
  /** 数据类型 */
  serializeType?: HTTP_DATA_TYPE;
  /** 文件 */
  files?: any;
  /**
   * 重试次数
   * @default 0
   */
  retryCount?: number;
  /**
   * 重试间隔
   * @default 1000
   */
  retryInterval?: number;
  /**
   * 开启全局错误捕获
   * @default true
   */
  captureError?: boolean;
  /**
   * 忽略取消请求
   * @default false
   */
  ignoreCancelToken?: boolean;
  /**
   * 是否开启时间戳(get缓存问题)
   * @default false
   * @method get
   */
  timeStamp?: boolean;
  /**
   * 是否转换相应数据为驼峰
   * @default true
   */
  transferToCamel?: boolean;
  /**
   * 绑定当前请求参数配置（仅内部使用）
   */
  $request?: IHttpRequestConfig;

  /**
   * 请求标识，方便日志查询
   */
  label?: string;
}

declare module "axios" {
  // eslint-disable-next-line @typescript-eslint/naming-convention, no-unused-vars
  interface AxiosRequestConfig {
    $request?: IHttpRequestConfig;
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention, no-unused-vars
  interface AxiosResponse {
    /**
     * 配置
     */
    config: IHttpRequestConfig;
    /**
     * 后端返回的真实载体
     */
    payload?: {
      /**
       * 后端状态码
       */
      code: number;
      /**
       * 有效数据
       */
      data: any;
      /**
       * 消息信息
       */
      message?: string;
      /**
       * 错误信息
       */
      error?: string;
    };
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-empty-interface, no-unused-vars
  interface InternalAxiosRequestConfig extends IHttpRequestConfig {}
}

/**
 * 并发控制
 */
export interface IRequestConcurrencyLimit {
  /** 并发数 */
  limit?: number;
  /** 重试次数 */
  retry?: number;
  /** 跳过错误(真时,retry无效) */
  skipError?: boolean;
  /** 请求是否关联(关联时按limit强制为1,且上一个结果提交给下一个) */
  relation?: boolean;
}
export interface IRequestConcurrencyQueue {
  promiseFn: (...args: any) => any;
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
  retry?: number;
  skipError?: boolean;
  /** 上一个请求结果 */
  prevData?: any;
  uuid: string;
}

export interface IRequestConcurrencyNoticeParams {
  isRetry: boolean;
  retryCount: number;
  pendingCount: number;
  activeCount: number;
}

export type IRequestConcurrencyNotice = (params: IRequestConcurrencyNoticeParams) => void;
