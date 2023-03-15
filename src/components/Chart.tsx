import { LineChart } from "react-native-wagmi-charts";
import { Dimensions, useColorScheme } from "react-native";
import { colors } from "../config/configs";
const screenWidth = Dimensions.get("window").width;

export type Point = {
  timestamp: number;
  value: number;
};

function Chart({ chart }: { chart: Point[] }) {
  const colorScheme = useColorScheme();
  return (
    <LineChart.Provider data={chart}>
      <LineChart width={(screenWidth * 10) / 12 + 5} height={150} yGutter={16}>
        <LineChart.Path
          color={colorScheme === "light" ? colors.typo.light : colors.typo.dark}
        />
        <LineChart.CursorCrosshair />
      </LineChart>
    </LineChart.Provider>
  );
}
export default Chart;
