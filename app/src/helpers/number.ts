import { ethers } from 'ethers';

export function toEth(value: number | string): number {
  return +ethers.utils.formatEther(ethers.BigNumber.from(value.toString()));
}
