import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { PaginationDTO } from "@/dto/base-pagination.dto";

import { QueryFileDTO, SaveFileDTO } from "./dto/file.dto";
import { StaticEntity } from "./entities/static.entity";
import { StaticVO } from "./vo/static.vo";
import { UserEntity } from "../user/entities/user.entity";

@Injectable()
export class StaticService {
  constructor(
    @InjectRepository(StaticEntity)
    private readonly staticRepository: Repository<StaticEntity>
  ) {}

  async create(payload: SaveFileDTO) {
    const res = await this.staticRepository.save(payload);
    const entity = new StaticEntity();
    Object.assign(entity, res);

    return entity.toJSON();
  }

  async findOne(id: number) {
    const entity = await this.staticRepository.findOneBy({ id });

    return entity?.toJSON();
  }

  async delete(id: number) {
    const entity = await this.staticRepository.findOneBy({ id });

    return await this.staticRepository.remove(entity);
  }

  async findAll(data: QueryFileDTO, pagination: PaginationDTO) {
    const queryBuilder = this.staticRepository.createQueryBuilder("s");

    const sql = queryBuilder
      .leftJoinAndSelect(UserEntity, "u", "u.uid = s.uid")
      .select([
        "s.id as id",
        "s.title as title",
        "s.url as url",
        "s.uid as uid",
        "s.type as type",
        "s.location as location",
        "s.remark as remark",
        "s.fileName as fileName",
        "s.createTime as createTime",
        "s.updateTime as updateTime",
        "u.nickname as nickname",
      ]);

    if (data.keywords) {
      sql.andWhere("(s.title like :keywords or s.remark like :keywords or s.fileName like :keywords)", {
        keywords: `%${data.keywords}%`,
      });
    }

    if (data.location) {
      sql.andWhere("s.location = :location", { location: data.location });
    }

    if (data.type) {
      sql.andWhere("s.type = :type", { type: data.type });
    }

    const items = await sql
      .limit(pagination.size)
      .offset((pagination.page - 1) * pagination.size)
      .getRawMany();
    const total = await sql.getCount();

    return {
      items: items.map<StaticVO>(l => new StaticVO(l).toJSON()),
      pager: { ...pagination, total },
    };
  }

  /** 获取指定文件信息 */
  async findDetailFile(id: number) {
    if (!(await this.findOne(id))) throw new NotFoundException("文件不存在");

    const queryBuilder = this.staticRepository.createQueryBuilder("s");

    const sql = queryBuilder
      .where("s.id = :id", { id })
      .leftJoinAndSelect(UserEntity, "u", "u.uid = s.uid")
      .select([
        "s.id as id",
        "s.title as title",
        "s.url as url",
        "s.uid as uid",
        "s.type as type",
        "s.location as location",
        "s.remark as remark",
        "s.fileName as fileName",
        "s.createTime as createTime",
        "s.updateTime as updateTime",
        "u.nickname as nickname",
      ]);

    const res = await sql.getRawOne();

    return new StaticVO(res).toJSON();
  }
}
