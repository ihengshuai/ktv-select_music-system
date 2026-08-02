import { message } from "ant-design-vue";
import { defineStore } from "pinia";
import { computed, nextTick, reactive, watch } from "vue";

import { IMusicVO } from "@/typings/models/music/music";

interface IMusicPlayerState {
  /** 已点歌曲 */
  songList: IMusicVO[];
  /** 播放历史 */
  history: IMusicVO[];
  /** 是否正在播放 */
  playing: boolean;
  /** 音量 */
  volume: number;
  /** 当前播放歌曲的id */
  activeSongId: string | null;
}

export const useMusicPlayerStore = defineStore("musicPlayerStore", () => {
  const musicState = reactive<IMusicPlayerState>({
    /** 已点歌曲 */
    songList: [],
    /** 播放历史 */
    history: [],
    playing: false,
    volume: 0.5,
    activeSongId: null,
  });

  watch(
    () => musicState.songList,
    () => {
      if (musicState.songList.length === 0) {
        musicState.activeSongId = null;
        pause();
      }
    }
  );

  const player = new Audio();

  player.addEventListener("ended", () => {
    pause();

    next();
  });

  const originPlay = player.play;
  player.play = function () {
    return originPlay.call(this).catch(err => {
      console.log("播放失败", err);
    });
  };

  const activeSong = computed(() => {
    return musicState.songList.find(song => song.uid === musicState.activeSongId);
  });

  async function play(song?: IMusicVO) {
    if (song) {
      if (!musicState.songList.find(s => s.uid === song.uid)) {
        musicState.songList.unshift(song);
      }
      musicState.activeSongId = song.uid;
    }

    if (!activeSong.value) {
      musicState.activeSongId = musicState.songList[0].uid;
    }

    if (!musicState.activeSongId) return;

    player.pause();

    await nextTick();
    player.src = activeSong.value!.audioUrl;
    player.play();
    musicState.playing = true;
  }

  function pause() {
    if (!musicState.playing) return;
    if (!activeSong.value) return;

    musicState.playing = false;
  }

  function next() {
    const songList = musicState.songList;
    if (songList.length === 0) return;

    musicState.songList.shift();
    let nextSongIdx = 0;

    const nextSong = songList[nextSongIdx];
    if (nextSong) {
      musicState.activeSongId = nextSong.uid;

      play(nextSong);

      if (!musicState.history.find(song => song.uid === nextSong.uid)) {
        musicState.history.push(nextSong);
      }
    }
  }

  /** 添加歌曲到队列 */
  function push(song: IMusicVO) {
    if (musicState.songList.find(s => s.uid === song.uid)) {
      message.warning("已存在");

      return;
    }

    musicState.songList.push(song);
  }

  /** 置顶 */
  function top(song: IMusicVO) {
    const activeIdx = musicState.songList.findIndex(song => song.uid === musicState.activeSongId);

    musicState.songList.splice(activeIdx, 0, song);
  }

  return {
    musicState,
    activeSong,

    play,
    pause,
    next,
    push,
    top,
  };
});
