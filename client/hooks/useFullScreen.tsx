import { onMounted, ref } from "vue";

/** 切换全屏显示 */
export function useFullScreen() {
  const isFullScreen = ref(false);

  onMounted(() => {
    isFullScreen.value = document.fullscreenElement !== null;
  });

  function toggleFullScreen() {
    if (isFullScreen.value) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
    isFullScreen.value = !isFullScreen.value;
  }

  return {
    isFullScreen,
    toggleFullScreen,
  };
}
