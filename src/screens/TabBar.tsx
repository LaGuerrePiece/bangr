import { View, Text, TouchableOpacity, Image, useColorScheme } from 'react-native';

export function TabBar({ state, descriptors, navigation } : any) {
    const colorScheme = useColorScheme();

  return (
    <View className='flex flex-row p-4 bg-primary-light dark:bg-secondary-dark'>
      {state.routes.map((route: any, index: any) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: route.name, merge: true });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1 }}
          >

            <View className="w-full flex-col justify-between">
            <Image
                className="h-8 w-8 mx-auto"
                source={ label === "Invest"
                    && colorScheme === "dark"
                    ? require("../../assets/invest-drk.png")
                    : label === "Invest" && colorScheme === "light"
                    ? require("../../assets/invest.png")
                    : label === "Settings" && colorScheme === "dark"
                    ? require("../../assets/settings-drk.png")
                    : label === "Settings" && colorScheme === "light"
                    ? require("../../assets/settings.png")
                    : label === "Wallet" && colorScheme === "dark"
                    ? require("../../assets/pochicon-drk.png")
                    : label === "Wallet" && colorScheme === "light"
                    ? require("../../assets/pochicon.png")
                    : label === "Swap" && colorScheme === "dark"
                    ? require("../../assets/swap-drk.png")
                    : label === "Swap" && colorScheme === "light"
                    ? require("../../assets/swap.png")
                    : label === "History" && colorScheme === "dark"
                    ? require("../../assets/history-drk.png")
                    : label === "History" && colorScheme === "light" 
                    ? require("../../assets/history.png")
                    : label === "Home" && colorScheme === "dark"
                }
    
            />
            <Text className={
                isFocused? "text-center font-InterBold text-typo-light dark:text-typo-dark" : "text-center font-InterBold text-typo-light dark:text-typo-dark opacity-50"

            }>
              {label}
            </Text>
            </View>

          </TouchableOpacity>
        );
      })}
    </View>
  );
}
