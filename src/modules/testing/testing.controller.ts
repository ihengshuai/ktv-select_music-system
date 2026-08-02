/* eslint-disable no-unused-vars */
import { createReadStream } from "fs";
import { stat } from "fs/promises";
import { resolve } from "path";
import { cwd } from "process";

import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request, Response } from "express";

import { HttpSignature } from "@/common/decorator";
import { FileSystemService } from "@/shared/file-system/file-system.service";
import { generateStaticTicket } from "@/utils";

import { CreateFileDTO } from "../static/dto/file.dto";

export interface IFileProp {
  filename?: string;
  originName?: string;
  ext?: string;
  buffer?: ArrayBuffer;
  mimetype?: string;
  mimeType?: string;
  type?: any;
  /**
   * 大文件上传chunk hash
   */
  hash?: string;
  /**
   * 大文件上传chunk索引
   */
  index?: number;
  /**
   * 大文件上传每个chunk
   */
  chunk?: ArrayBuffer;
}

@HttpSignature(false)
@Controller("/testing")
export class TestingController {
  @Get("file")
  async getFile() {
    const fileList = await FileSystemService.getFileList();

    return fileList;
  }

  @Post("/testing-file/file")
  @UseInterceptors(FileInterceptor("file")) // 二进制文件
  async uploadFile(@Body() payload: CreateFileDTO, @UploadedFile() file: Express.Multer.File) {
    const res = await FileSystemService.uploadFile(payload, file.buffer, file.originalname);

    return res;
  }

  @Get("/testing-file/encryption")
  async getEncryption() {
    const res = generateStaticTicket(1000 * 20);
    return res;
  }

  // ============ 本地文件测试 ============

  // 下载视频
  @Get("/testing-file/video")
  @Header("Content-Disposition", 'attachment; filename="video.mp4"')
  @Header("Access-Control-Expose-Headers", "Content-Disposition") // 跨域允许客户端获取的头信息
  getVideo(): StreamableFile {
    const file = createReadStream(resolve(cwd(), "./dist/xiamen.mp4"));
    return new StreamableFile(file);
  }

  // 自定义chunk大小返回
  @Get("/testing-file/image/chunk")
  @Header("Transfer-Encoding", "chunked")
  @Header("Content-Type", "image/jpg")
  // @Header('Content-Disposition', 'attachment; filename="cat.jpg"')
  async getImage1(@Res() res: Response) {
    const imagePath = resolve(cwd(), "./public/logo.png");
    const fileSize = (await stat(imagePath)).size;
    const chunkeSize = 1024 * 10; // 每次读取10kb
    let offset = 0;
    res.setHeader("Content-Length", fileSize);
    const reader = createReadStream(imagePath, { highWaterMark: chunkeSize });
    const timer = setInterval(() => {
      const chunk = reader.read(chunkeSize);
      if (chunk) {
        offset += chunk.length;
        res.write(chunk);
      }
      if (offset >= fileSize) {
        clearInterval(timer);
        res.end();
      }
    }, 10);
  }

  @Get("/testing-file/image/size")
  @Header("Content-Type", "application/json")
  async getImageSize() {
    const imagePath = resolve(cwd(), "./public/logo.png");
    const fileSize = (await stat(imagePath)).size;
    return fileSize;
  }

