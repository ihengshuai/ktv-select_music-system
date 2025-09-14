import { message } from "ant-design-vue";
import { isCancel } from "axios";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

import { PromiseConcurrencyLimit } from "@/helper";
import { IRequestConcurrencyLimit, IRequestConcurrencyNoticeParams } from "@/typings/common/http";

interface IUseRequest extends IRequestConcurrencyLimit {
  /** 请求出错时是否提示 */
  noticeError?: boolean;
  loadingTip?: string;
  /** 重试提示 */
  retryTip?: string;
  /** 手动控制请求 */
  manual?: boolean;
}
type IRequestItem = (...args: any[]) => any;

/**
 * 封装请求,可以很方便管理多个请求,并发数等
 * 默认内置loading、retry、notice
 * @example
 *
 * // 单个请求
 * const { data, loading, retryTip } = useRequest(fetchUser);
 *
 * <Spin spin={loading.value} tip={retryTip.value}>
 *   <div>{data.value}</div>
 * </Spin>
 *
 * // 多个请求
 * const {
 *   data,
 *   loading,
 *   retryTip
 * } = useRequest<string, IUser, number>([fetchUser1, fetchUser2, fetchUser3, ...], {
 *   // 请求关联,上一个请求的结果作为下一个请求的参数, 此时limit为1
 *   relation: true,
 *   // 并发数
 *   limit: 3,
 *   // 重试次数
 *   retry: 3
 *   // 其它...
 * });
 */
export function useRequest<T = any>(request: IRequestItem | IRequestItem[], config?: IUseRequest) {
  const { t } = useI18n();
  const { manual } = config || {};
  const requests = Array.isArray(request) ? request : [request];
  const loading = ref(false);
  const data = ref<T>();
  const isRetry = ref(false);
  const loadingTip = computed(() => (isRetry.value ? config?.retryTip || t("common.retryTip") : config?.loadingTip));
  const pcl = new PromiseConcurrencyLimit(config, updateRequestStatus);

  !manual && launcher();

  async function launcher(...args: any) {
    try {
      loading.value = true;
      const res = await Promise.all(
        requests.map(r =>
          pcl.append(function (...rs) {
            return r(...args, ...rs);
          })
        )
      );
      data.value = res as any;
      return data;
    } catch (err: any) {
      config?.noticeError && !isCancel(err) && err.message && message.error(err.message);
    } finally {
      loading.value = false;
      isRetry.value = false;
    }
  }

  function updateRequestStatus({ isRetry: _isRetry }: IRequestConcurrencyNoticeParams) {
    isRetry.value = _isRetry;
  }

  return {
    data,
    loading,
    isRetry,
    loadingTip,
    refresh: launcher,
  };
}
