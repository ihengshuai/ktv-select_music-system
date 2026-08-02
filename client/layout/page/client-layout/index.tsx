import { Form, Input, message, Modal } from "ant-design-vue";
import { defineComponent, reactive } from "vue";
import "./style.less";
import { RouterView, useRouter } from "vue-router";

import { ClientController } from "@/api/client/client.api";
import {
  MusicHomeIcon,
  MusicIcon,
  MusicNetworkIcon,
  MusicPowerOffIcon,
  MusicSearchIcon,
} from "@/components/common/icon/music";
import { ROUTE_NAME } from "@/constants/route";
import { useMusicOrder, useMusicPlayerStore } from "@/store";
import { sleep } from "@/util";

const ClientLayout = defineComponent({
  name: "ClientLayout",
  setup() {
    const router = useRouter();

    const { musicState } = useMusicPlayerStore();
    const { hasLogin } = useMusicOrder();
    const clientCtor = new ClientController();

    const loginForm = reactive({
      orderNo: "",
      password: "",
    });

    const toLoginState = reactive({
      modal: false,
      loading: false,
    });

    function toLogin() {
      toLoginState.modal = true;
    }

    async function onLoginOk() {
      const orderNo = loginForm.orderNo.trim();
      const password = loginForm.password.trim();

      if (!orderNo || !password) return message.error("请输入正确的信息");

      try {
        const payload = {
          orderNo,
          password,
        };
        console.log("login...", payload);
        toLoginState.loading = true;
        await sleep(1000);
        await clientCtor.toLogin(payload);
      } catch (error) {
        console.log(error);
      } finally {
        toLoginState.loading = false;
      }
    }

    function onLoginCancel() {
      toLoginState.modal = false;
    }

    function goSearch() {
      router.push({ name: ROUTE_NAME.clientSearchMusic });
    }

    function goHome() {
      router.push({ name: ROUTE_NAME.clientHome });
    }

    return () => {
      const LoginModal = () => (
        <Modal
          open={toLoginState.modal}
          confirmLoading={toLoginState.loading}
          onOk={onLoginOk}
          onCancel={onLoginCancel}
        >
          <div
            style=""
            class="px-18 pb-28"
          >
            <Form
              labelAlign="right"
              labelCol={{ span: 4 }}
            >
              <Form.Item label="订单号">
                <Input v-model:value={loginForm.orderNo} />
              </Form.Item>

              <Form.Item label="密码">
                <Input v-model:value={loginForm.password} />
              </Form.Item>
            </Form>
          </div>
        </Modal>
      );

      return (
        <div class="client-layout relative box-border">
          {!hasLogin && (
            <div
              class="absolute inset-0 z-10"
              onClick={toLogin}
            ></div>
          )}

          <LoginModal />

          <div class="relative h-full flex flex-col">
            {/* header */}
            <div class="client-layout__header z-2 absolute w-100vw p-6 flex items-center justify-between mb-6">
              <div class="flex items-center gap-6">
                <div class="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                  <MusicIcon />
                </div>

                <div class="flex gap-8">
                  <span class="text-white font-semibold text-lg hover:text-amber-400 transition-colors">K歌</span>
                </div>
              </div>

              <div class="flex items-center gap-4 font-size-12px cursor-default">
                <button
                  onClick={goSearch}
                  class="bg-white/10 font-size-14px   hover:bg-white/20 text-white px-6 py-2 rounded-full flex items-center gap-2 transition-all border border-white/20"
                >
                  <MusicSearchIcon />
                  搜索歌曲
                </button>

                <div
                  onClick={goHome}
                  class="text-white/70 hover:text-white transition-colors flex flex-col items-center"
                >
                  <MusicHomeIcon class="lucide lucide-power w-5 h-5" />
                  主页
                </div>

                <div class="text-white/70 hover:text-white transition-colors flex flex-col items-center">
                  <MusicPowerOffIcon class="lucide lucide-power w-5 h-5" />
                  下机
                </div>

                <div class="text-white/70 hover:text-white transition-colors flex flex-col items-center">
                  <MusicNetworkIcon class="lucide lucide-power w-5 h-5" />
                  网络
                </div>
              </div>
            </div>

            <ul class="w-200 h-300px fixed bottom-0 left-0 overflow-y-auto bg-amber color-white">
              <h2>已点歌曲</h2>
              {musicState.songList.map(item => (
                <li key={item.uid}>{item.title}</li>
              ))}
            </ul>

            <div class="client-layout__body flex-1 pt-96px relative  flex">
              <RouterView />
            </div>
          </div>
        </div>
      );
    };
  },
});

export default ClientLayout;
