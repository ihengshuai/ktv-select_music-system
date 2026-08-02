import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { YON } from "@/consts";
import { MUSIC_STATUS } from "@/consts/music.const";
import { OrderDTO } from "@/dto/base-order.dto";
import { PaginationDTO } from "@/dto/base-pagination.dto";
import { generateStaticURL } from "@/utils";

import { CreateMusicDTO, MusicListQueryDTO, UpdateMusicDTO } from "./dto/music.dto";
import { MusicEntity } from "./entity/music.entity";
import { MusicVO } from "./vo/music.vo";
import { MusicLanguageEntity } from "../music-language/entity/music-language.entity";
import { MusicRegionEntity } from "../music-region/entity/music-region.entity";
import { MusicSingerEntity } from "../music-singer/entity/music-singer.entity";
import { MusicStyleEntity } from "../music-style/entity/music-style.entity";
import { MusicTagEntity } from "../music-tag/entity/music-tag.entity";
import { StaticEntity } from "../static/entities/static.entity";
import { UserEntity } from "../user/entities/user.entity";

@Injectable()
export class MusicService {
  constructor(
    @InjectRepository(MusicEntity)
    private readonly musicRepository: Repository<MusicEntity>,
    @InjectRepository(MusicSingerEntity)
    private readonly musicSingerRepository: Repository<MusicSingerEntity>,
    @InjectRepository(MusicTagEntity)
    private readonly musicTagRepository: Repository<MusicTagEntity>,
    @InjectRepository(MusicLanguageEntity)
    private readonly musicLanguageRepository: Repository<MusicLanguageEntity>,
    @InjectRepository(MusicRegionEntity)
    private readonly musicRegionRepository: Repository<MusicRegionEntity>,
    @InjectRepository(MusicStyleEntity)
    private readonly musicStyleRepository: Repository<MusicStyleEntity>
  ) {}

