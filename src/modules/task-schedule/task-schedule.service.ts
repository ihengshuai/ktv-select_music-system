import { Injectable, Logger } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";

@Injectable()
export class TaskScheduleService {
  private readonly logger = new Logger(TaskScheduleService.name);

  constructor(private readonly scheduleRegistry: SchedulerRegistry) {}

  clearTimeout() {
    const job = this.scheduleRegistry.getTimeout("timeout");

    if (job) clearTimeout(job);

    this.logger.log("定时任务<Timeout>：已清除");
  }

  // @Cron("* * * * * *", { name: "newCronJob" })
  addCronJob() {
    const job = new CronJob("* * * * * *", () => {
      console.log("Cron job executed");
    });

    job.start();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.scheduleRegistry.addCronJob("newCronJob", job);
  }

  removeCronJob() {
    const cronJob = this.scheduleRegistry.getCronJob("newCronJob");
    cronJob.stop();
    this.scheduleRegistry.deleteCronJob("newCronJob");
  }
}
