pragma solidity ^0.4.24;

import './ArtworkBase.sol';
import '../node_modules/zeppelin-solidity/contracts/math/SafeMath.sol';

contract Auction {
  using SafeMath for uint;

  address public owner;
  uint public startDate;
  uint public endDate;
  uint public bidIncrement;
  uint public artworkIndex;
  uint public highestAllowedBidAmount;
  bool public hasOwnerWithdrawn;
  address public highestBidder;
  mapping (address => uint) bidderToAmount;

  modifier onlyNotEnded() {
    require(endDate < now && now > startDate);
    _;
  }

  modifier onlyEnded() {
    require(now >= endDate);
    _;
  }

  modifier onlyNotOwner() {
    require(msg.sender != owner);
    _;
  }

  modifier onlyValidBid() {
    uint currentBid = bidderToAmount[msg.sender].add(msg.value);
    require(currentBid >= bidderToAmount[highestBidder].add(bidIncrement));
    require(currentBid <= highestAllowedBidAmount);
    _;
  }

  constructor (uint _duration, uint _artworkIndex, uint _highestAllowedBidAmount) public {
    owner = msg.sender;
    startDate = now;
    endDate = startDate.add(_duration);
    artworkIndex = _artworkIndex;
    highestAllowedBidAmount = _highestAllowedBidAmount;
  }

  function getTimeRemaining() public view onlyNotEnded returns (uint) {
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