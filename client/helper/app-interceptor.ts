import { App } from "vue";

import { getUserInfo } from "@/api/auth";
import { useUserStore } from "@/store";

import { HttpBusinessException } from "./exception";

// eslint-disable-next-line no-unused-vars
export async function appInterceptor(app?: App) {
  try {
    const userInfo = await getUserInfo();
    const userStore = useUserStore();
    userStore.userState.isLogin = !!userInfo;
    userStore.userState.user = userInfo;
  } catch (error: HttpBusinessException | any) {
    console.log(error);

    if (error instanceof HttpBusinessException) {
      const userStore = useUserStore();
      userStore.userState.code = error.code;
    }
  }
}
