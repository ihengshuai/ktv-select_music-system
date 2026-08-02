import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { PaginationDTO } from "@/dto/base-pagination.dto";

import { QueryMusicSingerDTO, CreateMusicSingerDTO, UpdateMusicSingerDTO } from "./dto/music-singer.dto";
import { MusicSingerEntity } from "./entity/music-singer.entity";

@Injectable()
export class MusicSingerService {
  constructor(
    @InjectRepository(MusicSingerEntity)
    private readonly musicSingerRepository: Repository<MusicSingerEntity>
  ) {}

  /** 获取歌手列表 */
  async getSingerList(query: QueryMusicSingerDTO, pagination: PaginationDTO) {
    const singerBuilder = this.musicSingerRepository.createQueryBuilder("singer");

    if (query.keywords) {
      singerBuilder.andWhere("singer.name like :keywords", {
        keywords: `%${query.keywords}%`,
      });
    }

    const [items, total] = await singerBuilder
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

  /** 创建歌手 */
  async createSinger(data: CreateMusicSingerDTO) {
    const hasSinger = await this.musicSingerRepository.findOneBy({ name: data.name });

    if (hasSinger) throw new BadRequestException("歌手已存在");

    return await this.musicSingerRepository.save(data);
  }

  /** 修改歌手 */
  async updateSinger(id: number, data: UpdateMusicSingerDTO) {
    const hasSinger = await this.musicSingerRepository.findOneBy({ id });

    if (!hasSinger) throw new NotFoundException("歌手不存在");

    const sameNameSinger = await this.findSinger(data.name);
    if (sameNameSinger && sameNameSinger.id !== Number(id)) throw new BadRequestException("歌手已存在");

    const { affected } = await this.musicSingerRepository.update(id, data);

    return affected > 0;
  }

  /** 删除歌手 */
  async removeSinger(id: number) {
    const hasSinger = await this.musicSingerRepository.findOneBy({ id });

    if (!hasSinger) throw new NotFoundException("歌手不存在");

    const { affected } = await this.musicSingerRepository.delete(id);

    return affected > 0;
  }

  async findSinger(name: string) {
    return await this.musicSingerRepository.findOneBy({ name });
  }
}
