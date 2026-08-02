import { reactive } from "vue";

interface IState<T> {
  loading: boolean;
  data: T | null;
  error: Error | null;
}

interface ISingleRequestConfig {
  manual?: boolean;
}

export function useSingleRequest<T extends (...args: any) => any>(request: T, config?: ISingleRequestConfig) {
  const state = reactive<IState<Awaited<ReturnType<T>>>>({
    loading: false,
    data: null,
    error: null,
  });

  if (!config?.manual) {
    loadData();
  }

  async function loadData(x?: Parameters<T>[0], y?: Parameters<T>[1], z?: Parameters<T>[2]) {
    try {
      state.loading = true;
      state.data = await request(x, y, z);
      state.error = null;
    } catch (error) {
      state.error = error as Error;
    } finally {
      state.loading = false;
    }
  }

  return {
    state,
    refresh: loadData,
  };
}
