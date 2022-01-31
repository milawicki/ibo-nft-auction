//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

/// @notice Abstract contact containing all events
abstract contract IboEvents {
  /**
    @notice Event triggered after new bid has been made
    @param value New bid value 
    @param tokenIndex Index of the token
    @param bidder Current top bidder address
    @param prevBidder Previous top bidder address
  */
  event NewBid(uint256 value, uint256 indexed tokenIndex, address bidder, address prevBidder);

  /**
    @notice Event triggered after user refunded its funds
    @param value Refunded amount
    @param bidder Address to refund
  */
  event Refund(uint256 value, address bidder);
}
