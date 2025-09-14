import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserEntity } from "./entities/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { StaticEntity } from "../static/entities/static.entity";

@Module({
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([UserEntity, StaticEntity])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
