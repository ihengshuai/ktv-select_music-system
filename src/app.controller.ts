import { Controller } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { IConfig } from "./config";

@Controller()
export class AppController {
  constructor(readonly configService: ConfigService<IConfig>) {}
}
