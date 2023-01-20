import {VaultData, VaultProtocol} from "../types/types"

export const vaultsStatic = [
  {
    name: "Aave USDC",
    image:
      "https://static.debank.com/image/eth_token/logo_url/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9/eee087b66747b09dbfb4ba0b34fd3697.png",
    description: "Securely lend USDC to overcollateralized borrowers.",
    tokens: ["USDC"],
    protocol: VaultProtocol.AAVE,
    active: true,
    color: "#B6509E",
  },
  {
    name: "RocketPool",
    image:
      "https://static.debank.com/image/arb_token/logo_url/0xb766039cc6db368759c1e56b79affe831d0cc507/f310ef0bdbf9f72e72cd54ff7f4d3ee6.png",
    description:
      "Contribute to the security of Ethereum by staking ETH with RocketPool.",
    tokens: ["ETH"],
    protocol: VaultProtocol.ROCKET_POOL,
    active: false,
    color: "#E18700",
  },
  {
    name: "GLP",
    image:
      "https://static.debank.com/image/arb_token/logo_url/0xb766039cc6db368759c1e56b79affe831d0cc507/f310ef0bdbf9f72e72cd54ff7f4d3ee6.png",
    description: "Earn on the losses of gullible traders.",
    tokens: ["ETH", "WBTC", "USDC", "USDT", "LINK", "DAI", "FRAX", "UNI"],
    protocol: VaultProtocol.GMX,
    active: false,
    color: "#006CD0",
  },
  {
    name: "agEUR-USDC",
    image:
      "https://static.debank.com/image/arb_token/logo_url/0xb766039cc6db368759c1e56b79affe831d0cc507/f310ef0bdbf9f72e72cd54ff7f4d3ee6.png",
    description:
      "Earn by providing liquidity to traders in the agEUR/USDC pair.",
    tokens: ["agEUR", "USDC"],
    protocol: VaultProtocol.VELODROME,
    active: false,
    color: "#4EA1ED",
  },
  {
    name: "sEUR-jEUR",
    image:
      "https://static.debank.com/image/arb_token/logo_url/0xb766039cc6db368759c1e56b79affe831d0cc507/f310ef0bdbf9f72e72cd54ff7f4d3ee6.png",
    description:
      "Earn by providing liquidity to traders in the sEUR/jEUR pair.",
    tokens: ["sEUR", "jEUR"],
    protocol: VaultProtocol.VELODROME,
    active: false,
    color: "#4EA1ED",
  },
]