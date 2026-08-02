import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Inject,
  Logger,
  NotFoundException,
  Param,
  Post,
  Query,
  Redirect,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { HttpSignature, NoWrapResponse, RequestPath, Role, Token } from "@/common/decorator";
import { AuthenticationBaseGuard } from "@/common/guard/authentication-base.guard";
import { AuthenticationRoleGuard } from "@/common/guard/authentication-role.guard";
import { TryTakeTokenInterceptor } from "@/common/interceptor/try-take-token.interceptor";
import { ValidateEnumPipe } from "@/common/pipe/validate-enum.pipe";
import { ApiListResponse, ApiModelResponse } from "@/common/swagger";
import { IFileConfig } from "@/config/file.config";
import { CONFIG_DOMAIN_ENUM, FILE_LOCATION, FILE_TYPE, USER_ROLE } from "@/consts";
import { PaginationDTO } from "@/dto/base-pagination.dto";
import { FileSystemService } from "@/shared/file-system/file-system.service";
import type { IToken } from "@/typings/application";
import { generateStaticTicket, verifyStaticTicket } from "@/utils";
import { BaseListResponseVO } from "@/vo/base-list-response.vo";
import { BaseModelResponseVO } from "@/vo/base-model-response.vo";

import { CreateFileDTO, QueryFileDTO, SaveFileDTO } from "./dto/file.dto";
import { StaticService } from "./static.service";
import { StaticVO } from "./vo/static.vo";

@ApiTags("文件系统")
@Controller("/static")
export class StaticController {
  @Inject(CONFIG_DOMAIN_ENUM.FILE_CONFIG)
  private readonly fileConfig: IFileConfig;

  private readonly logger = new Logger(StaticController.name);

  constructor(private readonly staticService: StaticService) {}

  /**
   * 访问静态资源
   */
  @ApiOperation({ summary: "访问静态资源" })
  @Get("file/*")
  @UseInterceptors(TryTakeTokenInterceptor)
  @HttpSignature(false)
  @NoWrapResponse()
  async viewResource(
    @Param("0") fileName: string,
    @Query("ticket") ticket: string,
    @Query() query: any,
    @Query("location", new ValidateEnumPipe())
    location: FILE_LOCATION,
    @Token() token: IToken,
    @RequestPath() path: string
  ) {
    if (!location) throw new NotFoundException("资源不存在");

    if (!ticket) throw new ForbiddenException("禁止访问");

    const isExpiredTicket = !verifyStaticTicket(ticket);
    if (isExpiredTicket && !token) throw new ForbiddenException("禁止访问");

    if (isExpiredTicket) {
      const originQuery = {
        ...query,
      };
      originQuery.ticket = generateStaticTicket();
      const redirectURL = `${path}?${Object.keys(originQuery)
        .map(key => `${key}=${originQuery[key]}`)
        .join("&")}`;

      return Redirect(redirectURL);
    }

    return FileSystemService.readFile(location, fileName);
  }

  /**
   * 获取文件列表
   */
  @ApiOperation({ summary: "获取文件列表" })
  @ApiListResponse(StaticVO)
  @Get("files")
  @UseGuards(AuthenticationBaseGuard, AuthenticationRoleGuard)
  @Role(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  async getResources(@Query() queryFileDTO: QueryFileDTO, @Query() pagination: PaginationDTO) {
    const res = await this.staticService.findAll(queryFileDTO, pagination);

    return BaseListResponseVO.success(res.items, res.pager);
  }

  /**
   * 获取指定文件信息
   */
  @ApiOperation({ summary: "获取指定文件信息" })
  @ApiModelResponse(StaticVO)
  @Get("file-detail/:id")
  @UseGuards(AuthenticationBaseGuard, AuthenticationRoleGuard)
  @Role(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  async getFileDetail(@Param("id") id: number) {
    const res = await this.staticService.findDetailFile(id);

    return BaseModelResponseVO.success(res);
  }

  /**
   * 上传本地系统
   */
  @ApiOperation({ summary: "上传本地系统" })
  @ApiModelResponse(StaticVO)
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
          description: "要上传的文件",
        },
        type: {
          type: "enum",
          enum: Object.values(FILE_TYPE),
          description: "文件类型",
        },
        title: {
          type: "string",
          description: "文件备注",
          example: "用户头像",
        },
        remark: {
          type: "string",
          description: "文件备注",
        },
      },
      required: ["file", "type"],
    },
  })
  @ApiResponse({ type: SaveFileDTO, description: "上传成功", status: 200 })
  @Post("upload")
  @UseGuards(AuthenticationBaseGuard)
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(@Body() payload: CreateFileDTO, @UploadedFile() file: Express.Multer.File, @Token() token: IToken) {
    try {
      const result = await FileSystemService.uploadFile(FILE_LOCATION.LOCAL, payload, file.buffer, file.originalname);

      const savePayload: SaveFileDTO = {
        ...payload,
        uid: token?.uid,
        url: result.url,
        location: FILE_LOCATION.LOCAL,
        fileName: file.originalname,
      };

      return await this.staticService.create(savePayload);
    } catch (error) {
      this.logger.error("文件上传失败(local)");

      throw error;
    }
  }

  /**
   * 上传OSS
   */
  @ApiOperation({ summary: "上传OSS" })
  @ApiModelResponse(StaticVO)
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
          description: "要上传的文件",
        },
        type: {
          type: "enum",
          enum: Object.values(FILE_TYPE),
          description: "文件类型",
        },
        title: {
          type: "string",
          description: "文件备注",
          example: "用户头像",
        },
        remark: {
          type: "string",
          description: "文件备注",
        },
      },
      required: ["file", "type"],
    },
  })
  @Post("oss/upload")
  @UseGuards(AuthenticationBaseGuard)
  @UseInterceptors(FileInterceptor("file"))
  async uploadOssFile(
    @Body() payload: CreateFileDTO,
    @UploadedFile() file: Express.Multer.File,
    @Token() token: IToken
  ) {
    try {
      const { name } = await FileSystemService.uploadFile(FILE_LOCATION.OSS, payload, file.buffer, file.originalname);

      const savePayload: SaveFileDTO = {
        ...payload,
        uid: token.uid,
        url: name,
        location: FILE_LOCATION.OSS,
        fileName: file.filename,
      };

      const res = await this.staticService.create(savePayload);

      if (!res) {
        throw new BadRequestException("上传失败");
      }

      return res;
    } catch (error: any) {
      throw new BadRequestException(`上传失败(${error.message})`);
    }
  }

  /**
   * 删除文件
   */
  @ApiOperation({ summary: "删除文件" })
  @ApiResponse({ type: Boolean, description: "删除成功", status: 200 })
  @Delete("delete/:id")
  @UseGuards(AuthenticationBaseGuard)
  async deleteFile(@Param("id") id: number) {
    const file = await this.staticService.findOne(id);

    if (!file) throw new NotFoundException("文件不存在");

    await FileSystemService.deleteFile(file);

    await this.staticService.delete(id);

    return true;
  }
}
