import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cwd } from "node:process";

import { MigrationInterface, QueryRunner } from "typeorm";

const sql = readFileSync(resolve(cwd(), "app.sql"), { encoding: "utf-8" });

export class InitSql1757662635021 implements MigrationInterface {
  name = "InitSql1757662635021";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`t_user\` (\`createTime\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`uid\` varchar(255) NOT NULL COMMENT '唯一id', \`username\` varchar(255) NOT NULL COMMENT '用户名', \`password\` varchar(255) NOT NULL COMMENT '密码', \`nickname\` varchar(255) NOT NULL COMMENT '昵称', \`email\` varchar(255) NULL COMMENT '邮箱', \`status\` int NULL COMMENT '用户状态', \`level\` int NULL COMMENT '用户角色', \`avatar\` int NULL COMMENT '头像', UNIQUE INDEX \`IDX_3f12c21d3c70099dcc6da9ab5a\` (\`uid\`), UNIQUE INDEX \`IDX_cebdcd668896f79744000f50dd\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`t_static\` (\`createTime\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`type\` enum ('image', 'video', 'audio', 'pdf', 'excel', 'ppt', 'doc', 'zip', 'other') NOT NULL, \`uid\` varchar(255) NOT NULL COMMENT '上传者', \`url\` varchar(255) NULL, \`title\` varchar(255) NULL, \`remark\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );

    queryRunner.query(sql);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`t_static\``);
    await queryRunner.query(`DROP INDEX \`IDX_cebdcd668896f79744000f50dd\` ON \`t_user\``);
    await queryRunner.query(`DROP INDEX \`IDX_3f12c21d3c70099dcc6da9ab5a\` ON \`t_user\``);
    await queryRunner.query(`DROP TABLE \`t_user\``);
  }
}
