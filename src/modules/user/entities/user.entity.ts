import { Exclude, instanceToPlain } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { BaseDateTimeEntity } from "@/entries/base-datetime.entity";

@Entity("t_user")
export class UserEntity extends BaseDateTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255, unique: true, nullable: false, comment: "唯一id" })
  uid: string;

  @Column({ type: "varchar", length: 255, unique: true, nullable: false, comment: "用户名" })
  username: string;

  @Exclude({ toPlainOnly: true })
  @Column({ type: "varchar", length: 255, comment: "密码" })
  password: string;

  @Column({ type: "varchar", length: 255, comment: "昵称" })
  nickname: string;

  @Column({ type: "varchar", length: 255, nullable: true, comment: "邮箱" })
  email: string;

  @Column({ type: "int", nullable: true, comment: "用户状态" })
  status: number;

  @Column({ type: "int", nullable: true, comment: "用户角色" })
  level: number;

  @Column({ type: "int", nullable: true, comment: "头像" })
  avatar: number;

  toJSON() {
    return instanceToPlain(this);
  }

  validatePassword(password: string) {
    if (!this.password) return false;

    return this.password === password;
  }
}
