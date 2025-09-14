import { Button, Divider } from "ant-design-vue";
import { defineComponent, reactive } from "vue";

import { TestController } from "@/api/testing/test-controller";
import IPanel from "@/components/common/panel";
import { UserInfoEntity } from "@/entities/auth/user-info.entity";
import { createEntity } from "@/entities/tool";

const Testing = defineComponent({
  name: "Testing",
  setup() {
    const testController = new TestController();

    const userInfo = reactive(createEntity(UserInfoEntity));

    async function getUserInfo() {
      const res = await testController.testGetUser("root");
      Object.assign(userInfo, createEntity(UserInfoEntity, res as any, false));
      console.log(res, userInfo);
    }

    return () => (
      <IPanel>
        <Button
          type="primary"
          onClick={getUserInfo}
        >
          测试实体类
        </Button>
        <Divider />
        Testing
      </IPanel>
    );
  },
});

export default Testing;
