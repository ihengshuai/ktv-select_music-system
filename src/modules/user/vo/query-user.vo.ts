export class QueryUserVO {
  username: string;

  nickname: string; // 昵称

  email: string;

  status: number;

  level: number;

  constructor(data: Record<string, any>) {
    Object.assign(this, data);
  }
}
