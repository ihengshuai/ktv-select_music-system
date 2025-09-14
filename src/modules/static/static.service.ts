import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { PaginationDTO } from "@/dto/base-pagination.dto";
import { BaseListResultVO } from "@/vo/base-list-result.vo";

import { SaveFileDTO } from "./dto/file.dto";
import { StaticEntity } from "./entities/static.entity";

@Injectable()
export class StaticService {
  constructor(
    @InjectRepository(StaticEntity)
    private readonly staticRepository: Repository<StaticEntity>
  ) {}

  async create(payload: SaveFileDTO) {
    const res = await this.staticRepository.save(payload);
    return await this.staticRepository.findOneBy({ id: res.id });
  }

  async findAll(pagination: PaginationDTO) {
    const queryBuilder = this.staticRepository.createQueryBuilder("s");

    const [items, count] = await queryBuilder
      .skip((pagination.page - 1) * pagination.size)
      .take(pagination.size)
      .getManyAndCount();

    return BaseListResultVO.from(items, { ...pagination, total: count });
  }
}
