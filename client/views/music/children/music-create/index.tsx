import { ArrowLeftOutlined } from "@ant-design/icons-vue";
import { Button, Space } from "ant-design-vue";
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";

import IPanel from "@/components/common/panel";
import { ROUTE_NAME } from "@/constants/route";

import MusicCreateForm, { IMusicCreateFormExpose } from "../../components/music-form/music-create-form";

const MusicCreatePage = defineComponent({
  name: "MusicCreatePage",
  setup() {
    const router = useRouter();
    const formRef = ref<IMusicCreateFormExpose>();

    return () => (
      <IPanel
        title={
          <Space>
            <Button onClick={() => router.replace({ name: ROUTE_NAME.musicList })}>
              <ArrowLeftOutlined />
              返回
            </Button>
            <span>创建歌曲</span>
          </Space>
        }
        extra={
          <>
            <Button
              type="primary"
              onClick={() => formRef.value!.handleSubmitForm()}
            >
              保存
            </Button>
          </>
        }
      >
        <MusicCreateForm ref={formRef} />
      </IPanel>
    );
  },
});

export default MusicCreatePage;
