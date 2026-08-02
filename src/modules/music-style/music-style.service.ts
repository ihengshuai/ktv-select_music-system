import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { PaginationDTO } from "@/dto/base-pagination.dto";

import { QueryMusicStyleDTO, CreateMusicStyleDTO, UpdateMusicStyleDTO } from "./dto/music-style.dto";
import { MusicStyleEntity } from "./entity/music-style.entity";

@Injectable()
export class MusicStyleService {
  constructor(
    @InjectRepository(MusicStyleEntity)
    private readonly musicStyleRepository: Repository<MusicStyleEntity>
  ) {}

  /** 获取风格列表 */
  async getMusicStyleList(query: QueryMusicStyleDTO, pagination: PaginationDTO) {
    const styleBuilder = this.musicStyleRepository.createQueryBuilder("style");

    if (query.keywords) {
      styleBuilder.andWhere("style.name like :keywords", {
        keywords: `%${query.keywords}%`,
      });
    }

    const [items, total] = await styleBuilder
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

  /** 新增风格 */
  async createMusicStyle(data: CreateMusicStyleDTO) {
    if (await this.findStyleBy("name", data.name)) throw new BadRequestException("风格名称已存在");

    return await this.musicStyleRepository.save(data);
  }

  /** 修改风格 */
  async updateMusicStyle(id: number, data: UpdateMusicStyleDTO) {
    const hasStyle = await this.musicStyleRepository.findOneBy({ id });

    if (!hasStyle) throw new NotFoundException("风格不存在");

    const sameNameStyle = await this.findStyleBy("name", data.name);
    if (sameNameStyle && sameNameStyle.id !== Number(id)) throw new BadRequestException("风格名称已存在");

    const { affected } = await this.musicStyleRepository.update(id, data);

    return affected > 0;
  }

  /** 删除风格 */
  async removeMusicStyle(id: number) {
    const hasStyle = await this.musicStyleRepository.findOneBy({ id });

    if (!hasStyle) throw new NotFoundException("风格不存在");

    const { affected } = await this.musicStyleRepository.delete(id);

    return affected > 0;
  }

  async findStyleBy(key: string, value: string) {
    return await this.musicStyleRepository.findOneBy({ [key]: value });
  }
}
