import Axios, { AxiosInstance, AxiosRequestConfig, Method } from "axios";
import * as qs from "qs";

import { useConfig } from "@/config";
import { HTTP_DATA_TYPE } from "@/constants/http";
import { IHttpRequestConfig } from "@/typings/common/http";
import { IDict } from "@/typings/common/type";

const config = useConfig();
const appConfig = config;

function formatRequestURL(url: string, urlPath: IDict<any>) {
  Object.keys(urlPath).forEach(k => {
    const v = urlPath[k];
    if (v !== undefined) {
      url = url.replace(new RegExp(`({${k}})`, "g"), v);
    }
  });
  return url;
}

export class HttpClient {
  private static _instance: HttpClient;
  private static _axiosInstance: AxiosInstance;
  protected _axiosOpts!: IHttpRequestConfig;

  constructor() {
    this.initAxiosOpts();
  }

  static get axiosInstance(): AxiosInstance {
    if (!this._axiosInstance) {
      this._axiosInstance = Axios.create();
    }
    return this._axiosInstance;
  }

  static get instance(): HttpClient {
    if (!this._instance) {
      this._instance = new HttpClient();
    }
    return this._instance;
  }

  static get createInstance() {
    return new HttpClient();
  }

  async get<T = any>(url: string, request?: IHttpRequestConfig): Promise<T> {
    return this.request<T>("get", { url, ...request });
  }

  async post<T = any>(url: string, request?: IHttpRequestConfig): Promise<T> {
    return this.request<T>("post", { url, ...request });
  }

  async delete<T = any>(url: string, request?: IHttpRequestConfig): Promise<T> {
    return this.request<T>("delete", { url, ...request });
  }

  async put<T = any>(url: string, request?: IHttpRequestConfig): Promise<T> {
    return this.request<T>("put", { url, ...request });
  }

  async head<T = any>(url: string, request?: IHttpRequestConfig): Promise<T> {
    return this.request<T>("head", { url, ...request });
  }

  async patch<T = any>(url: string, request?: IHttpRequestConfig): Promise<T> {
    return this.request<T>("patch", { url, ...request });
  }

  public async request<T>(method: Method, request: IHttpRequestConfig): Promise<T> {
    request = request || {};
    return this.send(this.getAxiosRequest(method, request));
  }

  private getAxiosRequest(method: Method, request: IHttpRequestConfig): AxiosRequestConfig {
    request.data = request.data || {};
    const config: IHttpRequestConfig = { ...this._axiosOpts, ...request, method };

    config.url = request.urlPath ? formatRequestURL(request.url!, request.urlPath) : request.url;
    config.url = appConfig.API_PREFIX + config.url;
    config.headers = config.headers || {};

    if (request.headers?.["Content-Type"]) {
      if (method === "get") {
        const data = { ...request.data };
        config.params = Object.assign(data, request.params);
      } else {
        config.data = request.data;
      }
    } else {
      const serializeType = config.serializeType;

      if (serializeType === HTTP_DATA_TYPE.FORM) {
        config.headers["Content-Type"] = "application/x-www-form-urlencoded";
        config.data = qs.stringify(request.data, { arrayFormat: "indices" });
      } else if (serializeType === HTTP_DATA_TYPE.FORMDATA) {
        config.headers["Content-Type"] = "multipart/form-data";
        const formData = new FormData();
        const requestData = Object.assign(request.data);
        for (const name in requestData) {
          if (requestData[name]) {
            formData.append(name, request.data[name]);
          }
        }
        const requestFiles = request.files;

        for (const name in requestFiles) {
          if (requestFiles[name]) {
            formData.append(name, requestFiles[name]);
          }
        }

        config.data = formData;
      } else {
        config.headers["Content-Type"] = "application/json";
        if (method === "get") {
          config.params = Object.assign(request.data, config.params);
          config.paramsSerializer = p => qs.stringify(p, { arrayFormat: "repeat" });
        } else {
          config.data = request.data;
        }
      }
    }

    config.$request = { ...config };

    return config;
  }

  private async send<T>(axiosRequest: IHttpRequestConfig): Promise<T> {
    return new Promise<any>((resolve, reject) => {
      HttpClient.axiosInstance(axiosRequest)
        .then(resolve)
        .catch(err => {
          const request = axiosRequest.$request!;
          if (request?.retryCount && request.retryCount > 0) {
            setTimeout(() => {
              request.retryCount && request.retryCount--;
              this.send(axiosRequest).then(resolve).catch(reject);
            }, request.retryInterval);
          } else {
            reject(err);
          }
        });
    });
  }

  private initAxiosOpts() {
    this._axiosOpts = {
      baseURL: config.API_DOMAIN,
      retryCount: 0,
      retryInterval: 1000,
      timeout: config.TIMEOUT || 1000 * 60,
      captureError: true,
      serializeType: HTTP_DATA_TYPE.JSON,
      withCredentials: true,
    };
  }
}
