pragma solidity ^0.4.24;

import './ArtworkBase.sol';
import '../node_modules/zeppelin-solidity/contracts/math/SafeMath.sol';

contract Auction {
  using SafeMath for uint;

  address public owner;
  uint public startDate;
  uint public endDate;
  uint public startingBid;
  uint public bidIncrement;
  uint public artworkIndex;
  uint public highestAllowedBidAmount;
  bool public hasOwnerWithdrawn;
  address public highestBidder;
  mapping (address => uint) bidderToAmount;

  modifier onlyNotEnded() {
    require(getTimeRemaining() > 0);
    _;
  }

  modifier onlyEnded() {
    require(now >= endDate, "ended");
    _;
  }

  modifier onlyNotOwner() {
    require(msg.sender != owner);
    _;
  }

  modifier onlyValidBid() {
    uint currentBid = bidderToAmount[msg.sender].add(msg.value);
    if (highestBidder == 0x0) require(currentBid >= startingBid);
    require(currentBid >= bidderToAmount[highestBidder].add(bidIncrement));
    require(currentBid <= highestAllowedBidAmount);
    _;
  }

  constructor (uint _durationInSec, uint _artworkIndex, uint _startingBid, uint _highestAllowedBidAmount, uint _bidIncrement) public {
    owner = msg.sender;
    startDate = now;
    endDate = startDate.add(_durationInSec);
    artworkIndex = _artworkIndex;
    startingBid = _startingBid;
    highestAllowedBidAmount = _highestAllowedBidAmount;
    bidIncrement = _bidIncrement;
  }

  function getTimeRemaining() public view returns (uint) {
    if (now > endDate) return 0;
    return endDate - startDate + now;
  }

  function getHighestBid() public view returns (uint) {
    return bidderToAmount[highestBidder];
  }

  function placeBid() public payable onlyNotEnded onlyValidBid onlyNotOwner {
    highestBidder = msg.sender;
    bidderToAmount[msg.sender] = bidderToAmount[msg.sender].add(msg.value);
  }

  function getWinner() external view onlyEnded returns (address, uint) {
    return (
      highestBidder,
      bidderToAmount[highestBidder]
    );
  }

  function getTotalBidByAddress(address _bidder) external view returns (uint) {
    return bidderToAmount[_bidder];
  }

  function withdraw() external payable onlyEnded returns (bool) {
    require(highestBidder != msg.sender);
    if (msg.sender == owner && !hasOwnerWithdrawn) {
      owner.transfer(bidderToAmount[highestBidder]);
      bidderToAmount[highestBidder] = 0;
      hasOwnerWithdrawn = true;
      return true;
    } else {
      msg.sender.transfer(bidderToAmount[msg.sender]);
      bidderToAmount[msg.sender] = 0;
      return true;
    }
    return false;
  }
}