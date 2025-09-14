export const classPrefix = "_i_";

export function createBem(namespace: string, element?: string, modifier?: string): string {
  let cls = namespace;
  if (element) {
    cls += `__${element}`;
  }
  if (modifier) {
    cls += `--${modifier}`;
  }
  return cls;
}

export function useNameSpace(block: string, needDot = false) {
  const ns = needDot ? `.${classPrefix}__${block}` : `${classPrefix}__${block}`;

  const b = () => ns;
  const e = (element: string) => (element ? createBem(ns, element) : "");
  const m = (modifier: string) => (modifier ? createBem(ns, "", modifier) : "");
  const em = (element: string, modifier: string) => (element && modifier ? createBem(ns, element, modifier) : "");

  return {
    b,
    e,
    m,
    em,
  };
}

export function getAsset(url: string) {
  return new URL(`../../assets/${url}`, import.meta.url).href;
}
