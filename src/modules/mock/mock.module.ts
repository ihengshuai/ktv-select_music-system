import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MockController } from "./mock.controller";
import { UserEntity } from "../user/entities/user.entity";
import { UserService } from "../user/user.service";

@Module({
  controllers: [MockController],
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService],
})
export class MockModule {}
