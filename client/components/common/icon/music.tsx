import { FunctionalComponent } from "vue";

/** 音乐图标 */
export const MusicIcon: FunctionalComponent<any, { attrs: any }> = (props, { attrs }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      {...attrs}
    >
      <path d="M9 18V5l12-2v13"></path>
      <circle
        cx="6"
        cy="18"
        r="3"
      ></circle>
      <circle
        cx="18"
        cy="16"
        r="3"
      ></circle>
    </svg>
  );
};

/** 话筒 */
export const MusicMicroPhone: FunctionalComponent<any, { attrs: any }> = (props, { attrs }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      {...attrs}
    >
      <path d="m11 7.601-5.994 8.19a1 1 0 0 0 .1 1.298l.817.818a1 1 0 0 0 1.314.087L15.09 12"></path>
      <path d="M16.5 21.174C15.5 20.5 14.372 20 13 20c-2.058 0-3.928 2.356-6 2-2.072-.356-2.775-3.369-1.5-4.5"></path>
      <circle
        cx="16"
        cy="7"
        r="5"
      ></circle>
    </svg>
  );
};

/** 热度 */
export const MusicHeat: FunctionalComponent<any, { attrs: any }> = (props, { attrs }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      {...attrs}
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
      <polyline points="16 7 22 7 22 13"></polyline>
    </svg>
  );
};

/** 收藏 */
export const MusicFavorite: FunctionalComponent<any, { attrs: any }> = (props, { attrs }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      {...attrs}
    >
      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
    </svg>
  );
};

/** 评分 */
export const MusicScoreIcon: FunctionalComponent<any, { attrs: any }> = (props, { attrs }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      {...attrs}
    >
      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
    </svg>
  );
};

/** 播放 */
export const MusicPlayIcon: FunctionalComponent<any, { attrs: any }> = (props, { attrs }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      {...attrs}
    >
      <polygon points="6 3 20 12 6 21 6 3"></polygon>
    </svg>
  );
};

/** 暂停 */
export const MusicPauseIcon: FunctionalComponent<any, { attrs: any }> = (props, { attrs }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      {...attrs}
    >
      <rect
        x="14"
        y="4"
        width="4"
        height="16"
        rx="1"
      ></rect>
      <rect
        x="6"
        y="4"
        width="4"
        height="16"
        rx="1"
      ></rect>
    </svg>
  );
};

/** 下首 */
export const MusicNextIcon: FunctionalComponent<any, { attrs: any }> = (props, { attrs }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      {...attrs}
    >
      <polygon points="5 4 15 12 5 20 5 4"></polygon>
      <line
        x1="19"
        x2="19"
        y1="5"
        y2="19"
      ></line>
    </svg>
  );
};

/** 刷新 */
export const MusicRefreshIcon: FunctionalComponent<any, { attrs: any }> = (props, { attrs }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      {...attrs}
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
      <path d="M3 3v5h5"></path>
    </svg>
  );
};

/** 历史 */
export const MusicHistory: FunctionalComponent<any, { attrs: any }> = (props, { attrs }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      {...attrs}
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
      <path d="M3 3v5h5"></path>
      <path d="M12 7v5l4 2"></path>
    </svg>
  );
};

/** 声音 */
export const MusicVolumeIcon: FunctionalComponent<any, { attrs: any }> = (props, { attrs }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      {...attrs}
    >
      <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"></path>
      <path d="M16 9a5 5 0 0 1 0 6"></path>
      <path d="M19.364 18.364a9 9 0 0 0 0-12.728"></path>
    </svg>
  );
};

/** 用户 */
export const MusicUserIcon: FunctionalComponent<any, { attrs: any }> = (props, { attrs }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      {...attrs}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
      <circle
        cx="12"
        cy="7"
        r="4"
      ></circle>
    </svg>
  );
};

/** 搜索Icon */
export const MusicSearchIcon: FunctionalComponent<any, { attrs: any }> = (props, { attrs }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      {...attrs}
    >
      <circle
        cx="11"
        cy="11"
        r="8"
      ></circle>
      <path d="m21 21-4.3-4.3"></path>
    </svg>
  );
};

