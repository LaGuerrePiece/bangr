import "@ethersproject/shims";
import { ethers } from "ethers";

export function formatUnits(
  unformatted: string | undefined | null,
  tokenDecimals: number | undefined | null,
  decimalsToKeep: number
): string {
  const formatted = ethers.utils.formatUnits(
    unformatted ?? "0",
    tokenDecimals ?? 18
  );
  return cutDecimals(Number(formatted), decimalsToKeep);
}

export function keepTwoDecimals(num: number): string {
  return (Math.round(num * 100) / 100).toFixed(2);
}

export function cutDecimals(num: number, decimalsToKeep: number): string {
  return (
    Math.round(num * 10 ** decimalsToKeep) /
    10 ** decimalsToKeep
  ).toFixed(decimalsToKeep);
}
