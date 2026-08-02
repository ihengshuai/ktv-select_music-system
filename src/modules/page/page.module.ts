import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PageController } from "./page.controller";
import { UserEntity } from "../user/entities/user.entity";
import { UserService } from "../user/user.service";

@Module({
  controllers: [PageController],
  imports: [TypeOrmModule.forFeature([UserEntity])],

  providers: [UserService],
  exports: [UserService],
})
export class PageModule {}