  // 请求范围图片
  @Post("/testing-file/image/range")
  async getRangeImage(@Req() req: Request, @Res() res: Response) {
    const imagePath = resolve(cwd(), "./public/logo.png");
    const requestRange = req.headers.range;
    if (!requestRange) {
      res
        .writeHead(200, {
          "Content-Type": "image/jpeg",
        })
        .sendFile(imagePath);
      return;
    }
    res.setHeader("Content-Type", "image/jpeg");
    const fileSize = (await stat(imagePath)).size;
    const parts = requestRange?.replace(/bytes=/, "").split("-");
    const start = parseInt(parts?.[0], 10) || 0;
    const end = parseInt(parts?.[1], 10) || fileSize;
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": end - start,
      "Content-Type": "image/jpg",
    };
    const reader = createReadStream(imagePath, { start, end });
    res.writeHead(206, head);
    reader.pipe(res);
  }

  // 下载图片
  @Post("/testing-file/image")
  getImage2() {
    const imagePath = resolve(cwd(), "./public/logo.png");
    const reader = createReadStream(imagePath);
    return new StreamableFile(reader);
  }

  // 原生下载json
  @Get("/testing-file/json/origin")
  getJsonOrigin(@Res() res: Response) {
    // res.sendFile(resolve(__dirname, '../../../package.json'));
    res.setHeader("Content-Disposition", 'attachment; filename="package.json"');
    res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
    const file = createReadStream(resolve(cwd(), "./package.json"));
    res.setHeader("Content-Type", "application/json");
    return file.pipe(res);
  }

  // 使用框架下载json
  @Get("/testing-file/json/frame")
  @Header("Content-Disposition", 'attachment; filename="package.json"')
  @Header("Access-Control-Expose-Headers", "Content-Disposition") // 跨域允许客户端获取的头信息
  getJsonFrame() {
    const file = createReadStream(resolve(cwd(), "./package.json"));
    return new StreamableFile(file);
  }

  // 下载大文件
  @Get("/testing-file/iso")
  @Header("Content-Disposition", 'attachment; filename="compiler.pdf"')
  @Header("Access-Control-Expose-Headers", "Content-Disposition") // 跨域允许客户端获取的头信息
  async getISO(@Res() res: Response) {
    const file = createReadStream(resolve(__dirname, "/Users/ihengshuai/Downloads/#testing-data/1.pdf"));
    const fileStat = await stat("/Users/ihengshuai/Downloads/#testing-data/1.pdf");
    const fileSize = fileStat.size;
    res.setHeader("Content-Length", fileSize);
    file.pipe(res);
    // sendFile也是以流的方式传输
    // res.sendFile(resolve(__dirname, '/Users/ihengshuai/Downloads/#testing-data/1.pdf'));
    // return new StreamableFile(file);
  }

  // 块传输
  @Get("/testing-file/chunked")
  @Header("Transfer-Encoding", "chunked")
  getChunked(@Res() res: Response) {
    const str = "12vb,3f水s4士大夫g5qyu6dfg";
    let i = 0;

    // 将字符转化为 Unit8Array，并获取其长度
    const encoder = new TextEncoder();
    const bytes = encoder.encode(str);
    res.setHeader("Content-Length", bytes.length);

    // 1s返回一次 总共返回9次
    const timer = setInterval(() => {
      res.write(`${str.charAt(i)}`);
      if (i >= str.length - 1) {
        clearInterval(timer);
        res.end();
      }
      i++;
    }, 300);
  }

  // 对视频进行范围请求
  @Get("/testing-file/video/range")
  async getVideoRanges(@Req() req: Request, @Res() res: Response) {
    // 直接打开链接时禁止访问
    const referer = req.headers.referer;
    const host = req.headers.host;
    const url = referer && new URL(referer);
    if (!referer || url?.host !== host) {
      throw new ForbiddenException("禁止访问");
    }
    const requestRange = req.headers["range"];
    const parts = requestRange?.replace(/bytes=/, "").split("-");
    // TODO: 本地文件系统一个地址
    const filePath = resolve(cwd(), "./dist/xiamen.mp4");
    const fileStat = await stat(filePath);
    const fileSize = fileStat.size;
    const start = Math.min(parseInt(parts?.[0], 10) || 0, fileSize - 1); // 这里的大小值需减1
    const end = Math.min(
      parseInt(parts?.[1]) || start + 1024 * 1024, // 每次没有结束值，只返回1MB的数据
      fileSize - 1
    );
    const chunkSize = end - start + 1;
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    };

    console.log("video range：", start, end);

    // range请求返回部分内容
    if (requestRange) {
      const stream = createReadStream(filePath, { start, end });
      res.writeHead(206, head);
      // setTimeout(() => {
      stream.pipe(res);
      // }, 1000 * 3);
    } else {
      // 非range请求返回整个视频
      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      });
      createReadStream(filePath).pipe(res);
    }
  }

  // 小文件上传：直接上传
  @Post("/testing-file/upload/normal")
  @HttpCode(HttpStatus.OK)
  @Header("Content-Type", "application/json")
  @UseInterceptors(FileInterceptor("file")) // 二进制文件
  async uploadNormalFile(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    // const { originalname, mimetype, buffer } = file;
    // const uploadRes = await this.uploadService.handleUpload({
    //   originName: originalname,
    //   buffer,
    //   mimetype,
    //   type: body.type,
    // });
    // return {
    //   ...uploadRes,
    //   url: "/api/file/image/preview/" + uploadRes.filename,
    // };
  }

  // 大文件上传
  @Post("/testing-file/upload/chunk")
  @HttpCode(HttpStatus.OK)
  @Header("Content-Type", "application/json")
  @UseInterceptors(FileInterceptor("chunk")) // 二进制文件
  async uploadBiggerFile(@Body() body: IFileProp, @UploadedFile() chunk: Express.Multer.File) {
    // const { index, hash, originName, type } = body;
    // const { buffer, mimetype } = chunk;
    // return await this.uploadService.handleChunkUpload({ originName, chunk: buffer, mimetype, type, index, hash });
  }

  // 根据文件hash，获取已经上传的chunk
  @Get("/testing-file/upload/chunk")
  @HttpCode(HttpStatus.OK)
  @Header("Content-Type", "application/json")
  async getUploadedChunks(@Query() query: IFileProp) {
    // const { hash, originName, type } = query;
    // return await this.uploadService.getUploadedChunks({ hash, originName, type });
  }

  // 合并大文件
  @Post("/testing-file/upload/chunk/merge")
  @HttpCode(HttpStatus.OK)
  @Header("Content-Type", "application/json")
  async mergeChunk(@Body() body: IFileProp) {
    // const { type, originName, hash } = body;
    // return await this.uploadService.mergeChunks({ originName, type, hash });
  }

  // 查看图片
  @Get("/testing-file/image/preview/:filename")
  @Header("Content-Type", "image/jpg")
  async imagePreview(@Param("filename") filename: string) {
    // const imgPath = await this.uploadService.getImagePreview(filename);
    // const writer = createReadStream(imgPath);
    // return new StreamableFile(writer);
  }
}
