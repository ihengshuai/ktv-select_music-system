import { RouteRecordRaw } from "vue-router";

import { ROUTE_NAME } from "@/constants/route";
import { RouterView } from "@/layout/helper";
import { LazyComponent } from "@/layout/page/lazy-component";

export const musicRoute: RouteRecordRaw[] = [
  {
    path: "music",
    name: ROUTE_NAME.music,
    redirect: { name: ROUTE_NAME.musicList },
    component: RouterView,
    children: [
      {
        path: "",
        name: ROUTE_NAME.musicList,
        component: LazyComponent(() => import("@/views/music")),
        meta: {
          pageTitle: "menu.music-list",
        },
      },

      {
        path: "create",
        name: ROUTE_NAME.musicCreate,
        component: LazyComponent(() => import("@/views/music/children/music-create")),
        meta: {
          pageTitle: "menu.music-create",
        },
      },

      {
        path: "update/:songId",
        name: ROUTE_NAME.musicUpdate,
        component: LazyComponent(() => import("@/views/music/children/music-update")),
        meta: {
          pageTitle: "menu.music-update",
        },
      },

      {
        path: "lyrics",
        name: ROUTE_NAME.musicLyrics,
        component: LazyComponent(() => import("@/views/music/children/music-lyrics")),
        meta: {
          pageTitle: "menu.music-lyrics",
        },
      },

      {
        path: "singer",
        name: ROUTE_NAME.musicSinger,
        component: LazyComponent(() => import("@/views/music/children/music-singer")),
        meta: {
          pageTitle: "menu.music-singer",
        },
      },

      {
        path: "style",
        name: ROUTE_NAME.musicStyle,
        component: LazyComponent(() => import("@/views/music/children/music-style")),
        meta: {
          pageTitle: "menu.music-style",
        },
      },

      {
        path: "region",
        name: ROUTE_NAME.musicRegion,
        component: LazyComponent(() => import("@/views/music/children/music-region")),
        meta: {
          pageTitle: "menu.music-region",
        },
      },

      {
        path: "language",
        name: ROUTE_NAME.musicLanguage,
        component: LazyComponent(() => import("@/views/music/children/music-language")),
        meta: {
          pageTitle: "menu.music-language",
        },
      },

      {
        path: "tag",
        name: ROUTE_NAME.musicTag,
        component: LazyComponent(() => import("@/views/music/children/music-tag")),
        meta: {
          pageTitle: "menu.music-tag",
        },
      },
    ],
  },
];
