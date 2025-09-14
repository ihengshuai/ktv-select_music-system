import { EChartsOption } from "echarts";

import { Echarts } from "@/util";

/**
 * 图标使用
 */
export function useEcharts(opts?: EChartsOption, components?: any | any[]) {
  if (components) {
    Echarts.use(components);
  }
  console.log("useEcharts");

  function initEchart(el: HTMLElement) {
    return Echarts.init(el).setOption(opts!);
  }

  return {
    Echarts,
    initEchart,
  };
}
