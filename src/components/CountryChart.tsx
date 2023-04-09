import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { chType } from "@/atoms/campaignAtom";
import { colorCode } from "@/handler/helper";

type propsTypes = {
  header: string;
  chartData: [chType];
};

const CountryChart = ({ header, chartData }: propsTypes) => {
  const newChartData = () => {
    let newArr = [] as any[];
    chartData.forEach((element) => {
      newArr.push(element.percentage);
    });
    return newArr;
  };
  const newLabelData = () => {
    let newArr = [] as any[];
    chartData.forEach((element) => {
      newArr.push(element.name);
    });
    return newArr;
  };
  const newBg = () => {
    let newArr = [] as any[];
    chartData.forEach((_) => {
      newArr.push(colorCode());
    });
    return newArr;
  };
  const data = {
    datasets: [
      {
        label: header,
        data: newChartData(),
        backgroundColor: newBg(),
      },
    ],
    labels: newLabelData(),
  };
  ChartJS.register(ArcElement, Tooltip, Legend);
  return (
    <div style={{ width: "70%", margin: "auto" }}>
      <h2 className="text-[18px] mb-[.05rem]">{header}</h2>
      <Doughnut
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: true,
        }}
      />
    </div>
  );
};
export default CountryChart;
