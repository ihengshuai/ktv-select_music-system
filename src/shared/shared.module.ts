import { Global, Module } from "@nestjs/common";

import { FileSystemModule } from "./file-system/file-system.module";
import { ApplicationLoggerModule } from "./logger/application-logger.module";

@Global()
@Module({
  imports: [ApplicationLoggerModule, FileSystemModule],
})
export class SharedModule {}
