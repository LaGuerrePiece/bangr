import { LineChart } from "react-native-wagmi-charts";

export type Point = {
  timestamp: number;
  value: number;
};

function Chart({ chart }: { chart: Point[] }) {
  return (
    <LineChart.Provider data={chart}>
      {/* <LineChart width={150} height={150}> */}
      <LineChart yGutter={16}>
        <LineChart.Path />
        <LineChart.CursorCrosshair />
      </LineChart>
    </LineChart.Provider>
  );
}
export default Chart;
