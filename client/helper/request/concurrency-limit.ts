import { CONCURRENCY_STATUS } from "@/constants/http";
import { IRequestConcurrencyLimit, IRequestConcurrencyNotice, IRequestConcurrencyQueue } from "@/typings/common/http";

/**
 * 异步函数并发控制
 */
export class PromiseConcurrencyLimit {
  private _limit: number;
  private _retry: number;
  private _activeCount = 0;
  private _relation: boolean;
  private _skipError: boolean;
  private requestQueue: IRequestConcurrencyQueue[];
  private _status: CONCURRENCY_STATUS = CONCURRENCY_STATUS.PENDING;
  private _currentRetrys: Map<string, number>;
  private _noticeStatus?: IRequestConcurrencyNotice;

  constructor(opts?: IRequestConcurrencyLimit, noticeStatus?: IRequestConcurrencyNotice) {
    this._relation = opts?.relation ?? false;
    this._limit = this._relation ? 1 : opts?.limit ?? (Number?.MAX_SAFE_INTEGER || 9999);
    this._retry = opts?.retry ?? 0;
    this._skipError = opts?.skipError ?? false;
    this.requestQueue = [];
    this._currentRetrys = new Map();
    this._noticeStatus = noticeStatus;
  }

  get activeCount() {
    return this._activeCount;
  }

  get pendingCount() {
    return this.requestQueue.length;
  }

  get isRetry() {
    return this._currentRetrys.size > 0;
  }

  append(promiseFn: IRequestConcurrencyQueue["promiseFn"], opts?: Omit<IRequestConcurrencyLimit, "limit">) {
    if (this._status === CONCURRENCY_STATUS.END) this.clear();
    return new Promise((resolve, reject) => {
      const payload: IRequestConcurrencyQueue = {
        promiseFn,
        resolve,
        reject,
        retry: opts?.retry ?? this._retry,
        skipError: opts?.skipError ?? this._skipError,
        prevData: null,
        uuid: Math.random().toString(36).slice(2),
      };
      this.queue(payload);
    });
  }

  private async queue(current: IRequestConcurrencyQueue) {
    const { promiseFn, resolve, reject, skipError, prevData, uuid } = current;
    this.notice();
    if (this._activeCount < this._limit) {
      try {
        this._activeCount += 1;
        const res = await (this._relation ? promiseFn(prevData) : promiseFn());
        resolve(res);
        this.popRetry(uuid);
        this._activeCount -= 1;
        this.next(res);
      } catch (err) {
        if (current.retry) {
          current.retry -= 1;
          this._activeCount -= 1;
          this.queue({
            promiseFn,
            resolve,
            reject,
            retry: current.retry,
            skipError: current.skipError,
            prevData,
            uuid,
          });
          this.pushRetry(uuid);
          this.notice();
        } else {
          this.popRetry(uuid);
          if (skipError) {
            resolve(err);
            this._activeCount -= 1;
            this.next();
          } else {
            this._status = CONCURRENCY_STATUS.END;
            reject(err);
          }
        }
      }
    } else {
      this.requestQueue.push(current);
    }
  }

  private async next(prevData?: any) {
    if (this._activeCount < this._limit && this.requestQueue?.length && this._status === CONCURRENCY_STATUS.PENDING) {
      const nextRequest = this.requestQueue.shift()!;
      nextRequest.prevData = prevData;
      this.queue(nextRequest);
    } else if (this._status === CONCURRENCY_STATUS.END) {
      this.clear();
    }
  }

  clear() {
    this.requestQueue = [];
    this._activeCount = 0;
    this._status = CONCURRENCY_STATUS.PENDING;
    this._currentRetrys.clear();
    this.notice();
  }

  private pushRetry(uuid: string) {
    this._currentRetrys.set(uuid, 1);
  }

  private popRetry(uuid: string) {
    this._currentRetrys.delete(uuid);
  }

  private notice() {
    if (this._noticeStatus) {
      this._noticeStatus({
        activeCount: this._activeCount,
        pendingCount: this.requestQueue.length,
        isRetry: this.isRetry,
        retryCount: this._currentRetrys.size,
      });
    }
  }
}
