import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { APP_CONFIG } from "./config";
import { AuthModule } from "./modules/auth/auth.module";
import { EnumCodeModule } from "./modules/enum-code/enum-code.module";
import { MockModule } from "./modules/mock/mock.module";
import { MusicModule } from "./modules/music/music.module";
import { MusicLanguageModule } from "./modules/music-language/music-language.module";
import { MusicRegionModule } from "./modules/music-region/music-region.module";
import { MusicSingerModule } from "./modules/music-singer/music-singer.module";
import { MusicStyleModule } from "./modules/music-style/music-style.module";
import { MusicTagModule } from "./modules/music-tag/music-tag.module";
import { OrderModule } from "./modules/order/order.module";
import { PageModule } from "./modules/page/page.module";
import { SseModule } from "./modules/sse/sse.module";
import { StaticModule } from "./modules/static/static.module";
import { TaskScheduleModule } from "./modules/task-schedule/task-schedule.module";
import { TestingModule } from "./modules/testing/testing.module";
import { UserModule } from "./modules/user/user.module";
import { SharedModule } from "./shared/shared.module";

@Module({
  imports: [
    SharedModule,
    AuthModule,
    UserModule,
    MusicModule,
    MusicSingerModule,
    MusicLanguageModule,
    MusicRegionModule,
    MusicTagModule,
    MusicStyleModule,
    OrderModule,
    EnumCodeModule,
    SseModule,
    StaticModule,
    PageModule,
    TaskScheduleModule,
    MockModule,

    ...(APP_CONFIG.__is_Dev__ ? [TestingModule] : []),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
