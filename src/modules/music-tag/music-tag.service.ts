import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { PaginationDTO } from "@/dto/base-pagination.dto";

import { QueryMusicTagDTO, CreateMusicTagDTO, UpdateMusicTagDTO } from "./dto/music-tag.dto";
import { MusicTagEntity } from "./entity/music-tag.entity";

@Injectable()
export class MusicTagService {
  constructor(
    @InjectRepository(MusicTagEntity)
    private readonly musicTagRepository: Repository<MusicTagEntity>
  ) {}

  /** 获取标签列表 */
  async getMusicTagList(query: QueryMusicTagDTO, pagination: PaginationDTO) {
    const tagBuilder = this.musicTagRepository.createQueryBuilder("tag");
    if (query.keywords) {
      tagBuilder.andWhere("tag.name like :keywords", {
        keywords: `%${query.keywords}%`,
      });
    }

    const [items, total] = await tagBuilder
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

  /** 创建标签 */
  async createMusicTag(data: CreateMusicTagDTO) {
    if (await this.findMusicTag(data.name)) throw new BadRequestException("标签已存在");

    return await this.musicTagRepository.save(data);
  }

  /** 修改标签 */
  async updateMusicTag(id: number, data: UpdateMusicTagDTO) {
    const hasTag = await this.musicTagRepository.findOneBy({ id });

    if (!hasTag) throw new NotFoundException("标签不存在");

    const sameNameTag = await this.findMusicTag(data.name);
    if (sameNameTag && sameNameTag.id !== Number(id)) throw new BadRequestException("标签已存在");

    const { affected } = await this.musicTagRepository.update(id, data);

    return affected > 0;
  }

  /** 删除标签 */
  async removeMusicTag(id: number) {
    const hasTag = await this.musicTagRepository.findOneBy({ id });

    if (!hasTag) throw new NotFoundException("标签不存在");

    const { affected } = await this.musicTagRepository.delete(id);

    return affected > 0;
  }

  async findMusicTag(name: string) {
    return await this.musicTagRepository.findOneBy({ name });
  }
}
