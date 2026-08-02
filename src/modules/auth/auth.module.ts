import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthController } from "./auth.controller";
import { EnumCodeEntity } from "../enum-code/entity/enum-code.entity";
import { OrderOperationEntity } from "../order/entity/order-operation.entity";
import { OrderPayEntity } from "../order/entity/order-pay.entity";
import { OrderEntity } from "../order/entity/order.entity";
import { UserEntity } from "../user/entities/user.entity";
import { UserService } from "../user/user.service";
import { OrderService } from "../order/order.service";

@Module({
  controllers: [AuthController],
  imports: [TypeOrmModule.forFeature([UserEntity, OrderEntity, OrderPayEntity, OrderOperationEntity, EnumCodeEntity])],
  providers: [UserService, OrderService],
})
export class AuthModule {}
