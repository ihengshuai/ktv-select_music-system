import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EnumCodeEntity } from "./entity/enum-code.entity";
import { EnumCodeController } from "./enum-code.controller";
import { EnumCodeService } from "./enum-code.service";
import { UserEntity } from "../user/entities/user.entity";
import { UserService } from "../user/user.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, EnumCodeEntity])],
  controllers: [EnumCodeController],
  providers: [EnumCodeService, UserService],
  exports: [EnumCodeService],
})
export class EnumCodeModule {}
