import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { PaginationDTO } from "@/dto/base-pagination.dto";

import { QueryMusicLanguageDTO, CreateMusicLanguageDTO, UpdateMusicLanguageDTO } from "./dto/music-language.dto";
import { MusicLanguageEntity } from "./entity/music-language.entity";

@Injectable()
export class MusicLanguageService {
  constructor(
    @InjectRepository(MusicLanguageEntity)
    private readonly musicLanguageRepository: Repository<MusicLanguageEntity>
  ) {}

  // ========= 歌曲语种管理 =========
  /** 获取歌曲语种列表 */
  async getMusicLanguageList(query: QueryMusicLanguageDTO, pagination: PaginationDTO) {
    const languageBuilder = this.musicLanguageRepository.createQueryBuilder("language");

    if (query.keywords) {
      languageBuilder.andWhere("language.name like :keywords", {
        keywords: `%${query.keywords}%`,
      });
    }

    const [items, total] = await languageBuilder
      .skip((pagination.page - 1) * pagination.size)
      .take(pagination.size)
      .getManyAndCount();

    return {
      pager: {
        total,
        page: pagination.page,
        size: pagination.size,
      },
      items,
    };
  }

  /** 创建歌曲语种 */
  async createMusicLanguage(data: CreateMusicLanguageDTO) {
    if (await this.findMusicLanguage(data.name)) throw new BadRequestException("语种已存在");

    return await this.musicLanguageRepository.save(data);
  }

  /** 修改歌曲语言 */
  async updateMusicLanguage(id: number, data: UpdateMusicLanguageDTO) {
    const hasLanguage = await this.musicLanguageRepository.findOneBy({ id });

    if (!hasLanguage) throw new NotFoundException("语种不存在");

    const sameNameLanguage = await this.findMusicLanguage(data.name);
    if (sameNameLanguage && sameNameLanguage.id !== Number(id)) throw new BadRequestException("语种已存在");

    const { affected } = await this.musicLanguageRepository.update(id, data);

    return affected > 0;
  }

  /** 删除歌曲语种 */
  async removeMusicLanguage(id: number) {
    const hasLanguage = await this.musicLanguageRepository.findOneBy({ id });

    if (!hasLanguage) throw new NotFoundException("语种不存在");

    const { affected } = await this.musicLanguageRepository.delete(id);

    return affected > 0;
  }

  async findMusicLanguage(name: string) {
    return await this.musicLanguageRepository.findOneBy({ name });
  }
}
