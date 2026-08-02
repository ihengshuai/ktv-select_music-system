import { defineComponent } from "vue";

import "./style.less";
import {
  MusicFavorite,
  MusicHeat,
  MusicHistory,
  MusicIcon,
  MusicLanguageIcon,
  MusicMicroPhone,
  MusicNextIcon,
  MusicPlayIcon,
  MusicRefreshIcon,
  MusicRegionIcon,
  MusicScoreIcon,
  MusicStyleIcon,
  MusicTagIcon,
  MusicUserIcon,
  MusicVolumeIcon,
} from "@/components/common/icon/music";

const ClientHomeMusic = defineComponent({
  name: "ClientHomeMusic",
  setup() {
    return () => (
      <div class="music-home flex-1  relative">
        <div class="w-80% grid grid-cols-5 gap-5 max-w-980px absolute top-3/8 left-1/2 transform-translate-y--1/2 transform-translate-x--1/2">
          <button class="w-160px group relative h-52 rounded-2xl overflow-hidden border-2 border-amber-600/50 hover:border-amber-400 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/30">
            <div class="absolute inset-0 bg-gradient-to-br from-amber-600 via-amber-500 to-amber-400 opacity-90"></div>
            <div class="absolute inset-0 bg-black/40"></div>
            <div class="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div class="relative h-full flex flex-col items-center justify-center p-4">
              <div class="mb-4">
                <MusicIcon class="lucide lucide-music w-16 h-16 text-white drop-shadow-lg" />
              </div>

              <h3 class="text-white font-bold text-xl mb-1">歌名</h3>
              <p class="text-white/80 text-sm tracking-wider">SONGS</p>
            </div>
          </button>

          <button class="group relative w-160px h-52 rounded-2xl overflow-hidden border-2 border-amber-600/50 hover:border-amber-400 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/30">
            <div class="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-600 to-slate-500 opacity-90"></div>
            <div class="absolute inset-0 bg-black/40"></div>
            <div class="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div class="relative h-full flex flex-col items-center justify-center p-4">
              <div class="mb-4">
                <MusicUserIcon class="lucide lucide-music w-16 h-16 text-white drop-shadow-lg" />
              </div>

              <h3 class="text-white font-bold text-xl mb-1">歌手</h3>
              <p class="text-white/80 text-sm tracking-wider">SINGER</p>
            </div>
          </button>

          <button class="group relative w-160px h-52 rounded-2xl overflow-hidden border-2 border-amber-600/50 hover:border-amber-400 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/30">
            <div class="absolute inset-0 bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 opacity-90"></div>
            <div class="absolute inset-0 bg-black/40"></div>
            <div class="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div class="relative h-full flex flex-col items-center justify-center p-4">
              <div class="mb-4">
                <MusicHeat class="lucide lucide-music w-16 h-16 text-white drop-shadow-lg" />
              </div>

              <h3 class="text-white font-bold text-xl mb-1">排行榜</h3>
              <p class="text-white/80 text-sm tracking-wider">RANKING</p>
            </div>
          </button>

          <button class="group relative w-160px h-52 rounded-2xl overflow-hidden border-2 border-amber-600/50 hover:border-amber-400 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/30">
            <div class="absolute inset-0 bg-gradient-to-br from-amber-700 via-amber-600 to-yellow-500 opacity-90"></div>
            <div class="absolute inset-0 bg-black/40"></div>
            <div class="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div class="relative h-full flex flex-col items-center justify-center p-4">
              <div class="mb-4">
                <MusicFavorite class="lucide lucide-music w-16 h-16 text-white drop-shadow-lg" />
              </div>

              <h3 class="text-white font-bold text-xl mb-1">推荐</h3>
              <p class="text-white/80 text-sm tracking-wider">RECOMMEND</p>
            </div>
          </button>

          <button class="group relative w-160px h-52 rounded-2xl overflow-hidden border-2 border-amber-600/50 hover:border-amber-400 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/30">
            <div class="absolute inset-0 bg-gradient-to-br from-orange-600 via-amber-600 to-purple opacity-90"></div>
            <div class="absolute inset-0 bg-black/40"></div>
            <div class="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div class="relative h-full flex flex-col items-center justify-center p-4">
              <div class="mb-4">
                <MusicRegionIcon class="lucide lucide-music w-16 h-16 text-white drop-shadow-lg" />
              </div>

              <h3 class="text-white font-bold text-xl mb-1">地区</h3>
              <p class="text-white/80 text-sm tracking-wider">RECOMMEND</p>
            </div>
          </button>

          <button class="group relative w-160px h-52 rounded-2xl overflow-hidden border-2 border-amber-600/50 hover:border-amber-400 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/30">
            <div class="absolute inset-0 bg-gradient-to-br from-pink-700 via-amber-600 to-yellow-500 opacity-90"></div>
            <div class="absolute inset-0 bg-black/40"></div>
            <div class="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div class="relative h-full flex flex-col items-center justify-center p-4">
              <div class="mb-4">
                <MusicLanguageIcon class="lucide lucide-music w-16 h-16 text-white drop-shadow-lg" />
              </div>

              <h3 class="text-white font-bold text-xl mb-1">语种</h3>
              <p class="text-white/80 text-sm tracking-wider">LANGUAGE</p>
            </div>
          </button>

          <button class="group relative w-160px h-52 rounded-2xl overflow-hidden border-2 border-amber-600/50 hover:border-amber-400 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/30">
            <div class="absolute inset-0 bg-gradient-to-br from-purple-700 via-amber-600 to-pink-100 opacity-90"></div>
            <div class="absolute inset-0 bg-black/40"></div>
            <div class="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div class="relative h-full flex flex-col items-center justify-center p-4">
              <div class="mb-4">
                <MusicStyleIcon class="lucide lucide-music w-16 h-16 text-white drop-shadow-lg" />
              </div>

              <h3 class="text-white font-bold text-xl mb-1">风格</h3>
              <p class="text-white/80 text-sm tracking-wider">STYLE</p>
            </div>
          </button>

          <button class="group relative w-160px h-52 rounded-2xl overflow-hidden border-2 border-amber-600/50 hover:border-amber-400 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/30">
            <div class="absolute inset-0 bg-gradient-to-br from-red-700 via-amber-600 to-yellow opacity-90"></div>
            <div class="absolute inset-0 bg-black/40"></div>
            <div class="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div class="relative h-full flex flex-col items-center justify-center p-4">
              <div class="mb-4">
                <MusicTagIcon class="lucide lucide-music w-16 h-16 text-white" />
              </div>

              <h3 class="text-white font-bold text-xl mb-1">标签</h3>
              <p class="text-white/80 text-sm tracking-wider">TAG</p>
            </div>
          </button>

          <button class="group relative w-160px h-52 rounded-2xl overflow-hidden border-2 border-amber-600/50 hover:border-amber-400 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/30">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 opacity-90"></div>
            <div class="absolute inset-0 bg-black/40"></div>
            <div class="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div class="relative h-full flex flex-col items-center justify-center p-4">
              <div class="mb-4">
                <MusicHistory class="lucide lucide-music w-16 h-16 text-white drop-shadow-lg" />
              </div>

              <h3 class="text-white font-bold text-xl mb-1">历史</h3>
              <p class="text-white/80 text-sm tracking-wider">HISTORY</p>
            </div>
          </button>
        </div>

        <div class="music-home__nav absolute backdrop-blur-sm border border-amber-600/30 rounded-2xl px-8 py-4 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="text-right">
              <div class="text-orange-400 text-4xl font-bold font-mono">99</div>
              <div class="text-white/50 text-xs">已点</div>
            </div>
          </div>

          <div class="flex items-center gap-8">
            <div class="text-white/70 hover:text-white transition-colors flex flex-col items-center bg-transparent">
              <div class="w-2.5rem h-2.5rem flex items-center justify-center">
                <MusicScoreIcon class="lucide lucide-star w-5 h-5" />
              </div>
              <div class="text-xs mt-1">评分</div>
            </div>

            <div class="text-white/70 hover:text-white transition-colors flex flex-col items-center bg-transparent">
              <div class="w-2.5rem h-2.5rem flex items-center justify-center">
                <MusicUserIcon class="lucide lucide-star w-5 h-5" />
              </div>
              <div class="text-xs mt-1">原唱</div>
            </div>

            <div class="text-white/70 hover:text-white transition-colors flex flex-col items-center bg-transparent">
              <div class="w-2.5rem h-2.5rem flex items-center justify-center">
                <MusicMicroPhone class="lucide lucide-star w-5 h-5" />
              </div>
              <div class="text-xs mt-1">静音</div>
            </div>

            <div class="flex items-center gap-4">
              <div class="text-white/70 hover:text-white transition-colors">
                <MusicVolumeIcon class="lucide lucide-volume2 lucide-volume-2 w-5 h-5" />
              </div>

              <div class="w-32 h-1 bg-white/20 rounded-full relative">
                <div class="h-full bg-amber-500 rounded-full"></div>

                <div class="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-amber-500 rounded-full shadow-lg"></div>
              </div>

              <span class="text-white/70 text-sm min-w-[2rem]">50</span>
            </div>

            <div class="text-white/70 hover:text-white transition-colors flex flex-col items-center bg-transparent">
              <div class="w-2.5rem h-2.5rem flex items-center justify-center">
                <MusicPlayIcon class="lucide lucide-star w-5 h-5" />
              </div>
              <div class="text-xs mt-1">暂停</div>
            </div>

            <div class="text-white/70 hover:text-white transition-colors flex flex-col items-center bg-transparent">
              <div class="w-2.5rem h-2.5rem flex items-center justify-center">
                <MusicRefreshIcon class="lucide lucide-star w-5 h-5" />
              </div>
              <div class="text-xs mt-1">重唱</div>
            </div>

            <div class="text-white/70 hover:text-white transition-colors flex flex-col items-center bg-transparent">
              <div class="w-2.5rem h-2.5rem flex items-center justify-center">
                <MusicNextIcon class="lucide lucide-star w-5 h-5" />
              </div>
              <div class="text-xs mt-1">切歌</div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <div class="text-right">
              <div class="text-amber-400 text-4xl font-bold font-mono">04</div>
              <div class="text-white/50 text-xs">小时</div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

export default ClientHomeMusic;
