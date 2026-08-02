import { Module } from "@nestjs/common";

import { TaskScheduleController } from "./task-schedule.controller";
import { TaskScheduleService } from "./task-schedule.service";

@Module({
  controllers: [TaskScheduleController],
  providers: [TaskScheduleService],
})
export class TaskScheduleModule {}
