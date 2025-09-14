import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { APP_CONFIG } from "./config";
import { AuthModule } from "./modules/auth/auth.module";
import { CommonModule } from "./modules/common/common.module";
import { MockModule } from "./modules/mock/mock.module";
import { StaticModule } from "./modules/static/static.module";
import { TestingModule } from "./modules/testing/testing.module";
import { UserModule } from "./modules/user/user.module";
import { SharedModule } from "./shared/shared.module";

@Module({
  imports: [
    CommonModule,
    SharedModule,
    AuthModule,
    UserModule,
    StaticModule,
    MockModule,
    ...(APP_CONFIG.__is_Dev__ ? [TestingModule] : []),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
