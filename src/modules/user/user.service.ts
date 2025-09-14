import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { PaginationDTO } from "@/dto/base-pagination.dto";
import { QueryUserDTO } from "@/modules/user/dto/query-user.dto";
import { generateStaticURL } from "@/utils";

import { ChangeUserRoleDTO } from "./dto/change-role.dto";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateNicknameDTO } from "./dto/update-nickname.dto";
import { UserEntity } from "./entities/user.entity";
import { StaticEntity } from "../static/entities/static.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  /** 是否是空用户 */
  async isEmpty() {
    return (await this.userRepository.count()) === 0;
  }

  /** 添加用户 */
  async addUser(data: CreateUserDTO) {
    const hasOne = await this.userRepository.existsBy({ username: data.username });
    if (hasOne) {
      throw new HttpException("用户名已存在!", HttpStatus.BAD_REQUEST);
    }

    return await this.userRepository.save(data);
  }

  /** 查找某个用户信息 */
  async findUser(username: string) {
    const queryBuilder = this.userRepository.createQueryBuilder("u");

    const res = await queryBuilder.where("username = :username", { username }).getOne();

    if (!res) return null;

    const avatar = await queryBuilder
      .leftJoin(StaticEntity, "s", "u.avatar = s.id")
      .select(["s.url as avatarURL", "s.id as avatarId"])
      .where("username = :username", { username })
      .getRawOne();

    res.avatar = avatar?.avatarId || null;
    // @ts-ignore
    res.avatarURL = generateStaticURL(avatar?.avatarURL);

    return res;
  }

  /** 查询用户列表 */
  async findAllUsers(query: QueryUserDTO, pagination: PaginationDTO) {
    const keywords = `%${query.keywords}%`;

    const [items, total] = await this.userRepository
      .createQueryBuilder("userRepository")
      .where("username LIKE :keywords or nickname LIKE :keywords", { keywords })
      .skip((pagination.page - 1) * pagination.size)
      .take(pagination.size)
      .getManyAndCount();

    return {
      pager: { ...pagination, total },
      items,
    };
  }

  /** 修改用户状态 */
  async toggleUserStatus(username: string, status: number) {
    const { affected } = await this.userRepository
      .createQueryBuilder("userRepository")
      .where("username = :username", { username })
      .update({ status })
      .execute();

    return affected > 0;
  }

  /** 修改用户权限 */
  async changeUserRole(username: string, payload: ChangeUserRoleDTO) {
    const { affected } = await this.userRepository
      .createQueryBuilder("userRepository")
      .where("username = :username", { username })
      .update({ level: payload.level })
      .execute();

    return affected > 0;
  }

  /** 重置|修改密码 */
  async resetPassword(username: string, password: string) {
    const { affected } = await this.userRepository
      .createQueryBuilder("userRepository")
      .where("username = :username", { username })
      .update({ password })
      .execute();

    return affected > 0;
  }

  /** 重置|修改密码 */
  async updateNickname(username: string, payload: UpdateNicknameDTO) {
    const { affected } = await this.userRepository
      .createQueryBuilder("userRepository")
      .where("username = :username", { username })
      .update(payload)
      .execute();

    return affected > 0;
  }
}
