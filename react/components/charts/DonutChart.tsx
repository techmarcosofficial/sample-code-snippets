import React from "react";
import ReactFC from "react-fusioncharts";
import FusionCharts from "fusioncharts";
import Column2D from "fusioncharts/fusioncharts.charts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
ReactFC.fcRoot(FusionCharts, Column2D, FusionTheme);

const DonutChart = ({ data }: any) => {
  const dataSource = {
    chart: {
      showValues: "0",
      decimals: "1",
      theme: "fusion",
      centerLabel: "r",
      pieRadius: "80",
      doughnutRadius: "60",
    },
    data,
  };
  return (
    <ReactFC
      type="doughnut2d"
      width="100%"
      height="190"
      dataFormat="JSON"
      dataSource={dataSource}
    />
  );
};

export default DonutChart;
