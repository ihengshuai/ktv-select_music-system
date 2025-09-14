import { BarChart, LineChart, PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
} from "echarts/components";
import * as _echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";

_echarts.use([
  // 基础组件
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
  CanvasRenderer,

  // 默认图表类型
  BarChart,
  LineChart,
  PieChart,
]);

export const Echarts = _echarts;