/** Home */
export const MusicHomeIcon: FunctionalComponent<any, { attrs: any }> = (props, { attrs }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      {...attrs}
    >
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    </svg>
  );
};

/** 关机 */
export const MusicPowerOffIcon: FunctionalComponent<any, { attrs: any }> = (props, { attrs }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      {...attrs}
    >
      <path d="M12 2v10"></path>
      <path d="M18.4 6.6a9 9 0 1 1-12.77.04"></path>
    </svg>
  );
};

/** 网络 */
export const MusicNetworkIcon: FunctionalComponent<any, { attrs: any }> = (props, { attrs }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      {...attrs}
    >
      <path d="M12 20h.01"></path>
      <path d="M2 8.82a15 15 0 0 1 20 0"></path>
      <path d="M5 12.859a10 10 0 0 1 14 0"></path>
      <path d="M8.5 16.429a5 5 0 0 1 7 0"></path>
    </svg>
  );
};

export const MusicLanguageIcon: FunctionalComponent<any, { attrs: any }> = (props, { attrs }) => {
  return (
    <svg
      fill="currentColor"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      width="24"
      height="24"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      {...attrs}
    >
      <path
        d="M549.12 643.008L440.768 535.936l1.28-1.28A747.52 747.52 0 0 0 600.32 256h125.056V170.688H426.688V85.376H341.376v85.312H42.688v84.928h476.608A670.4 670.4 0 0 1 384 484.288a667.52 667.52 0 0 1-98.56-142.912H200.128a749.312 749.312 0 0 0 127.168 194.56L110.08 750.08l60.608 60.544L384 597.376l132.736 132.672 32.384-87.04z m240.256-216.32H704l-192 512h85.376l47.744-128h202.688l48.192 128h85.376l-192-512z m-111.808 298.688l69.12-184.768 69.12 184.768h-138.24z"
        p-id="5010"
      ></path>
    </svg>
  );
};

export const MusicRegionIcon: FunctionalComponent<any, { attrs: any }> = (props, { attrs }) => {
  return (
    <svg
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="4627"
      fill="currentColor"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      width="24"
      height="24"
      {...attrs}
    >
      <path
        d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448-200.6-448-448-448zM362.5 158.1c27.4-11.5 55.8-19.8 84.9-24.7C409.8 162 376.6 196.3 348.7 235.2c-21.8-9.2-43-20.4-63.2-33.4 23.8-17.5 49.6-32.1 77-43.7zM158.2 362.5c19.3-45.7 47-86.7 82.3-122l0.9-0.9C265.7 256.5 291.6 271 318.6 283c-34 61.8-53.7 130.1-57.8 201H129c3-42 12.8-82.7 29.2-121.5z m82.3 421c-35.3-35.3-63-76.3-82.3-122C141.8 622.7 132 582 129 540h131.8c4.1 70.8 23.8 139.2 57.8 200.9-27 12-52.8 26.6-77.2 43.5l-0.9-0.9z m122 82.3c-27.4-11.5-53.1-26.2-76.9-43.6 20.2-13 41.3-24.1 63.1-33.4 27.9 39 61.1 73.2 98.6 101.8-29.1-4.9-57.4-13.2-84.8-24.8zM484 848.3c-30.3-22.6-57.2-49-80-78.4 26-6.8 52.7-11.2 80-13v91.4z m0-308.3v160.8c-38.4 2.2-76.1 9-112.7 20.3-31.1-54.4-50.1-116.1-54.4-181.2H484v0.1z m0-56H316.9c4.3-65 23.3-126.7 54.5-181.1C407.9 314.2 445.6 321 484 323.2V484z m0-216.9c-27.3-1.8-54-6.1-79.9-13 22.8-29.4 49.7-55.8 79.9-78.4v91.4zM783.5 240.6c35.3 35.2 63 76.2 82.3 121.9C882.2 401.3 892 442 895 484H763.2c-4.1-70.9-23.8-139.2-57.8-200.9 27-12 52.8-26.5 77.2-43.4l0.9 0.9zM661.4 158.2c27.5 11.5 53.2 26.2 77 43.6-20.2 13-41.3 24.2-63.2 33.4-26.4-36.9-57.9-69.8-93.6-97.8-1.7-1.4-3.5-2.7-5.2-4 29.1 4.9 57.6 13.2 85 24.8zM540 176.2c29.8 22.5 56.4 48.9 79.1 78.1-25.7 6.7-52.1 11-79.1 12.8v-90.9z m0 147c38.1-2.2 75.5-8.9 111.8-20.1 31.4 54.6 50.8 116.4 55.2 180.9H540V323.2z m0 216.8h167.1c-4.3 65.1-23.3 126.7-54.4 181.2-36.6-11.3-74.3-18.1-112.7-20.3V540z m0 217c27 1.8 53.8 6.3 79.8 13.2-22.8 29.3-49.6 55.7-79.8 78.2V757z m121.6 108.8c-27.5 11.6-55.9 19.9-84.9 24.8 37.4-28.6 70.6-62.7 98.5-101.6 21.9 9.2 43.1 20.3 63.3 33.2-23.8 17.4-49.5 32-76.9 43.6z m204.2-204.3c-19.3 45.7-47 86.7-82.3 122l-0.9 0.9c-24.4-16.9-50.2-31.4-77.2-43.4 34-61.8 53.7-130.1 57.8-201H895c-3 42-12.8 82.7-29.2 121.5z"
        p-id="4628"
      ></path>
    </svg>
  );
};

