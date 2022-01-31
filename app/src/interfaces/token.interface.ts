import { Address } from ".";

export default interface Token {
  value: number;
  bidder: Address
  tokenId: number;
}
