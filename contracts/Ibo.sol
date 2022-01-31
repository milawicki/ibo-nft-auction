//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./interfaces/Bid.struct.sol";
import "./interfaces/BidWithTokenId.struct.sol";
import "./IboEvents.sol";

/**
  @title Initial Bottle Offering - NTF Auction
  @author Mike Lawicki http://lawicki.pl/
  @notice 
 */
contract Ibo is ERC721Enumerable, IboEvents {
  /// @dev Maps tokenId to Bid data
  mapping(uint256 => Bid) private bids;

  /// @dev Maps addresses to refund values
  mapping(address => uint256) private refunds;

  /// @notice Time of closing the auction
  uint256 public immutable endOfBiddingDate;

  /// @dev Allows calling functions only when bidding is still active
  modifier onlyWhenBiddingIsActive() {
    require(_isBiddingActive(), "Bidding is over");

    _;
  }

  /// @dev Allows calling functions only when bidding is finished
  modifier onlyWhenBiddingIsOver() {
    require(!_isBiddingActive(), "Bidding is still on");

    _;
  }

  /**
    @notice Mints all tokens during creation and transfer ownership to sender
    @param name_ Token aka Bottle name 
    @param symbol_ Token symbol
    @param cap_ Number of bottles available on auction
    @param biddingDays_ Number of days auction will be active
  */
  constructor(string memory name_, string memory symbol_, uint256 cap_, uint256 biddingDays_) ERC721(name_, symbol_) {
    for(uint ndx = 0; ndx < cap_; ndx++) {
      _mint(msg.sender, ndx);
    }

    endOfBiddingDate = block.timestamp + (biddingDays_ * 1 days);
  }

  /**
    @notice Gets list of all bids
    @return Array of BidWithTokenId
  */
  function getTokensList() external view returns(BidWithTokenId[] memory) {
    BidWithTokenId[] memory bids_ = new BidWithTokenId[](totalSupply());
    for(uint ndx = 0; ndx < totalSupply(); ndx++) {
      bids_[ndx].bidder = bids[ndx].bidder;
      bids_[ndx].value = bids[ndx].value;
      bids_[ndx].tokenId = ndx;
    }

    return bids_;
  }

  /**
    @notice Adds new bid. The bid has to be bigger than the current one. Current bidder cannot overbid themself.
    Can be called only when bidding is active. Returns funds to previous bidder and emits NewBid.
    @param tokenIndex Id of token / bottle
   */
  function bid(uint256 tokenIndex) external payable onlyWhenBiddingIsActive {
    Bid storage currentBid = bids[tokenIndex];

    require(msg.value > currentBid.value, "Your bid must be higher than curent one");
    require(msg.sender != currentBid.bidder, "You cannot overbid yourself");

    address prevBidder = currentBid.bidder;

    refunds[currentBid.bidder] += currentBid.value;
    bids[tokenIndex] = Bid(msg.value, msg.sender);

    emit NewBid(msg.value, tokenIndex, msg.sender, prevBidder);
  }

  /**
    @notice Gets current bid for selected token
    @param tokenIndex Token ID
    @return Curent Bid
   */
  function getCurrentBid(uint256 tokenIndex) external view returns(Bid memory) {
    return bids[tokenIndex];
  }

  /**
    @notice Gets value of funds to return to sender 
    @return Value to return
   */
  function getRefundValue() external view returns(uint256) {
    return refunds[msg.sender];
  }

  /**
    @notice Transfers token to sender if one's the top bidder
   */
  function transferTokens() external onlyWhenBiddingIsOver {
    for(uint ndx = 0; ndx < totalSupply(); ndx++) {
      Bid storage currentBid = bids[ndx];
      
      if (currentBid.bidder == msg.sender) {
        _transferToken(ndx);
      }
    }
  }

  /**
    @dev Checks if bidding is still active
    @return Bidding status
   */
  function _isBiddingActive() internal view returns(bool) {
    return block.timestamp <= endOfBiddingDate;
  }

  /**
    @dev Transfers ownership of selected token to top bidder and transfers bid value to owner
    @param tokenIndex Token ID
   */
  function _transferToken(uint256 tokenIndex) internal {
    Bid storage currentBid = bids[tokenIndex];
    uint256 price = currentBid.value;

    currentBid.value = 0;
    currentBid.bidder = address(0);

    payable(ownerOf(tokenIndex)).transfer(price);
    _safeTransfer(ownerOf(tokenIndex), msg.sender, tokenIndex, "");
  }

  /**
    @notice Transfers funds to return to sender and emits Refund event
   */
  function refund() external {
    uint256 toRefund = refunds[msg.sender];
    require(toRefund > 0, "Nothing to refund");

    refunds[msg.sender] = 0;
    payable(msg.sender).transfer(toRefund);

    emit Refund(toRefund, msg.sender);
  }
}