  // ========= 歌曲管理 =========
  /** 获取歌曲列表 */
  async getSongList<T = MusicVO>(
    data: MusicListQueryDTO,
    pagination: PaginationDTO,
    order: OrderDTO
  ): Promise<{ items: T[]; pager: PaginationDTO }> {
    const musicBuilder = this.musicRepository
      .createQueryBuilder("music")
      .leftJoin(UserEntity, "user", "user.uid = music.createBy")
      .leftJoin(MusicSingerEntity, "singer", "singer.id = music.singer")
      .leftJoin(MusicRegionEntity, "region", "region.id = music.region")
      .leftJoin(MusicLanguageEntity, "language", "language.id = music.language")
      .leftJoin(StaticEntity, "static", "static.id = music.audio")
      .select([
        "music.uid uid",
        "music.title title",
        "music.remark remark",
        "music.audio audio ",
        "music.video video",
        "music.lyrics lyrics",
        "music.status status",
        "music.heat heat",
        "music.recommend recommend",
        "music.tag tag",
        "music.style style",
        "music.createTime createTime",
        "singer.name singerName",
        "music.singer singer",
        "music.region region",
        "region.name regionName",
        "music.language language",
        "language.name languageName",
        "user.uid createById",
        "user.nickname createBy",
        "static.url audioUrl",
        "static.location audioLocation",
      ]);

    if (data.status) {
      musicBuilder.andWhere("music.status = :status", {
        status: data.status,
      });
    }

    if (data.recommend) {
      musicBuilder.andWhere("music.recommend = :recommend", {
        recommend: data.recommend,
      });
    }

    if (data.singer) {
      musicBuilder.andWhere("music.singer = :singer", {
        singer: data.singer,
      });
    }

    if (data.region) {
      musicBuilder.andWhere("music.region = :region", {
        region: data.region,
      });
    }

    if (data.language) {
      musicBuilder.andWhere("music.language = :language", {
        language: data.language,
      });
    }

    if (data.keywords) {
      musicBuilder.andWhere("(music.title LIKE :keywords or music.remark LIKE :keywords)", {
        keywords: `%${data.keywords}%`,
      });
    }

    if (data.title) {
      musicBuilder.andWhere("music.title like :title", {
        title: `%${data.title}%`,
      });
    }

    if (data.style) {
      const style = data.style;
      const styles = style.split(",");
      let sqlStr = `(find_in_set(:style, style) `;
      let styleParams = {
        style: styles[0],
      };

      styles.forEach((style, idx) => {
        if (idx === 0) return;
        sqlStr += `or find_in_set(:style_${idx}, style) `;
        styleParams[`style_${idx}`] = style;
      });

      sqlStr += ")";

      musicBuilder.andWhere(sqlStr, styleParams);
    }

    if (data.tag) {
      const tag = JSON.parse(JSON.stringify(data.tag));
      const tags = tag.split(",");
      let sqlStr = `(find_in_set(:tag, tag) `;
      let tagParams = {
        tag: tags[0],
      };

      tags.forEach((tag, idx) => {
        if (idx === 0) return;
        sqlStr += `or find_in_set(:tag_${idx}, tag) `;
        tagParams[`tag_${idx}`] = tag;
      });

      sqlStr += ")";

      musicBuilder.andWhere(sqlStr, tagParams);
    }

    let items = await musicBuilder
      .orderBy(order.orderBy, order.order)
      .limit(pagination.size)
      .offset((pagination.page - 1) * pagination.size)
      .getRawMany();

    items = items.map(l => {
      const result = { ...l };
      result.audioUrl = generateStaticURL(l.audioUrl, l.audioLocation);
      delete result.audioLocation;

      return result;
    });

    // 获取标签数据
    const tagsQuery = this.musicTagRepository.createQueryBuilder("t");
    const tags = await tagsQuery.select(["t.id id", "t.name name"]).getRawMany();
    const tagRecord = tags.reduce((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {});
    items = items.map(item => {
      const result = {
        ...item,
        heat: parseInt(item.heat),
      };

      if (result.tag) {
        result.tag = item.tag.split(",").map(tagId => tagRecord[tagId]);
      }

      return result;
    });

    // 获取风格数据
    const stylesQuery = this.musicStyleRepository.createQueryBuilder("style");
    const styles = await stylesQuery.getMany();
    const styleRecord = styles.reduce((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {});
    items = items.map(item => {
      const result = {
        ...item,
      };

      if (result.style) {
        result.style = item.style.split(",").map(styleId => styleRecord[styleId]);
      }

      return result;
    });

    // 获取音乐条目
    const total = await musicBuilder.getCount();

    return {
      items,
      pager: {
        total,
        page: pagination.page,
        size: pagination.size,
      },
    };
  }

  /**
   * 创建歌曲
   */
  async createSong(data: CreateMusicDTO) {
    return await this.musicRepository.save(data);
  }

  /**
   * 获取歌曲详情
   */
  async getSongDetail(songId: string) {
    const builder = this.musicRepository.createQueryBuilder("music");

    builder
      .where("music.uid = :songId", { songId })
      .leftJoin(UserEntity, "user", "user.uid = music.createBy")
      .leftJoin(MusicSingerEntity, "singer", "singer.id = music.singer")
      .leftJoin(MusicRegionEntity, "region", "region.id = music.region")
      .leftJoin(MusicLanguageEntity, "language", "language.id = music.language")
      .select([
        "music.uid uid",
        "music.title title",
        "music.remark remark",
        "music.audio audio ",
        "music.video video",
        "music.lyrics lyrics",
        "music.status status",
        "music.heat heat",
        "music.recommend recommend",
        "music.tag tag",
        "music.style style",
        "music.createTime createTime",
        "singer.name singerName",
        "music.singer singer",
        "music.region region",
        "region.name regionName",
        "music.language language",
        "language.name languageName",
        "user.uid createById",
        "user.nickname createBy",
      ]);

    const res = await builder.getRawOne();

    if (!res) throw new NotFoundException("歌曲不存在");

    // 获取标签数据
    const tagsQuery = this.musicTagRepository.createQueryBuilder("t");
    const tags = await tagsQuery.select(["t.id id", "t.name name"]).getRawMany();
    const tagRecord = tags.reduce((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {});
    if (res.tag) {
      res.tag = res.tag.split(",").map(tagId => tagRecord[tagId]);
    }

    // 获取风格数据
    const stylesQuery = this.musicStyleRepository.createQueryBuilder("style");
    const styles = await stylesQuery.getMany();
    const styleRecord = styles.reduce((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {});
    if (res.style) {
      res.style = res.style.split(",").map(styleId => styleRecord[styleId]);
    }

    return res;
  }

  /**
   * 更新歌曲
   */
  async updateSong(songId: string, data: UpdateMusicDTO) {
    const hasSong = await this.musicRepository.findOneBy({ uid: songId });

    if (!hasSong) throw new NotFoundException("歌曲不存在");

    const { affected } = await this.musicRepository.update({ uid: songId }, data);

    return affected > 0;
  }

  /**
   * 删除歌曲
   */
  async removeSong(songId: string) {
    const hasSong = await this.musicRepository.findOneBy({ uid: songId });

    if (!hasSong) throw new NotFoundException("歌曲不存在");

    const { affected } = await this.musicRepository.delete({ uid: songId });

    return affected > 0;
  }

  /**
   * 上下架歌曲
   */
  async updateSongStatus(songId: string, status: MUSIC_STATUS) {
    const hasSong = await this.musicRepository.findOneBy({ uid: songId });

    if (!hasSong) throw new NotFoundException("歌曲不存在");

    const { affected } = await this.musicRepository.update({ uid: songId }, { status });

    return affected > 0;
  }

  /**
   * 推荐/取消推荐歌曲
   */
  async updateSongRecommend(songId: string, recommend: YON) {
    const hasSong = await this.musicRepository.findOneBy({ uid: songId });

    if (!hasSong) throw new NotFoundException("歌曲不存在");

    const { affected } = await this.musicRepository.update({ uid: songId }, { recommend });

    return affected > 0;
  }
}
