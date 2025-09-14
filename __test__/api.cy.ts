/** 接口测试  */

import { fetchUsers } from "~/client/api/mock";
import { HttpClient } from "~/client/util/common/request/constructor";

describe("单元测试", () => {
  beforeEach(async () => {
    // 请求登录接口拿到用户信息
    const res = cy.task("auth", { params: { username: "admin", password: "123456" } });
    HttpClient.axiosInstance.defaults.baseURL = "http://localhost:10011";
    HttpClient.axiosInstance.defaults.headers.common["Authorization"] = "user-token...";
  });

  it("用户列表接口", async () => {
    const res = await fetchUsers({ size: 2 }, {});
    console.log(res.data);

    expect(1).to.eq(1);
  });
});
