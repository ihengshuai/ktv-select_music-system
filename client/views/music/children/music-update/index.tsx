import { ArrowLeftOutlined } from "@ant-design/icons-vue";
import { Button, Space } from "ant-design-vue";
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";

import IPanel from "@/components/common/panel";
import { ROUTE_NAME } from "@/constants/route";

import MusicUpdateForm, { IMusicUpdateFormExpose } from "../../components/music-form/music-update-form";

const MusicUpdatePage = defineComponent({
  name: "MusicUpdatePage",
  setup() {
    const router = useRouter();
    const formRef = ref<IMusicUpdateFormExpose>();

    return () => (
      <IPanel
        title={
          <Space>
            <Button onClick={() => router.replace({ name: ROUTE_NAME.musicList })}>
              <ArrowLeftOutlined />
              返回
            </Button>
            <span>编辑歌曲</span>
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
        <MusicUpdateForm ref={formRef} />
      </IPanel>
    );
  },
});

export default MusicUpdatePage;
