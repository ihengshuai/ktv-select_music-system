import { Body, Controller, Delete, Get, Logger, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { Role, Token } from "@/common/decorator";
import { AuthenticationBaseGuard } from "@/common/guard/authentication-base.guard";
import { AuthenticationRoleGuard } from "@/common/guard/authentication-role.guard";
import { RequiredPipe } from "@/common/pipe/required.pipe";
import { ValidateEnumPipe } from "@/common/pipe/validate-enum.pipe";
import { ApiListResponse, ApiModelResponse } from "@/common/swagger";
import { USER_ROLE, YON } from "@/consts";
import { MUSIC_STATUS } from "@/consts/music.const";
import { OrderDTO } from "@/dto/base-order.dto";
import { PaginationDTO } from "@/dto/base-pagination.dto";
import type { IToken } from "@/typings/application";
import { BaseListResponseVO } from "@/vo/base-list-response.vo";
import { BaseModelResponseVO } from "@/vo/base-model-response.vo";

import { CreateMusicDTO, MusicListQueryDTO, UpdateMusicDTO } from "./dto/music.dto";
import { MusicService } from "./music.service";
import { MusicVO } from "./vo/music.vo";

@ApiTags("歌曲管理")
@Controller("/music")
export class MusicController {
  private readonly logger = new Logger(MusicController.name);

  constructor(private readonly musicService: MusicService) {}

  // ========= 歌曲管理 =========
  /**
   * 获取歌曲列表
   */
  @ApiOperation({ summary: "获取歌曲列表(管理端)" })
  @ApiListResponse(MusicVO)
  @UseGuards(AuthenticationBaseGuard, AuthenticationRoleGuard)
  @Role(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Get("")
  async getSongList(
    @Query() musicListQueryDTO: MusicListQueryDTO,
    @Query() pagination: PaginationDTO,
    @Query() order: OrderDTO
  ) {
    const { items, pager } = await this.musicService.getSongList(musicListQueryDTO, pagination, order);

    return BaseListResponseVO.success(items, pager);
  }

  /**
   * 新增歌曲
   */
  @ApiOperation({ summary: "新增歌曲" })
  @ApiModelResponse(MusicVO)
  @UseGuards(AuthenticationBaseGuard, AuthenticationRoleGuard)
  @Role(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Post("")
  async createSong(@Body() createMusicDTO: CreateMusicDTO, @Token() token: IToken) {
    this.logger.log(createMusicDTO);

    const payload: CreateMusicDTO = {
      ...createMusicDTO,
      createBy: token.uid,
    };

    return this.musicService.createSong(payload);
  }

  /**
   * 获取歌曲详情
   */
  @ApiOperation({ summary: "获取歌曲详情" })
  @ApiModelResponse(MusicVO)
  @UseGuards(AuthenticationBaseGuard, AuthenticationRoleGuard)
  @Role(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Get("detail/:id")
  async getSongDetail(@Param("id") songId: string) {
    const music = await this.musicService.getSongDetail(songId);

    return BaseModelResponseVO.success(music);
  }

  /**
   * 修改歌曲
   */
  @ApiOperation({ summary: "修改歌曲" })
  @ApiResponse({ status: 200, description: "修改成功", type: Boolean })
  @UseGuards(AuthenticationBaseGuard, AuthenticationRoleGuard)
  @Role(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Post("update/:id")
  async updateSong(@Param("id") songId: string, @Body() updateMusicDTO: UpdateMusicDTO) {
    const res = await this.musicService.updateSong(songId, updateMusicDTO);

    return BaseModelResponseVO.success(res);
  }

  /**
   * 删除歌曲
   */
  @ApiOperation({ summary: "删除歌曲" })
  @ApiResponse({ status: 200, description: "修改成功", type: Boolean })
  @UseGuards(AuthenticationBaseGuard, AuthenticationRoleGuard)
  @Role(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Delete("delete/:id")
  async removeSong(@Param("id") songId: string) {
    const res = await this.musicService.removeSong(songId);

    return BaseModelResponseVO.success(res);
  }

  /**
   * 上下架歌曲
   */
  @ApiOperation({ summary: "上下架歌曲" })
  @ApiResponse({ status: 200, description: "修改成功", type: Boolean })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        status: {
          type: "string",
          description: "歌曲状态",
          enum: [MUSIC_STATUS.DISABLED, MUSIC_STATUS.ENABLED],
        },
      },
    },
  })
  @UseGuards(AuthenticationBaseGuard, AuthenticationRoleGuard)
  @Role(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Post("status/:id")
  async updateSongStatus(
    @Param("id") songId: string,
    @Body("status", new RequiredPipe(), new ValidateEnumPipe("status")) status: MUSIC_STATUS
  ) {
    const res = await this.musicService.updateSongStatus(songId, status);

    return BaseModelResponseVO.success(res);
  }

  /**
   * 推荐/取消推荐歌曲
   */
  @ApiOperation({ summary: "推荐/取消推荐歌曲" })
  @ApiResponse({ status: 200, description: "修改成功", type: Boolean })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        recommend: {
          type: "string",
          description: "是否推荐",
          enum: [YON.Y, YON.N],
        },
      },
    },
  })
  @UseGuards(AuthenticationBaseGuard, AuthenticationRoleGuard)
  @Role(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Post("recommend/:id")
  async updateSongRecommend(
    @Param("id") songId: string,
    @Body("recommend", new RequiredPipe(), new ValidateEnumPipe("recommend")) recommend: YON
  ) {
    const res = await this.musicService.updateSongRecommend(songId, recommend);

    return BaseModelResponseVO.success(res);
  }
}
