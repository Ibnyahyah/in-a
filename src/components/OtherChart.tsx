import { chType } from "@/atoms/campaignAtom";
import { colorCode } from "@/handler/helper";
import React from "react";
type chrtType = {
  color: string;
  percentage: number;
  content: String;
};
type propsTypes = {
  chartData: [chType];
};

function ChartBox({ color, percentage, content }: chrtType) {
  return (
    <div className="flex items-center p-4">
      <div
        className="rounded-full py-3 px-3 drop-shadow-md"
        style={{ backgroundColor: color }}
      />
      <div className="ml-3">
        <h2 className="font-[500] text-[30px]">{percentage.toFixed(2)}%</h2>
        <h2 className="text-[16px] mt-[-.5rem]">{content}</h2>
      </div>
    </div>
  );
}

const OtherChart = ({ chartData }: propsTypes) => {
  return (
    <div style={{ width: "100%" }}>
      <div className="grid grid-cols-2 gap-2">
        {chartData.map((data, index) => {
          return (
            <ChartBox
              color={colorCode()}
              percentage={data.percentage}
              content={data.name}
              key={index}
            />
          );
        })}
      </div>
    </div>
  );
};

export default OtherChart;
