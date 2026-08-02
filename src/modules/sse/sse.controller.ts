import { randomUUID } from "crypto";

import { Controller, MessageEvent, Post, Query, Sse, UseGuards } from "@nestjs/common";
import { concat, delay, Observable, of, Subject, takeUntil } from "rxjs";

import { HttpSignature } from "@/common/decorator";
import { AuthenticationBaseGuard } from "@/common/guard/authentication-base.guard";

@HttpSignature(false)
@Controller("/sse")
export class SseController {
  private subject = new Subject<void>();

  @UseGuards(AuthenticationBaseGuard)
  @Sse()
  sse(@Query("msg") msg: string): Observable<MessageEvent> {
    const eventStream = Array.from({ length: 5 }, (v, i) => i).map(
      (message, index) =>
        of({
          data: `from sse events: ${index}, 你发送了 【${msg}】`,
          id: randomUUID(),
          retry: 0,
          type: index === 4 ? "done" : "message",
        } as MessageEvent).pipe(delay(1000)),
      takeUntil(this.subject)
    );

    return concat(...eventStream);
  }

  // 主动停止
  @Post("/stop")
  stop() {
    // TODO: 有问题，没法停止
    return this.subject.next();
  }
}
