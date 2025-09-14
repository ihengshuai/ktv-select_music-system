import { Global, Module } from "@nestjs/common";

import { FileSystemController } from "./file-system.controller";
import { FileSystemService } from "./file-system.service";

@Global()
@Module({
  controllers: [FileSystemController],
  providers: [FileSystemService],
  exports: [FileSystemService],
})
export class FileSystemModule {}
