/**
 * 此文件为文件上传到本机示例代码，参考即可
 */

import { createReadStream, createWriteStream, existsSync, mkdirSync, readdirSync, unlinkSync } from "fs";
import { stat } from "fs/promises";
import { join } from "path";

import { Injectable, NotFoundException } from "@nestjs/common";
import { generateRandomNameByDate } from "src/utils";

@Injectable()
export class UploadFileService {
  getUploadDest(type?: FILE_UPLOAD_TYPE) {
    if (!type) {
      return this.fileConfiguration.dest;
    }
    const { IMAGE, AUDIO, VIDEO, FILE } = FILE_UPLOAD_TYPE;
    switch (type) {
      case IMAGE:
        return this.fileConfiguration.imgDest;
      case AUDIO:
        return this.fileConfiguration.audioDest;
      case VIDEO:
        return this.fileConfiguration.videoDest;
      case FILE:
        return this.fileConfiguration.fileDest;
      default:
        return this.fileConfiguration.dest;
    }
  }

  getFileTypeByMineType(mimetype: string, appendDot = false) {
    if (!mimetype || typeof mimetype !== "string") return undefined;
    const strs = mimetype?.split("/")?.filter(l => !!l);
    if (strs?.length) {
      return appendDot ? `.${strs[strs.length - 1]}` : strs[strs.length - 1];
    }
    return undefined;
  }

  getFileExt(name: string, mimetype?: string) {
    if (!name) return this.getFileTypeByMineType(mimetype, true);
    const matcheds = name?.match(/\.[^\.|?]+/gi);
    const len = matcheds?.length || 0;
    return (matcheds && len && matcheds?.[len - 1]) || this.getFileTypeByMineType(mimetype, true);
  }

  // 获取图片数据
  async getImagePreview(filename: string) {
    const dest = this.getUploadDest(FILE_UPLOAD_TYPE.IMAGE);
    const imgPath = join(dest, filename);
    const hasExist = await existsSync(imgPath);
    if (!hasExist) {
      throw new NotFoundException("资源不存在");
    }
    return imgPath;
  }

  private async handleBeforeUpload(type: FILE_UPLOAD_TYPE) {
    await this.tryCreateDir(this.fileConfiguration.dest);
    const commonUploadDest = this.getUploadDest();
    const fileDest = this.getUploadDest(type);
    await this.tryCreateDir(commonUploadDest);
    await this.tryCreateDir(fileDest);
  }

  private async tryCreateDir(path: string) {
    if (!(await existsSync(path))) await mkdirSync(path);
  }

  // 小文件上传
  async handleUpload(payload: IFileProp): Promise<IFileProp> {
    const { type, buffer, originName, mimetype } = payload;
    const ext = this.getFileExt(originName, mimetype);
    await this.handleBeforeUpload(type);
    const filename = generateRandomNameByDate() + ext;
    const uploadDest = join(this.getUploadDest(type), /*originName*/ filename);
    const writer = createWriteStream(uploadDest);
    writer.write(buffer);

    return {
      type,
      mimeType: mimetype,
      filename,
      originName,
      ext,
    };
  }

  // 大文件上传
  async handleChunkUpload(payload: IFileProp) {
    const { originName, chunk, hash, index, type, mimetype } = payload;
    await this.tryCreateDir(this.fileConfiguration.dest);
    const chunksDest = this.fileConfiguration.chunksDest;
    await this.tryCreateDir(chunksDest);
    const ext = this.getFileExt(originName);
    const hashDest = join(chunksDest, chunkDestPrefix + hash);
    const mergedPath = join(this.getUploadDest(type), hash + ext);
    await this.tryCreateDir(hashDest);
    const hashChunkDest = join(hashDest, hash + "-" + index);
    // const hasHashChunk = await existsSync(hashChunkDest);
    const hasUploadFile = await existsSync(mergedPath);
    if (!hasUploadFile) {
      const writer = createWriteStream(hashChunkDest);
      writer.write(chunk);
      writer.end();
      await new Promise((resolve, reject) => {
        writer.on("finish", () => {
          writer.close();
          writer.destroy();
          resolve(true);
        });
        writer.on("error", reject);
      });
    }
    return {
      hash,
      originName,
      type,
      ext,
      mimeType: mimetype,
    };
  }

