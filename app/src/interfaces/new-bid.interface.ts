import { Address } from "."

export default interface NewBid {
  value: number;
  tokenIndex: number;
  bidder: Address
  prevBidder: Address;
}
