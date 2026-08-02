import { Col, Row, Tag } from "ant-design-vue";
import { ToolboxComponent } from "echarts/components";
import { defineComponent, onMounted, ref } from "vue";

import IPanel from "@/components/common/panel";
import { useEcharts } from "@/hooks/useEcharts";
import { Echarts } from "@/util/business/echarts";

const AnalysisPage = defineComponent({
  name: "AnalysisPage",
  setup() {
    const chartRef = ref();
    let base = +new Date(1968, 9, 3);
    let oneDay = 24 * 3600 * 1000;
    let date = [];
    let data = [Math.random() * 300];
    for (let i = 1; i < 20000; i++) {
      var now = new Date((base += oneDay));
      date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join("/"));
      data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
    }

    const { initEchart } = useEcharts(
      {
        tooltip: {
          trigger: "axis",
          position: function (pt) {
            return [pt[0], "10%"];
          },
        },
        title: {
          left: "center",
          text: "Large Area Chart",
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: "none",
            },
            restore: {},
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: date,
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, "100%"],
        },
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: 10,
          },
          {
            start: 0,
            end: 10,
          },
        ],
        series: [
          {
            name: "Fake Data",
            type: "line",
            symbol: "none",
            sampling: "lttb",
            itemStyle: {
              color: "rgb(255, 70, 131)",
            },
            areaStyle: {
              color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(255, 158, 68)",
                },
                {
                  offset: 1,
                  color: "rgb(255, 70, 131)",
                },
              ]),
            },
            data: data,
          },
        ],
      },
      ToolboxComponent
    );
    onMounted(() => {
      initEchart(chartRef.value);
    });
    return () => (
      <IPanel
        withCard={false}
        withMargin={false}
      >
        <AnalysisPageHeader />
        <IPanel
          withCard={true}
          size="small"
        >
          <div
            ref={chartRef}
            style="width: 100%; height: 400px"
          />
        </IPanel>
      </IPanel>
    );
  },
});

const AnalysisPageHeader = () => (
  <Row>
    <Col span={6}>
      <IPanel
        title={"访问数"}
        size="small"
        extra={<Tag color="blue">月</Tag>}
        bodyStyle={{ padding: "8px 16px" }}
      >
        <h3 style="margin: 4px 0;font-size: 20px;">$5000</h3>
        <p>总访问数$50000</p>
      </IPanel>
    </Col>
    <Col span={6}>
      <IPanel
        title={"下载量"}
        size="small"
        extra={<Tag color="yellow">月</Tag>}
        bodyStyle={{ padding: "8px 16px" }}
      >
        <h3 style="margin: 4px 0;font-size: 20px;">$3000</h3>
        <p>总下载量$90000</p>
      </IPanel>
    </Col>
    <Col span={6}>
      <IPanel
        title={"交易额"}
        size="small"
        extra={<Tag color="red">年</Tag>}
        bodyStyle={{ padding: "8px 16px" }}
      >
        <h3 style="margin: 4px 0;font-size: 20px;">$5000</h3>
        <p>总交易额$12000</p>
      </IPanel>
    </Col>
    <Col span={6}>
      <IPanel
        title={"提醒数"}
        size="small"
        extra={<Tag color="orange">周</Tag>}
        bodyStyle={{ padding: "8px 16px" }}
      >
        <h3 style="margin: 4px 0;font-size: 20px;">$5000</h3>
        <p>总提醒数$50000</p>
      </IPanel>
    </Col>
  </Row>
);

export default AnalysisPage;
