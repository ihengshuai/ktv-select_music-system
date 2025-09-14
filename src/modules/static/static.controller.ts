import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import axios from "axios";
import { Response } from "express";

import { HttpSignature, OriginalResponse, RequestPath, Token } from "@/common/decorator";
import { AuthenticationGuard } from "@/common/guard/authentication-controller.guard";
import { TryTakeTokenInterceptor } from "@/common/interceptor/try-take-token.interceptor";
import { OSS_CONFIG } from "@/config/oss.config";
import { PaginationDTO } from "@/dto/base-pagination.dto";
import { FileSystemService } from "@/shared/file-system/file-system.service";
import type { IToken } from "@/typings/application";
import { generateStaticTicket, verifyStaticTicket } from "@/utils";

import { CreateFileDTO, SaveFileDTO } from "./dto/file.dto";
import { StaticService } from "./static.service";

const { OSS_DOMAIN } = OSS_CONFIG;

@Controller("/static")
export class StaticController {
  constructor(private readonly staticService: StaticService) {}

  /** 访问静态资源 */
  @Get("s3/*")
  @UseInterceptors(TryTakeTokenInterceptor)
  @HttpSignature(false)
  @OriginalResponse()
  async viewResource(
    @Param("0") fileName: string,
    @Query("ticket") ticket: string,
    @Query() query: any,
    @Token() token: IToken,
    @RequestPath() path: string,
    @Res() response: Response
  ) {
    if (!ticket) throw new ForbiddenException({ error: "禁止访问!" });

    const isExpiredTicket = !verifyStaticTicket(ticket);
    if (isExpiredTicket && !token) throw new ForbiddenException({ error: "禁止访问!" });

    if (isExpiredTicket) {
      const originQuery = {
        ...query,
      };
      originQuery.ticket = generateStaticTicket();
      const redirectURL = `${path}?${Object.keys(originQuery)
        .map(key => `${key}=${originQuery[key]}`)
        .join("&")}`;

      return response.redirect(redirectURL);
    }

    const resourceURL = `${OSS_DOMAIN}/${fileName}`;

    try {
      const res = await axios.get(resourceURL, {
        responseType: "stream",
      });

      return res.data.pipe(response);
    } catch (error) {
      throw new NotFoundException({ error: "资源不存在," + error.message });
    }
  }

  @Post("upload")
  @UseGuards(AuthenticationGuard)
  @UseInterceptors(FileInterceptor("file"))
  async uploadResource(
    @Body() payload: CreateFileDTO,
    @UploadedFile() file: Express.Multer.File,
    @Token() token: IToken
  ) {
    try {
      const { name } = await FileSystemService.uploadFile(payload, file.buffer, file.originalname);

      const savePayload: SaveFileDTO = {
        ...payload,
        uid: token.uid,
        url: name,
      };

      const res = await this.staticService.create(savePayload);

      if (!res) {
        throw new BadRequestException({ error: "上传失败" });
      }

      return res;
    } catch (error) {
      throw new BadRequestException({ error: "上传失败", message: error.message });
    }
  }

  @Get("files")
  @UseGuards(AuthenticationGuard)
  async getResources(@Query() pagination: PaginationDTO) {
    return await this.staticService.findAll(pagination);
  }
}
