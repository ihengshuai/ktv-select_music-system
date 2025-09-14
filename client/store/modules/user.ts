import { defineStore } from "pinia";
import { reactive } from "vue";

import { IUserInfo } from "@/typings/models/user";

interface IUserState {
  isLogin: boolean;
  user: IUserInfo | null;
}

export const useUserStore = defineStore("userStore", () => {
  const userState = reactive<IUserState>({
    isLogin: false,
    user: null,
  });

  return {
    userState,
  };
});
