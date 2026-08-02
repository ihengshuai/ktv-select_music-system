import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { PaginationDTO } from "@/dto/base-pagination.dto";

import { QueryMusicRegionDTO, CreateMusicRegionDTO, UpdateMusicRegionDTO } from "./dto/music-region.dto";
import { MusicRegionEntity } from "./entity/music-region.entity";

@Injectable()
export class MusicRegionService {
  constructor(
    @InjectRepository(MusicRegionEntity)
    private readonly musicRegionRepository: Repository<MusicRegionEntity>
  ) {}

  /** 获取地区列表 */
  async getMusicRegionList(query: QueryMusicRegionDTO, pagination: PaginationDTO) {
    const regionBuilder = this.musicRegionRepository.createQueryBuilder("region");

    if (query.keywords) {
      regionBuilder.andWhere("region.name like :keywords", {
        keywords: `%${query.keywords}%`,
      });
    }

    const [items, total] = await regionBuilder
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

  /** 新增地区 */
  async createMusicRegion(data: CreateMusicRegionDTO) {
    if (await this.findMusicRegion(data.name)) throw new BadRequestException("地区已存在");

    return this.musicRegionRepository.save(data);
  }

  /** 修改地区 */
  async updateMusicRegion(id: number, data: UpdateMusicRegionDTO) {
    const hasRegion = await this.musicRegionRepository.findOneBy({ id });

    if (!hasRegion) throw new NotFoundException("地区不存在");

    const sameNameRegion = await this.findMusicRegion(data.name);
    if (sameNameRegion && sameNameRegion.id !== Number(id)) throw new BadRequestException("地区已存在");

    const { affected } = await this.musicRegionRepository.update(id, data);

    return affected > 0;
  }

  /** 删除地区 */
  async removeMusicRegion(id: number) {
    const hasRegion = await this.musicRegionRepository.findOneBy({ id });

    if (!hasRegion) throw new NotFoundException("地区不存在");

    const { affected } = await this.musicRegionRepository.delete(id);

    return affected > 0;
  }

  async findMusicRegion(name: string) {
    return this.musicRegionRepository.findOneBy({ name });
  }
}
