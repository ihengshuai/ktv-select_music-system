import { BadRequestException, Injectable, Scope } from "@nestjs/common";
import OSS from "ali-oss";
import { nanoid } from "nanoid";

import { OSS_CONFIG } from "@/config/oss.config";
import { DateFormat } from "@/constants";
import { formatDate } from "@/utils";

import { FileSystemDTO } from "./dto/file-system.dto";

const { OSS_KEY, OSS_SECRET, OSS_BUCKET, OSS_REGION } = OSS_CONFIG;

@Injectable({ scope: Scope.REQUEST })
export class FileSystemService {
  private static _ossClient: OSS;

  static get ossClient() {
    if (!FileSystemService._ossClient) {
      FileSystemService._ossClient = new OSS({
        region: OSS_REGION,
        accessKeyId: OSS_KEY,
        accessKeySecret: OSS_SECRET,
        bucket: OSS_BUCKET,
      });
    }

    return FileSystemService._ossClient;
  }

  static async getFileList(params?: Partial<OSS.ListObjectsQuery>, options?: OSS.RequestOptions) {
    const query: OSS.ListObjectsQuery = {
      "max-keys": 10,
      ...params,
    };
    const res = await FileSystemService.ossClient.list(query, options);

    if (res?.objects) {
      return res.objects.map(item => ({
        name: item.name,
        url: item.url,
      }));
    }

    return [];
  }

  static async uploadFile(payload: FileSystemDTO, file: Buffer, fileName: string) {
    try {
      const { appId } = payload;
      const dateStr = formatDate(new Date(), DateFormat.DATE.replaceAll("-", "/"));
      const randomStr = nanoid(5);

      const uploadFileName = `${appId}/${dateStr}/${randomStr}_${fileName}`;

      const res = await FileSystemService.ossClient.put(uploadFileName, file);

      if (res?.res?.status === 200) {
        return {
          url: res.url,
          name: res.name,
        };
      }

      throw new BadRequestException("上传失败");
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
