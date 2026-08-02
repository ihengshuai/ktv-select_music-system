import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSql1785678053620 implements MigrationInterface {
  name = "InitSql1785678053620";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`t_user\` (\`createTime\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`uid\` varchar(255) NOT NULL COMMENT '唯一id', \`username\` varchar(255) NOT NULL COMMENT '用户名', \`password\` varchar(255) NOT NULL COMMENT '密码', \`nickname\` varchar(255) NOT NULL COMMENT '昵称', \`email\` varchar(255) NULL COMMENT '邮箱', \`status\` int NULL COMMENT '用户状态', \`level\` int NULL COMMENT '用户角色', \`avatar\` varchar(255) NULL COMMENT '头像', UNIQUE INDEX \`IDX_3f12c21d3c70099dcc6da9ab5a\` (\`uid\`), UNIQUE INDEX \`IDX_cebdcd668896f79744000f50dd\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`t_static\` (\`createTime\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`type\` enum ('IMAGE', 'VIDEO', 'AUDIO', 'PDF', 'EXCEL', 'PPT', 'DOC', 'ZIP', 'OTHER') NOT NULL COMMENT '文件类型', \`location\` enum ('LOCAL', 'OSS') NOT NULL COMMENT '文件存储位置', \`uid\` varchar(255) NOT NULL COMMENT '上传者', \`url\` varchar(255) NULL, \`title\` varchar(255) NULL, \`remark\` varchar(255) NULL, \`fileName\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`t_order\` (\`createTime\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`orderNo\` varchar(255) NOT NULL COMMENT '订单号', \`password\` varchar(255) NOT NULL COMMENT '上机密码', \`payStatus\` enum ('PENDING', 'PAID', 'CANCELED', 'FAILED') NOT NULL COMMENT '支付状态', \`useStatus\` enum ('NOT_USED', 'USED') NOT NULL COMMENT '使用状态' DEFAULT 'NOT_USED', \`validityStatus\` enum ('NORMAL', 'EXPIRED') NOT NULL COMMENT '订单有效期状态', \`startTime\` timestamp NULL COMMENT '开始上机时间', \`longTime\` float NOT NULL COMMENT '时长', \`createById\` varchar(255) NOT NULL COMMENT '订单创建者', \`updateById\` varchar(255) NOT NULL COMMENT '订单更新者', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`t_order_pay\` (\`createTime\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`orderId\` varchar(255) NOT NULL COMMENT '订单ID', \`price\` float NOT NULL COMMENT '单价/时', \`longTime\` float NOT NULL COMMENT '时长', \`amount\` float NOT NULL COMMENT '金额', \`type\` enum ('OUT', 'IN') NOT NULL COMMENT '支付类型(支出/收入)' DEFAULT 'IN', \`remark\` varchar(255) NULL COMMENT '备注', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`t_order_operation\` (\`createTime\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`orderId\` varchar(255) NOT NULL COMMENT '订单ID', \`operation\` enum ('ORDER', 'ONLINE', 'OFFLINE', 'OFFLINE_REFUND', 'FORCE_OFFLINE', 'RENEW') NOT NULL COMMENT '操作类型', \`remark\` varchar(255) NULL COMMENT '备注', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`t_music_tag\` (\`createTime\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL COMMENT '歌曲标签名称', UNIQUE INDEX \`IDX_cfdfe37bd10bcd63e1b84aeadc\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`t_music_style\` (\`createTime\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL COMMENT '风格名称', UNIQUE INDEX \`IDX_f70a805956f6ab8f51f85846f2\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`t_music_singer\` (\`createTime\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL COMMENT '歌手名称', UNIQUE INDEX \`IDX_afa46b74569131252635e9847c\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`t_music_region\` (\`createTime\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL COMMENT '歌曲地区名称', UNIQUE INDEX \`IDX_7b14edf3ee604fcff880af561b\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`t_music_language\` (\`createTime\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL COMMENT '歌曲语言名称', UNIQUE INDEX \`IDX_28cf88ac0a4d5de692ce1e5193\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`t_music\` (\`createTime\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`uid\` varchar(255) NOT NULL COMMENT '歌曲id', \`title\` varchar(255) NOT NULL COMMENT '歌曲名', \`audio\` varchar(50) NOT NULL COMMENT '音频文件', \`lyrics\` varchar(50) NULL COMMENT '歌词', \`video\` varchar(50) NULL COMMENT '视频', \`remark\` varchar(255) NULL COMMENT '歌曲备注', \`singer\` varchar(255) NULL COMMENT '歌手', \`language\` varchar(255) NOT NULL COMMENT '歌曲语言', \`style\` varchar(255) NULL COMMENT '歌曲风格', \`region\` varchar(50) NOT NULL COMMENT '歌曲地区', \`tag\` varchar(255) NULL COMMENT '歌曲标签', \`testing\` varchar(255) NULL COMMENT 'testing', \`heat\` bigint NULL COMMENT '歌曲热度' DEFAULT '0', \`recommend\` enum ('Y', 'N') NULL COMMENT '是否推荐' DEFAULT 'N', \`createBy\` varchar(255) NOT NULL COMMENT '创建人', \`status\` enum ('DISABLED', 'ENABLED') NULL COMMENT '歌曲状态' DEFAULT 'ENABLED', UNIQUE INDEX \`IDX_4ad9cbe563556bc7d1f80ec97d\` (\`uid\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`t_music_video\` (\`createTime\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`t_music_lyrics\` (\`createTime\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`t_enum_code\` (\`createTime\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`code\` varchar(255) NOT NULL COMMENT '枚举键称', \`value\` varchar(255) NOT NULL COMMENT '枚举值', \`status\` enum ('Y', 'N') NOT NULL COMMENT '状态' DEFAULT 'Y', \`remark\` varchar(255) NULL COMMENT '枚举描述', UNIQUE INDEX \`IDX_1cff92e28226d5c963b9d1b50a\` (\`code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`IDX_1cff92e28226d5c963b9d1b50a\` ON \`t_enum_code\``);
    await queryRunner.query(`DROP TABLE \`t_enum_code\``);
    await queryRunner.query(`DROP TABLE \`t_music_lyrics\``);
    await queryRunner.query(`DROP TABLE \`t_music_video\``);
    await queryRunner.query(`DROP INDEX \`IDX_4ad9cbe563556bc7d1f80ec97d\` ON \`t_music\``);
    await queryRunner.query(`DROP TABLE \`t_music\``);
    await queryRunner.query(`DROP INDEX \`IDX_28cf88ac0a4d5de692ce1e5193\` ON \`t_music_language\``);
    await queryRunner.query(`DROP TABLE \`t_music_language\``);
    await queryRunner.query(`DROP INDEX \`IDX_7b14edf3ee604fcff880af561b\` ON \`t_music_region\``);
    await queryRunner.query(`DROP TABLE \`t_music_region\``);
    await queryRunner.query(`DROP INDEX \`IDX_afa46b74569131252635e9847c\` ON \`t_music_singer\``);
    await queryRunner.query(`DROP TABLE \`t_music_singer\``);
    await queryRunner.query(`DROP INDEX \`IDX_f70a805956f6ab8f51f85846f2\` ON \`t_music_style\``);
    await queryRunner.query(`DROP TABLE \`t_music_style\``);
    await queryRunner.query(`DROP INDEX \`IDX_cfdfe37bd10bcd63e1b84aeadc\` ON \`t_music_tag\``);
    await queryRunner.query(`DROP TABLE \`t_music_tag\``);
    await queryRunner.query(`DROP TABLE \`t_order_operation\``);
    await queryRunner.query(`DROP TABLE \`t_order_pay\``);
    await queryRunner.query(`DROP TABLE \`t_order\``);
    await queryRunner.query(`DROP TABLE \`t_static\``);
    await queryRunner.query(`DROP INDEX \`IDX_cebdcd668896f79744000f50dd\` ON \`t_user\``);
    await queryRunner.query(`DROP INDEX \`IDX_3f12c21d3c70099dcc6da9ab5a\` ON \`t_user\``);
    await queryRunner.query(`DROP TABLE \`t_user\``);
  }
}
