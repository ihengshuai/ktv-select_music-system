import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { FileSystemService } from "@/shared/file-system/file-system.service";
import { generateStaticTicket } from "@/utils";

import { CreateFileDTO } from "../static/dto/file.dto";

@Controller("/testing")
export class TestingController {
  @Get("file")
  async getFile() {
    const fileList = await FileSystemService.getFileList();

    return fileList;
  }

  @Post("file")
  @UseInterceptors(FileInterceptor("file")) // 二进制文件
  async uploadFile(@Body() payload: CreateFileDTO, @UploadedFile() file: Express.Multer.File) {
    const res = await FileSystemService.uploadFile(payload, file.buffer, file.originalname);

    return res;
  }

  @Get("encryption")
  async getEncryption() {
    const res = generateStaticTicket(1000 * 20);
    return res;
  }
}
