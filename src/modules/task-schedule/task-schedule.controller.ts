import { Controller, Get } from "@nestjs/common";

import { HttpSignature } from "@/common/decorator";

import { TaskScheduleService } from "./task-schedule.service";

@HttpSignature(false)
@Controller("task-schedule")
export class TaskScheduleController {
  constructor(private readonly taskScheduleService: TaskScheduleService) {}

  @Get("clear-timeout")
  clearTimeout() {
    return this.taskScheduleService.clearTimeout();
  }

  @Get("add")
  addCronJob() {
    return this.taskScheduleService.addCronJob();
  }

  @Get("remove")
  removeCronJob() {
    return this.taskScheduleService.removeCronJob();
  }
}
