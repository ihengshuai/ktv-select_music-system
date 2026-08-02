import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { YON } from "@/consts";
import { PaginationDTO } from "@/dto/base-pagination.dto";

import { CreateEnumCodeDTO, QueryEnumCodeDTO, UpdateEnumCodeDTO } from "./dto/enum-code.dto";
import { EnumCodeEntity } from "./entity/enum-code.entity";

@Injectable()
export class EnumCodeService {
  constructor(
    @InjectRepository(EnumCodeEntity)
    private readonly enumCodeRepository: Repository<EnumCodeEntity>
  ) {}

  /**
   * 获取枚举列表
   */
  async getEnumCodeList(query: QueryEnumCodeDTO, pagination: PaginationDTO) {
    const builder = this.enumCodeRepository.createQueryBuilder();

    if (query.keywords) {
      builder.andWhere("code like :keywords or remark like :keywords", {
        keywords: `%${query.keywords}%`,
      });
    }

    const [items, total] = await builder
      .skip((pagination.page - 1) * pagination.size)
      .take(pagination.size)
      .getManyAndCount();

    return {
      pager: { ...pagination, total },
      items,
    };
  }

  /**
   * 创建枚举
   */
  async createEnumCode(payload: CreateEnumCodeDTO) {
    const hasExist = await this.getEnumCode(payload.code);

    if (hasExist) throw new BadRequestException("枚举已存在");

    const res = await this.enumCodeRepository.save(payload);

    return res;
  }

  /**
   * 更新枚举
   */
  async updateEnumCode(code: string, payload: UpdateEnumCodeDTO) {
    const hasExist = await this.getEnumCode(code);

    if (!hasExist) throw new BadRequestException("枚举不存在");

    const { affected } = await this.enumCodeRepository
      .createQueryBuilder()
      .update(payload)
      .where("code = :code", { code })
      .execute();

    return affected > 0;
  }

  /**
   * 查询指定枚举
   */
  async getEnumCode(code: string, status?: YON) {
    const builder = this.enumCodeRepository.createQueryBuilder();
    builder.where("code = :code", { code });

    if (status) {
      builder.andWhere("status = :status", { status });
    }

    const res = await builder.getOne();

    return res;
  }

  /**
   * 删除枚举
   */
  async deleteEnumCode(code: string) {
    const hasExist = await this.getEnumCode(code);

    if (!hasExist) throw new BadRequestException("枚举不存在");

    const { affected } = await this.enumCodeRepository
      .createQueryBuilder()
      .delete()
      .where("code = :code", { code })
      .execute();

    return affected > 0;
  }
}
