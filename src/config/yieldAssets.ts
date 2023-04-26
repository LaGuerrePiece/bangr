export type YieldAsset = {
  symbol: string;
  yieldLow: string;
  yieldHigh: string;
  investments: Investment[];
};

export type Investment = {
  name: string;
  image?: string;
  description?: string;
  contract?: string;
  tvl?: string;
  vaultName?: string;
  disabled?: boolean;
};

// yieldAssets map assets to investments to display on the UI.
export const yieldAssets: YieldAsset[] = [
  {
    symbol: "ETH",
    yieldLow: "5.06",
    yieldHigh: "9.36",
    investments: [
      {
        name: "Staking",
        image: "https://i.imgur.com/TunJ5oI.png",
        description: "Contribute to the security of the Ethereum network",
        contract: "Simple",
        tvl: "468M",
        vaultName: "RocketPool",
      },
      {
        name: "Leveraged Staking",
        image: "https://i.imgur.com/ETi3RCS.png",
        description: "Enjoy multiplied staking rewards",
        contract: "Complex",
        tvl: "1.48B",
        vaultName: "RocketPool",
        disabled: true,
      },
      // {
      //   name: "Diversified Staking",
      //   vaultName: "GMX | Currency basket",
      //   contract: "Complex",
      //   disabled: true,
      // },
    ],
  },
  {
    symbol: "USDC",
    yieldLow: "1.22",
    yieldHigh: "12.59",
    investments: [
      {
        name: "Lending",
        vaultName: "Aave USDC",
        contract: "Simple",
        tvl: "111M",
        image: "https://i.imgur.com/ZVEgeLH.png",
      },
      {
        name: "JonesDAO | USDC",
        vaultName: "JonesDAO | USDC",
        contract: "Complex",
        disabled: true,
      },
      {
        name: "U.S. Treasury Bonds",
        vaultName: "U.S. Treasury Bonds",
        contract: "Simple",
        disabled: true,
      },
      {
        name: "Real estate",
        vaultName: "Real estate",
        contract: "Simple",
        disabled: true,
      },
    ],
  },
  {
    symbol: "agEUR",
    yieldLow: "1.34",
    yieldHigh: "13.82",
    investments: [
      {
        name: "Bangr | Euro Pool",
        vaultName: "Bangr | Euro Pool",
        contract: "Complex",
        disabled: true,
      },
    ],
  },
];
