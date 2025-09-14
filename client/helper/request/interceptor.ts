/* eslint-disable import/order */
import { HttpClient } from "./constructor/base-constructor";

/** 请求拦截器 */
import requestNecessaryInterceptor from "./interceptors/request-necessary.interceptor";
import requestSignatureInterceptor from "./interceptors/request-signature.interceptor";

/** 响应拦截器 */
import responseNecessaryInterceptor from "./interceptors/response-necessary.interceptor";
import responseCodeInterceptor from "./interceptors/response-code.interceptor";
import responseNoticeInterceptor from "./interceptors/response-notice.interceptor";

const requestInterceptors = [requestNecessaryInterceptor, requestSignatureInterceptor];
const responseInterceptors = [responseNecessaryInterceptor, responseCodeInterceptor, responseNoticeInterceptor];

requestInterceptors.reverse().forEach(interceptor => {
  HttpClient.axiosInstance.interceptors.request.use(interceptor.onFulfilled, interceptor.onRejected);
});

responseInterceptors.forEach(interceptor => {
  HttpClient.axiosInstance.interceptors.response.use(interceptor.onFulfilled, interceptor.onRejected);
});
