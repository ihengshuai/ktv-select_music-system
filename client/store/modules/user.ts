import { defineStore } from "pinia";
import { reactive } from "vue";

import { HTTP_CODE } from "@/constants/http.const";
import { IUserInfo } from "@/typings/models/user";

interface IUserState {
  isLogin: boolean;
  user: IUserInfo | null;
  code: string | number | HTTP_CODE | null;
}

export const useUserStore = defineStore("userStore", () => {
  const userState = reactive<IUserState>({
    isLogin: false,
    user: null,
    code: null,
  });

  return {
    userState,
  };
});