  // 合并大文件的chunk
  async mergeChunks(payload: IFileProp) {
    const { originName, type, hash, mimetype } = payload;
    const chunksDest = this.fileConfiguration.chunksDest;
    const fileDest = join(chunksDest, chunkDestPrefix + hash);
    const ext = this.getFileExt(originName);
    const filename = hash + ext;
    const mergePath = join(this.getUploadDest(type), /*originName*/ filename);
    const hasUploaded = await existsSync(mergePath);
    if (hasUploaded) {
      return {
        filename,
        ext,
        hash,
        size: (await stat(mergePath)).size,
        originName,
        type,
        url: type === FILE_UPLOAD_TYPE.IMAGE ? `/api/file/image/preview/${hash}${ext}` : undefined,
        mimeType: mimetype,
      };
    }
    const chunkNames = await readdirSync(fileDest);
    if (!chunkNames || !chunkNames?.length) return false;
    const uploadDest = join(this.getUploadDest(type));
    const chunkPaths = chunkNames.map(chunkName => join(fileDest, chunkName));
    this.tryCreateDir(uploadDest);
    if (!hasUploaded) {
      await this.writeChunksToFile(chunkPaths, mergePath);
    }
    // TODO: 删除上传chunk文件夹(有权限问题)
    // await unlinkSync(fileDest);
    return {
      filename,
      ext,
      hash,
      size: (await stat(mergePath)).size,
      originName,
      type,
      url: type === FILE_UPLOAD_TYPE.IMAGE ? `/api/file/image/preview/${hash}${ext}` : undefined,
      mimeType: mimetype,
    };
  }

  // 将所有chunk写入到文件中
  async writeChunksToFile(chunkPaths: string[], mergePath: string) {
    let offset = 0;
    chunkPaths = chunkPaths.sort((a, b) => parseInt(a.match(/-(\d+)/i)[1], 10) - parseInt(b.match(/-(\d+)/i)[1], 10));
    await Promise.all(
      chunkPaths.map(async chunkPath => {
        const reader = createReadStream(chunkPath);
        const len = await (await stat(chunkPath)).size;
        const writer = createWriteStream(mergePath, { start: offset });
        offset += len;
        await new Promise((resolve, reject) => {
          reader.pipe(writer);
          reader.on("error", reject);
          writer.on("error", reject);
          writer.on("finish", async () => {
            writer.close();
            writer.destroy();
            reader.destroy();
            await unlinkSync(chunkPath);
            resolve(true);
          });
        });
      })
    );
  }

  // 队列形式
  private async writeChunksQueue(chunkPaths: string[], uploadDest: string) {
    chunkPaths = chunkPaths.sort((a, b) => parseInt(a.match(/-(\d+)/i)[1], 10) - parseInt(b.match(/-(\d+)/i)[1], 10));
    let index = 0;
    let offset = 0;
    async function pipeNext(resolve) {
      const chunk = chunkPaths[index];
      if (!chunk) {
        resolve();
        return;
      }
      const reader = createReadStream(chunk);
      const len = await (await stat(chunk)).size;
      const writer = createWriteStream(uploadDest, { start: offset });
      reader.pipe(writer);
      offset += len;
      index++;
      writer.on("finish", () => {
        writer.end();
        unlinkSync(chunk);
        pipeNext(resolve);
        writer.close();
        reader.close();
      });
    }
    return new Promise(resolve => {
      pipeNext(resolve);
    });
  }

  // 根据hash获取已经上传的chunk
  async getUploadedChunks(payload: IFileProp) {
    const { hash, originName, type } = payload;
    if (!hash) return [];
    const chunksDestConfig = this.fileConfiguration.chunksDest;
    const ext = this.getFileExt(originName);
    const filename = hash + ext;
    const mergePath = join(this.getUploadDest(type), /*originName*/ filename);
    // 已经上传完毕了
    const hasUploaded = await existsSync(mergePath);
    if (hasUploaded)
      return { length: -1, url: type === FILE_UPLOAD_TYPE.IMAGE ? `/api/file/image/preview/${hash}${ext}` : undefined };
    // 有没有hash文件夹
    const chunksDest = join(chunksDestConfig, chunkDestPrefix + hash);
    const hasChunksDest = await existsSync(chunksDest);
    if (!hasChunksDest) return { length: 0 };
    const chunkNames = await readdirSync(chunksDest);
    // 返回角标 [0, 1, 2, 3]
    return { length: chunkNames?.length, list: chunkNames?.map(name => parseInt(name.match(/-(\d+)/i)[1])) };
  }
}
