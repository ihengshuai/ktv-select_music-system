import { useConfig } from "@/config";
import { HTTP_DATA_TYPE } from "@/constants/http";
import { request } from "@/helper";
import { IHttpRequestConfig } from "@/typings/common/http";
import { IStaticDTO, IStaticVO } from "@/typings/models/static/static";

const { API_DOMAIN } = useConfig();

const API_PREFIX = `${API_DOMAIN}/static`;

const API_URL = {
  upload: `${API_PREFIX}/upload`,
};

/** 上传文件 */
export async function uploadResourceAPI(data: IStaticDTO, config?: IHttpRequestConfig) {
  return request.post<IStaticVO>(API_URL.upload, {
    data,
    serializeType: HTTP_DATA_TYPE.FORMDATA,
    ...config,
  });
}
