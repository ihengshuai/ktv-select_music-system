import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { Role } from "@/common/decorator";
import { AuthenticationBaseGuard } from "@/common/guard/authentication-base.guard";
import { AuthenticationRoleGuard } from "@/common/guard/authentication-role.guard";
import { ApiListResponse, ApiModelResponse } from "@/common/swagger";
import { USER_ROLE } from "@/consts";
import { PaginationDTO } from "@/dto/base-pagination.dto";
import { BaseListResponseVO } from "@/vo/base-list-response.vo";

import { CreateEnumCodeDTO, QueryEnumCodeDTO, UpdateEnumCodeDTO } from "./dto/enum-code.dto";
import { EnumCodeService } from "./enum-code.service";
import { EnumCodeVO } from "./vo/enum-code.vo";

@ApiTags("常量管理")
@UseGuards(AuthenticationBaseGuard, AuthenticationRoleGuard)
@Role(USER_ROLE.SUPER, USER_ROLE.ADMIN)
@Controller("enum-code")
export class EnumCodeController {
  constructor(private readonly enumCodeService: EnumCodeService) {}

  /**
   * 查询枚举列表
   */
  @ApiOperation({ summary: "查询枚举列表" })
  @ApiListResponse(EnumCodeVO)
  @Get()
  async getEnumCodeList(@Query() query: QueryEnumCodeDTO, @Query() pagination: PaginationDTO) {
    const { items, pager } = await this.enumCodeService.getEnumCodeList(query, pagination);

    return BaseListResponseVO.success(items, pager);
  }

  /**
   * 查询指定枚举
   */
  @ApiOperation({ summary: "查询指定枚举" })
  @ApiModelResponse(EnumCodeVO)
  @Get("detail")
  async getEnumCode(@Query() query: QueryEnumCodeDTO) {
    return await this.enumCodeService.getEnumCode(query.code, query.status);
  }

  /**
   * 创建枚举
   */
  @ApiOperation({ summary: "创建枚举" })
  @ApiModelResponse(EnumCodeVO)
  @Post()
  async createEnumCode(@Body() payload: CreateEnumCodeDTO) {
    return await this.enumCodeService.createEnumCode(payload);
  }

  /**
   * 更新枚举
   */
  @ApiOperation({ summary: "更新枚举" })
  @ApiOkResponse({ type: Boolean })
  @Post("update/:code")
  async updateEnumCode(@Param("code") code: string, @Body() payload: UpdateEnumCodeDTO) {
    return await this.enumCodeService.updateEnumCode(code, payload);
  }

  /**
   * 删除枚举
   */
  @ApiOperation({ summary: "删除枚举" })
  @ApiOkResponse({ type: Boolean })
  @Delete(":code")
  async deleteEnumCode(@Param("code") code: string) {
    return await this.enumCodeService.deleteEnumCode(code);
  }
}
