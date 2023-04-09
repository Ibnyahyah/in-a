import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import React from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type CampaignChartProps = {};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    // title: {
    //   display: true,
    //   text: "Chart.js Bar Chart",
    // },
  },
};

const labels = Array.from({ length: 20 }, (_, i) => i + 1);

const chart_data = [];
while (chart_data.length < 20) {
  const rand = Math.floor(Math.random() * 35);
  chart_data.push(rand);
}
const data = {
  labels,
  datasets: [
    {
      label: "Email sent",
      data: chart_data,
      backgroundColor: "rgb(34, 139, 230)",
      borderColor: "transparent",
      borderWidth: 1,
    },
  ],
};

const CampaignChart: React.FC<CampaignChartProps> = () => {
  return (
    <div>
      <Bar options={options} data={data} />
      <div className="flex items-center text-[12px] justify-between my-8 px-4">
        <p>Feb 1st, 2023</p>
        <p>Feb 20th, 2023</p>
      </div>
    </div>
  );
};

export default CampaignChart;
