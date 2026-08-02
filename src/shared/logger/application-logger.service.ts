import "winston-daily-rotate-file";
import { ConsoleLogger, Injectable } from "@nestjs/common";
import { config as winstonConfig, createLogger, transports, format, type Logger as WinstonLogger } from "winston";

import { APP_CONFIG } from "@/config";
import { DATE_FORMAT } from "@/consts";
import { formatDate } from "@/utils";

const { combine, timestamp, printf } = format;
const { APP_TITLE, __is_Prod__ } = APP_CONFIG;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

export enum LOG_LEVEL {
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  DEBUG = "debug",
}

@Injectable()
export class ApplicationLoggerService extends ConsoleLogger {
  private winstonLogger: WinstonLogger;

  constructor(
    context?: string,
    options?: {
      timestamp?: boolean;
    }
  ) {
    super(context, options);

    this.initWinston();
  }

  protected formatPid(pid: number): string {
    return `${this.colorize(`《${APP_TITLE}》`, "verbose")} ${pid} - `;
  }

  protected getTimestamp(): string {
    return formatDate(new Date(), DATE_FORMAT.DATE_FULLTIME.replaceAll("-", "/"));
  }

  formatMessage(logLevel, message, pidMessage, formattedLogLevel, contextMessage, timestampDiff) {
    const output = this.stringifyMessage(message, logLevel);
    pidMessage = this.colorize(pidMessage, logLevel);
    formattedLogLevel = formattedLogLevel.slice(2);
    formattedLogLevel = this.colorize(formattedLogLevel, logLevel);
    return `${pidMessage}${this.getTimestamp()} ${formattedLogLevel} ${contextMessage}${output}${timestampDiff}\n`;
  }

  private initWinston() {
    const winstonTransports: any[] = [];

    if (__is_Prod__) {
      winstonTransports.push(
        new transports.DailyRotateFile({
          level: LOG_LEVEL.INFO,
          filename: "logs/access.%DATE%.log",
          maxFiles: "90d",
          maxSize: "10M",
          auditFile: "logs/audit/access.json",
          datePattern: DATE_FORMAT.DATE,
          format: combine(
            timestamp({ format: () => formatDate(new Date(), DATE_FORMAT.DATE_FULLTIME) }),
            format.json()
          ),
        }),

        new transports.DailyRotateFile({
          level: LOG_LEVEL.ERROR,
          filename: "logs/error.%DATE%.log",
          maxFiles: "90d",
          auditFile: "logs/audit/error.json",
          maxSize: "10M",
          datePattern: DATE_FORMAT.DATE,
          format: combine(
            timestamp({ format: () => formatDate(new Date(), DATE_FORMAT.DATE_FULLTIME) }),
            format.json()
          ),
        })
      );

      this.winstonLogger = createLogger({
        levels: winstonConfig.npm.levels,
        // defaultMeta: { service: "user-service" },
        level: "info",
        format: combine(format.errors({ stack: true }), timestamp(), myFormat),
        transports: winstonTransports,
      });
    }
  }

  log(message: string, ...meta: any[]) {
    // TODO: 打印信息补充调用位置, 方便快速定位📌
    super.log.apply(this, [message, ...meta]);

    if (!__is_Prod__) return;

    this.winstonLogger.log({
      level: LOG_LEVEL.INFO,
      message: message,
      label: this.context,
    });
  }

  warn(message: string, ...meta: unknown[]): void {
    super.warn.apply(this, [message, ...meta]);

    if (!__is_Prod__) return;
    this.winstonLogger.warn({
      level: LOG_LEVEL.WARN,
      message: message,
      label: this.context,
    });
  }

  error(message: string, ...meta: unknown[]): void {
    super.error.apply(this, [message, ...meta]);

    if (!__is_Prod__) return;
    this.winstonLogger.error({
      level: LOG_LEVEL.ERROR,
      message: message,
      label: this.context,
    });
  }
}
