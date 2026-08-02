import { PlayCircleOutlined, DeleteOutlined, PauseCircleOutlined } from "@ant-design/icons-vue";
import { Popconfirm } from "ant-design-vue";
import { defineComponent, onMounted, onUnmounted, reactive } from "vue";
import "./style.less";

const MusicPreview = defineComponent({
  name: "MusicPreview",
  props: {
    url: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      default: "未知",
    },
    showRemove: Boolean,
  },
  emits: {
    remove: Function,
  },
  setup(props, { emit }) {
    const state = reactive<{ playing: boolean; audio: HTMLAudioElement | null }>({
      playing: false,
      audio: null,
    });

    onMounted(initAudio);

    function initAudio() {
      state.audio = new Audio(props.url);
    }

    function onPlay() {
      if (!state.audio) return;
      if (state.playing) {
        state.audio?.pause?.();
      } else {
        state.audio?.play?.();
      }
      state.playing = !state.playing;
    }

    function onRemove() {
      if (state.audio) {
        state.audio.pause?.();
        state.audio = null;
      }
      emit("remove");
    }

    onUnmounted(() => {
      if (state.audio) {
        state.audio.pause?.();
        state.audio = null;
      }
    });

    return () => (
      <div class="music-preview">
        <strong>{props.fileName}</strong>
        {state.playing ? (
          <PauseCircleOutlined
            role="button"
            onClick={onPlay}
          />
        ) : (
          <PlayCircleOutlined
            role="button"
            onClick={onPlay}
          />
        )}
        {props.showRemove && (
          <Popconfirm
            title="确定要删除吗?"
            ok-text="确定"
            cancel-text="取消"
            onConfirm={onRemove}
          >
            <DeleteOutlined role="button" />
          </Popconfirm>
        )}
      </div>
    );
  },
});

export default MusicPreview;
