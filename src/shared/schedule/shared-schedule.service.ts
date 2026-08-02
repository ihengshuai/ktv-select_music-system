import { Injectable, Logger } from "@nestjs/common";
import { Cron, Interval, Timeout } from "@nestjs/schedule";

@Injectable()
export class SharedScheduleService {
  private readonly logger = new Logger(SharedScheduleService.name);

  // 周一到周五早上11:30执行
  @Cron("0 30 11 * * 1-5", {
    name: "cronTime", // 名字
    timeZone: "Asia/Shanghai", // 时区
  })
  handleCron() {
    this.logger.log("定时任务<Cron(0 30 11 * * 1-5)>：已执行");
  }

  @Interval("interval", 1000 * 60 * 5) // 间隔5分钟执行一次
  handleInterval() {
    this.logger.log("定时任务<Interval>：已执行");
  }

  @Timeout("timeout", 1000 * 10) // 60s 后执行
  handleTimeout() {
    this.logger.log("定时任务<Timeout>：已执行");
  }
}
