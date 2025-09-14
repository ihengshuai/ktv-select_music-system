import { isFunction } from "@hengshuai/helper";
import { Card, Skeleton, Spin } from "ant-design-vue";
import { StyleValue, defineAsyncComponent, defineComponent } from "vue";
import { useI18n } from "vue-i18n";

import { NetworkFailure } from "@/components/common/icon";
import { sleep } from "@/util";

// 已加载的组件缓存
const lazyComponentsCache = new Map<any, any>();
// 缓存最大值
const MAX_CACHE_SIZE = 12;

export interface ILazyComponentOpts {
  /** 加载的组件 */
  loader: () => Promise<any>;
  /** 加载过程中loading组件 */
  loadingComponent?: any;
  /** 加载错误时的组件 */
  errorComponent?: any;
  /**
   * 加载最短延时 ms
   * @default 300
   */
  delay?: number;
  /**
   * 是否缓存当前组件(伪缓存,不缓存时一直显示loading)
   * @default true
   */
  cache?: boolean;
  isSpin?: boolean;
  minSkeleton?: number;
  withCard?: boolean;
}
export type ILazyComponent = ILazyComponentOpts | (() => Promise<any>);

export const LazyComponent = function (opts: ILazyComponent) {
  let delay = 300; // 默认300ms
  let LoadingComponent = LazyLoading;
  let errorComponent = LazyError;
  let loader: () => Promise<any>;
  let requiredCache = true;

  if (isFunction(opts)) {
    loader = opts;
  } else {
    loader = opts.loader;
    LoadingComponent = opts.loadingComponent || LoadingComponent;
    errorComponent = opts.errorComponent || errorComponent;
    delay = opts.delay ?? delay;
    requiredCache = opts.cache ?? requiredCache;
  }

  const isSpin = isFunction(opts) ? true : opts?.isSpin ?? true;
  const minSkeleton = isFunction(opts) ? 2 : opts?.minSkeleton ?? 2;
  const withCard = isFunction(opts) ? true : opts?.withCard ?? true;

  return defineComponent({
    render() {
      const Component: any = defineAsyncComponent({
        loader: () =>
          new Promise(async (resolve, reject) => {
            try {
              const cacheKey = loader?.toString();
              const isCached = lazyComponentsCache.has(cacheKey);
              if (isCached) return resolve(lazyComponentsCache.get(cacheKey));
              await sleep(delay);
              const res = await loader();
              requiredCache && lazyComponentsCache.set(cacheKey, res);
              if (lazyComponentsCache.size > MAX_CACHE_SIZE) {
                lazyComponentsCache.delete(lazyComponentsCache.keys().next().value);
              }
              resolve(res);
            } catch (err) {
              console.error("【LazyComponent Fail】", err);
              reject(err);
            }
          }),
        loadingComponent: () => (
          <LoadingComponent
            minSkeleton={minSkeleton}
            withCard={withCard}
            isSpin={isSpin}
          />
        ),
        errorComponent,
        delay: 0,
      });
      return <Component />;
    },
  });
};

export const LazyError = defineComponent({
  render() {
    const { t } = useI18n();
    const style: StyleValue = {
      margin: "120px auto",
      textAlign: "center",
      inset: 0,
    };
    return (
      <figure style={style}>
        <NetworkFailure
          width="300px"
          height="300px"
        />
        <figcaption>
          <strong>
            {t("common.network-fail")},{" "}
            <a
              onClick={e => {
                e.preventDefault();
                window.location.reload();
              }}
            >
              {t("common.click-refresh")}
            </a>
          </strong>
        </figcaption>
      </figure>
    );
  },
});

export const LazyLoading = defineComponent({
  name: "LazyLoading",
  props: {
    isSpin: {
      type: Boolean,
      default: true,
    },
    minSkeleton: {
      type: Number,
      default: 2,
    },
    withCard: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const list = new Array(props.minSkeleton).fill(0);
    const style: StyleValue = {
      position: "fixed",
      top: 0,
      left: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.06)",
      pointerEvents: "none",
      zIndex: 10000,
    };
    return () => {
      const Loading = props.isSpin ? (
        <div style={style}>
          <Spin
            spinning
            size="large"
          />
        </div>
      ) : (
        <>
          {list.map((v, k) =>
            props.withCard ? (
              <Card
                key={k}
                style={"margin: 12px"}
              >
                <Skeleton
                  active
                  loading
                />
              </Card>
            ) : (
              <Skeleton
                key={k}
                active
                loading
                style={"margin: 12px"}
              />
            )
          )}
        </>
      );
      return Loading;
    };
  },
});
