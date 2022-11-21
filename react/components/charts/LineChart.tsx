import React from "react";
import ReactFC from "react-fusioncharts";
import FusionCharts from "fusioncharts";
import Column2D from "fusioncharts/fusioncharts.charts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
// import { currentDate, parseNumberExtension } from "../../utils";
ReactFC.fcRoot(FusionCharts, Column2D, FusionTheme);

const LineChart = ({ categories, data, labelYAxis }: any) => {

  const dataSource = {
    chart: {
      showLegend: "0",
      plottooltext: "<b>$dataValue</b> $seriesName",
      theme: "fusion",
      showxaxisline: "1",
      anchorradius: "6",
      showyaxisline: "1",
      xaxislinecolor: "#ACACAC",
      yaxislinecolor: "#ACACAC",
      anchorBorderColor: "#ffffff",
      anchorBorderThickness: "2",
      lineThickness: '0.7',
    },
    categories,
    dataset: data,
  };

  return (
    <ReactFC
      type="msline"
      width="100%"
      height="100%"
      dataFormat="JSON"
      dataSource={dataSource}
    />
  )
}

export default LineChart;