export const MusicTagIcon: FunctionalComponent<any, { attrs: any }> = (props, { attrs }) => {
  return (
    <svg
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      width="24"
      height="24"
      {...attrs}
    >
      <path
        d="M362 312h300v60H362z"
        fill="currentColor"
        p-id="10435"
      ></path>
      <path
        d="M772 162H212v699.999l60-34.641 240-150.111 240 150.111L812 862V162h-40zM572 642.607l-60-34.641-60 34.641-180 115.47V222h480v536.076L572 642.607z"
        fill="currentColor"
        p-id="10436"
      ></path>
    </svg>
  );
};

export const MusicStyleIcon: FunctionalComponent<any, { attrs: any }> = (props, { attrs }) => {
  return (
    <svg
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      width="24"
      height="24"
      {...attrs}
    >
      <path
        d="M512 0c279.04 0 512 204.8 512 460.8a310.784 310.784 0 0 1-307.2 312.32h-92.672a19.456 19.456 0 0 0-19.456 18.944s0 5.12 6.144 11.264a121.856 121.856 0 0 1 31.744 84.992A132.608 132.608 0 0 1 512 1024a512 512 0 0 1 0-1024z m0 81.92a430.08 430.08 0 0 0 0 860.16 51.2 51.2 0 0 0 51.2-51.2 44.544 44.544 0 0 0-7.168-26.624l-7.168-7.68a102.4 102.4 0 0 1-24.064-64.512 102.4 102.4 0 0 1 102.4-102.4H716.8A228.864 228.864 0 0 0 942.08 460.8c-3.584-204.8-195.584-378.88-430.08-378.88z m240.64 261.12A117.76 117.76 0 1 1 633.344 460.8a117.76 117.76 0 0 1 117.76-117.76zM256 337.92a117.76 117.76 0 1 1-117.76 117.76A117.76 117.76 0 0 1 256 337.92z m496.128 87.04a35.84 35.84 0 1 0 35.84 35.84 35.84 35.84 0 0 0-36.864-35.84zM256 419.84a35.84 35.84 0 1 0 0 71.68 35.84 35.84 0 0 0 0-71.68zM536.576 153.6a117.76 117.76 0 1 1-117.76 117.76 117.76 117.76 0 0 1 117.76-117.76z m0 81.92a35.84 35.84 0 1 0 35.84 35.84 35.84 35.84 0 0 0-35.84-36.352z"
        fill="currentColor"
        p-id="11383"
      ></path>
    </svg>
  );
};
