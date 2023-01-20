import { Dimensions, View, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";
import useHistoricStore from "../state/historic";
import useTokensStore from "../state/tokens";

const Chart = () => {
  const screenWidth = Dimensions.get("window").width;
  const historic = useHistoricStore((state) => state.historic);
  const tokens = useTokensStore((state) => state.tokens);
  const totalPortfolioValue = tokens
    ?.filter((token) => Number(token.balance) > 1)
    .reduce((a, b) => a + (b.quote ?? 0), 0)
    .toFixed(2);
  let labels: any = [];
  let values: any = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    totalPortfolioValue,
    Number(totalPortfolioValue) * 1.001,
    Number(totalPortfolioValue) * 1.002,
    Number(totalPortfolioValue) * 1.001,
    Number(totalPortfolioValue) * 1.001,
    Number(totalPortfolioValue) * 1.002,
    Number(totalPortfolioValue) * 1.003,
    Number(totalPortfolioValue) * 1.004,
    Number(totalPortfolioValue) * 1.005,
    Number(totalPortfolioValue) * 1.006,
    Number(totalPortfolioValue) * 1.007,
    Number(totalPortfolioValue) * 1.008,
    Number(totalPortfolioValue) * 1.009,
    Number(totalPortfolioValue) * 1.01,
    Number(totalPortfolioValue) * 1.011,
    Number(totalPortfolioValue) * 1.012,
  ];
  //Until we have a better way to get historic data than Covalent

  // console.log("historic", historic);
  // for (const [date, value] of Object.entries(historic)) {
  //   // labels.push(date);
  //   labels.push("");
  //   values.push(value);
  // }
  // while (values.filter((v: number) => v === 0).length > 2) {
  //   values.shift();
  //   labels.shift();
  // }
  // console.log("values", values);

  const chartConfig = {
    backgroundGradientFrom: "rgba(255, 255, 255, 1)",
    backgroundGradientTo: "rgba(255, 255, 255, 1)",
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    color: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 5, // optional, default 3
    style: {
      borderRadius: 20,
      margin: 0,
      padding: 0,
    },
  };
  const data = {
    labels: [],
    datasets: [
      {
        data: values,
        color: (opacity = 1) => `rgba(74, 127, 166, ${opacity})`, // optional
        strokeWidth: 4, // optional
      },
    ],
  };
  return (
    <View>
      <LineChart
        data={data}
        width={(screenWidth * 10.5) / 12}
        height={80}
        fromZero={true}
        xLabelsOffset={0}
        verticalLabelRotation={30}
        chartConfig={chartConfig}
        withHorizontalLabels={false}
        //put right and left padding to 0
        style={{
          paddingLeft: 0,
          paddingRight: 0,
          marginRight: 0,
          marginLeft: 0,
        }}
        withInnerLines={false}
        withOuterLines={false}
        yLabelsOffset={0}
        hidePointsAtIndex={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
        withVerticalLines={false}
        withDots={false}
        withShadow={false}
        withVerticalLabels={false}
        withHorizontalLines={false}
        bezier
      />
    </View>
  );
};
export default Chart;
