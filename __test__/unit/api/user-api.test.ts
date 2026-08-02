import { describe, expect } from "vitest";

import { fetchUsers } from "~/client/api/user";

describe.concurrent("test api", () => {
  it("测试api - page&size", async () => {
    const res = await fetchUsers({ page: 1, size: 2 });
    expect(res.items.length).toBe(2);
  });

  it("测试api - keywords", async () => {
    const res = await fetchUsers({ page: 1, size: 2, keywords: "张" });
    expect(res.items.length).toBe(1);
  });

  it("测试api - total", async () => {
    const res = await fetchUsers({ page: 1, size: 1000 });
    expect(res.items.length).toBe(res.pager.total);
  });
});
