import { useConfig } from "@/config";
import { FILE_LOCATION } from "@/constants/file";
import { HTTP_DATA_TYPE } from "@/constants/http.const";
import { request } from "@/helper";
import { IHttpRequestConfig } from "@/typings/common/http";
import { IListQuery, IListResult } from "@/typings/common/table";
import { IStaticDTO, IStaticQueryDTO, IStaticVO } from "@/typings/models/static/static";

const { API_DOMAIN } = useConfig();

const API_PREFIX = `${API_DOMAIN}/static`;

const API_URL = {
  upload: `${API_PREFIX}/upload`,
  ossUpload: `${API_PREFIX}/oss/upload`,
  list: `${API_PREFIX}/files`,
  delete: `${API_PREFIX}/delete/{id}`,
  detail: `${API_PREFIX}/file-detail/{id}`,
};

/** 上传文件 */
export async function uploadResourceAPI(data: Omit<IStaticDTO, "location">, config?: IHttpRequestConfig) {
  return request.post<IStaticVO>(API_URL.upload, {
    data: {
      ...data,
      location: FILE_LOCATION.LOCAL,
    },
    serializeType: HTTP_DATA_TYPE.FORMDATA,
    ...config,
  });
}

/** 上传文件到OSS */
export async function uploadResourceOssAPI(data: Omit<IStaticDTO, "location">, config?: IHttpRequestConfig) {
  return request.post<IStaticVO>(API_URL.ossUpload, {
    data: {
      ...data,
      location: FILE_LOCATION.OSS,
    },
    serializeType: HTTP_DATA_TYPE.FORMDATA,
    ...config,
  });
}

/** 获取静态资源列表 */
export async function getStaticResourceListAPI(params?: IListQuery<IStaticQueryDTO>, config?: IHttpRequestConfig) {
  return request.get<IListResult<IStaticVO>>(API_URL.list, {
    params,
    ...config,
  });
}

/** 删除文件 */
export async function deleteFileAPI(id: number, config?: IHttpRequestConfig) {
  return request.delete(API_URL.delete, {
    urlPath: { id },
    ...config,
  });
}

/** 获取指定文件信息 */
export async function getFileInfoAPI(id: number, config?: IHttpRequestConfig) {
  return request.get<IStaticVO>(API_URL.detail, {
    urlPath: { id },
    ...config,
  });
}
