import { Global, Module } from "@nestjs/common";

import { ApplicationLoggerService } from "./application-logger.service";

@Global()
@Module({
  providers: [ApplicationLoggerService],
  exports: [ApplicationLoggerService],
})
export class ApplicationLoggerModule {}
