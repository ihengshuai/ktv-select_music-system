import { ArrowLeftOutlined } from "@ant-design/icons-vue";
import { Button } from "ant-design-vue";
import { defineComponent } from "vue";
import { useRoute, useRouter } from "vue-router";

import { ROUTE_NAME } from "@/constants/route";

import OrderBaseInfo from "./widgets/base-info";
import OrderOperationRecord from "./widgets/operation-record";
import OrderPayRecord from "./widgets/pay-record";

const OrderDetailPage = defineComponent({
  name: "OrderDetailPage",
  setup() {
    const router = useRouter();
    const route = useRoute();

    function onClickBackBtn() {
      router.replace({ name: ROUTE_NAME.orderList });
    }

    return () => {
      const TitleBar = () => (
        <>
          <Button
            ghost
            onClick={onClickBackBtn}
            type="primary"
            icon={<ArrowLeftOutlined />}
          >
            返回
          </Button>
          <span class="ml-16">基本信息</span>
        </>
      );

      return (
        <>
          <OrderBaseInfo orderNo={route.params.orderNo as string}>
            {{
              title: () => <TitleBar />,
            }}
          </OrderBaseInfo>

          <OrderPayRecord orderNo={route.params.orderNo as string}>OrderDetailPage</OrderPayRecord>

          <OrderOperationRecord orderNo={route.params.orderNo as string}>OrderDetailPage</OrderOperationRecord>
        </>
      );
    };
  },
});

export default OrderDetailPage;
