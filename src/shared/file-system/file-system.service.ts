import { createReadStream, existsSync, unlinkSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { cwd } from "process";

import { BadRequestException, Injectable, NotFoundException, Scope, StreamableFile } from "@nestjs/common";
import OSS from "ali-oss";
import axios from "axios";
import { nanoid } from "nanoid";

import { FILE_CONFIG } from "@/config/file.config";
import { OSS_CONFIG } from "@/config/oss.config";
import { DATE_FORMAT, FILE_LOCATION } from "@/consts";
import { StaticEntity } from "@/modules/static/entities/static.entity";
import { formatDate, StaticPrefixURL } from "@/utils";

import { FileSystemDTO } from "./dto/file-system.dto";

const { OSS_KEY, OSS_SECRET, OSS_BUCKET, OSS_REGION, OSS_DOMAIN } = OSS_CONFIG;

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

  static async uploadFile(location: FILE_LOCATION, payload: FileSystemDTO, file: Buffer, fileName: string) {
    if (location === FILE_LOCATION.OSS) {
      return await FileSystemService.uploadToOss(payload, file, fileName);
    }

    return await FileSystemService.uploadToLocal(payload, file, fileName);
  }

  /** 上传OSS */
  private static async uploadToOss(payload: FileSystemDTO, file: Buffer, fileName: string) {
    try {
      const { appId } = payload;
      const uploadFileName = createFileName(fileName, appId, "/");

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

  /** 上传本地 */
  private static async uploadToLocal(payload: FileSystemDTO, file: Buffer, fileName: string) {
    try {
      const { appId } = payload;
      const uploadFileName = createFileName(fileName, appId, "-");
      const today = formatDate(new Date(), DATE_FORMAT.DATE);
      const { FILE_UPLOAD_PATH } = FILE_CONFIG;

      const rootDestPath = path.join(cwd(), FILE_UPLOAD_PATH);

      if (!existsSync(rootDestPath)) await mkdir(rootDestPath);

      // 创建日期目录
      const destPath = path.join(rootDestPath, today);
      if (!existsSync(destPath)) await mkdir(destPath);

      await writeFile(path.join(destPath, uploadFileName), file as any);

      return {
        url: path.join(today, uploadFileName),
        name: uploadFileName,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  static async readFile(location: FILE_LOCATION, filename: string) {
    if (location === FILE_LOCATION.OSS) {
      const resourceURL = `${OSS_DOMAIN}/${filename}`;

      try {
        const res = await axios.get(resourceURL, {
          responseType: "stream",
        });

        return new StreamableFile(res.data);
      } catch (error: any) {
        throw new NotFoundException(`资源不存在(${error.message})`);
      }
    }

    const filePath = path.join(cwd(), FILE_CONFIG.FILE_UPLOAD_PATH, filename);

    if (!existsSync(filePath)) throw new NotFoundException("资源不存在");

    const rs = createReadStream(filePath);

    return new StreamableFile(rs /*,{ type: "text/image" }*/);
  }

  static async deleteFile(deleteFile: StaticEntity) {
    try {
      const { location } = deleteFile;
      let url = deleteFile.url.replace(StaticPrefixURL, "");
      url = url.split("?")[0];

      if (location === FILE_LOCATION.OSS) {
        await FileSystemService.ossClient.delete(url);
      } else {
        const filePath = path.join(cwd(), FILE_CONFIG.FILE_UPLOAD_PATH, url);

        if (existsSync(filePath)) await unlinkSync(filePath);
      }
    } catch (error) {
      console.error(error);
      throw new BadRequestException("删除失败");
    }
  }
}

function createFileName(filename: string, appId: string, separator = "-") {
  const dateStr = formatDate(new Date(), DATE_FORMAT.DATE.replaceAll("-", separator));
  const randomStr = nanoid(5);

  const uploadFileName = `${appId}${separator}${dateStr}${separator}${randomStr}_${filename}`;

  return uploadFileName;
}
