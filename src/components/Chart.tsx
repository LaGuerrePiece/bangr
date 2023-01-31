import { LineChart } from "react-native-wagmi-charts";
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;

export type Point = {
  timestamp: number;
  value: number;
};

function Chart({ chart }: { chart: Point[] }) {
  return (
    <LineChart.Provider data={chart}>
      <LineChart width={(screenWidth * 11) / 12} height={150} yGutter={16}>
        <LineChart.Path />
        <LineChart.CursorCrosshair />
      </LineChart>
    </LineChart.Provider>
  );
}
export default Chart;
