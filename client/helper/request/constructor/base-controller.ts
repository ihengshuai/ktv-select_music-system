import { IHttpRequestConfig } from "@/typings/common/http";

import { HttpClient } from "./base-constructor";

export class BaseController {
  protected urlPrefix: string = "";

  protected get httpClient() {
    return HttpClient.instance;
  }

  protected async send<T = any>(params: Omit<IHttpRequestConfig, "url" | "method" | "baseURL"> = {}) {
    // @ts-expect-error
    const activeRequest = this.activeRequestMaps[this.activeRequest!];

    const path = this.urlPrefix + activeRequest.path;

    const payload: IHttpRequestConfig = {
      ...params,
      url: path.replace(/\/\//g, "/"),
    };

    // if (this.baseURL) {
    //   payload.baseURL = this.baseURL;
    // }

    return this.httpClient.request<T>(activeRequest.method, payload);
  }
}
