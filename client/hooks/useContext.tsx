import { InjectionKey, inject, reactive, readonly as defineReadonly, provide } from "vue";

import { IDict } from "@/typings/common/type";

export interface ICreateContextOpts {
  readonly?: boolean;
  createProvider?: boolean;
  native?: boolean;
}

export function useContext<T>(key: InjectionKey<T>, native?: boolean): T;
export function useContext<T extends IDict<any>>(key: InjectionKey<T>, defaultValue: T = {} as T) {
  return inject(key, defaultValue);
}

export function createContext<T extends IDict<any>>(context: T, key: InjectionKey<T>, opts: ICreateContextOpts = {}) {
  const { readonly = true, createProvider = true, native = false } = opts;
  const state = reactive<T>(context);
  const providerData = readonly ? defineReadonly<T>(context) : state;
  createProvider && provide<T>(key, native ? context : (providerData as any));

  return {
    state,
  };
}
