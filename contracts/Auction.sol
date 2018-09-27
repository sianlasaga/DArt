pragma solidity ^0.4.24;

import './ArtworkBase.sol';
import '../node_modules/zeppelin-solidity/contracts/math/SafeMath.sol';
import '../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol';
import '../node_modules/zeppelin-solidity/contracts/token/ERC721/ERC721Basic.sol';

contract Auction {
  using SafeMath for uint;

  event TransferTokenOwnership(address _from, address _to, uint _tokenId);
  event PlaceBid(address indexed _bidder, uint _incrementAmount, uint totalAmount);
  event Withdraw(address indexed _user, uint _amount);

  ERC721Basic public nfc;
  address public owner;
  uint public startDate;
  uint public endDate;
  uint public startingBid;
  uint public bidIncrement;
  uint public tokenId;
  uint public highestAllowedBidAmount;
  bool public hasOwnerWithdrawn;
  address public highestBidder;
  mapping (address => uint) bidderToAmount;

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  modifier onlyNotEnded() {
    require(getTimeRemaining() > 0);
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

  constructor (uint _tokenId, address _gallery, uint _durationInSec, uint _startingBid, uint _highestAllowedBidAmount, uint _bidIncrement, address _nfc) public {
    nfc = ERC721Basic(_nfc);
    owner = msg.sender;
    startDate = now;
    endDate = startDate.add(_durationInSec);
    tokenId = _tokenId;
    owner = _gallery;
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
    emit PlaceBid(msg.sender, msg.value, bidderToAmount[msg.sender]);
  }

  function getWinner() external view returns (address, uint) {
    require(hasEnded());
    return (
      highestBidder,
      bidderToAmount[highestBidder]
    );
  }

  function getTotalBidByAddress(address _bidder) external view returns (uint) {
    return bidderToAmount[_bidder];
  }

  function isUserSubscribed(address _userAddress) external view returns (bool) {
    return _userAddress == owner || bidderToAmount[_userAddress] > 0;
  }

  function withdraw() external payable returns (bool) {
    require(hasEnded());
    require(_hasBidder());
    require(highestBidder != msg.sender);
    if (msg.sender == owner && !hasOwnerWithdrawn) {
      owner.transfer(bidderToAmount[highestBidder]);
      bidderToAmount[highestBidder] = 0;
      hasOwnerWithdrawn = true;
      emit Withdraw(msg.sender, bidderToAmount[highestBidder]);
      return true;
    } else {
      msg.sender.transfer(bidderToAmount[msg.sender]);
      bidderToAmount[msg.sender] = 0;
      emit Withdraw(msg.sender, bidderToAmount[msg.sender]);
      return true;
    }
    return false;
  }

  function cancel() public onlyOwner onlyNotEnded {
    nfc.transferFrom(this, owner, tokenId);
  }

  function transferToken() public {
    address to = highestBidder;
    if (!_hasBidder()) {
      to = owner;
    }
    emit TransferTokenOwnership(this, to, tokenId);
    nfc.transferFrom(address(this), to, tokenId);
  }

  function _hasBidder() private view returns (bool) {
    return highestBidder != 0x0;
  }

  function hasEnded() public view returns (bool) {
    return now >= endDate;
  }
}