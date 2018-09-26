pragma solidity ^0.4.24;

import '../node_modules/zeppelin-solidity/contracts/token/ERC721/ERC721Basic.sol';
import '../node_modules/zeppelin-solidity/contracts/token/ERC721/ERC721Receiver.sol';
import '../node_modules/zeppelin-solidity/contracts/AddressUtils.sol';
import '../node_modules/zeppelin-solidity/contracts/introspection/SupportsInterfaceWithLookup.sol';

import './ArtworkBase.sol';
import './Auction.sol';

contract ArtworkOwnership is ArtworkBase, ERC721Basic, SupportsInterfaceWithLookup {
  
  using AddressUtils for address;

  bytes4 private constant ERC721_RECEIVED = 0x150b7a02;

  constructor () public {
    _registerInterface(InterfaceId_ERC721);
    _registerInterface(InterfaceId_ERC721Exists);
  }

  function createAuction(uint _tokenId, uint _durationInSec, uint _startingBid, uint _highestAllowedBidAmount, uint _bidIncrement) public canCreateAuction isOwnerOfToken(_tokenId) returns (address) {
    Auction auction = new Auction(_tokenId, msg.sender, _durationInSec, _startingBid, _highestAllowedBidAmount, _bidIncrement, this);
    artworkIndexToOwner[_tokenId] = auction;
    ownershipTokenCount[auction] = ownershipTokenCount[auction].add(1);
    ownershipTokenCount[msg.sender] = ownershipTokenCount[msg.sender].sub(1);
    auctions.push(auction);
    emit CreateContract(msg.sender, _tokenId, _durationInSec, _startingBid, _highestAllowedBidAmount, _bidIncrement, auction);
    return auction;
  }

  function balanceOf(address _owner) public view returns (uint256) {
    require(_owner != address(0));
    return ownershipTokenCount[_owner];
  }

  function ownerOf(uint256 _tokenId) public view returns (address) {
    address owner = artworkIndexToOwner[_tokenId];
    require(owner != address(0));
    return owner;
  }

  function exists(uint256 _tokenId) public view returns (bool) {
    address owner = artworkIndexToOwner[_tokenId];
    return owner != address(0);
  }

 function approve(address _to, uint256 _tokenId) public {
  address owner = ownerOf(_tokenId);
  require(_to != owner);
  require(msg.sender == owner || isApprovedForAll(owner, msg.sender));
  artworkApprovals[_tokenId] = _to;
  emit Approval(msg.sender, _to, _tokenId);
 }

  function getApproved(uint256 _tokenId) public view returns (address) {
    return artworkApprovals[_tokenId];
  }

  function setApprovalForAll(address _to, bool _approved) public {
    require(_to != msg.sender);
    operatorApprovals[msg.sender][_to] = _approved;
    emit ApprovalForAll(msg.sender, _to, _approved);
  }

  function isApprovedForAll(address _owner, address _operator) public view returns (bool) {
    return operatorApprovals[_owner][_operator];
  }

  event T(address f, address to, uint tok, address s);

  function transferFrom(address _from, address _to, uint256 _tokenId) public {
    require(isApprovedOrOwner(msg.sender, _tokenId));
    require(_from != address(0));
    require(_to != address(0));
    clearApproval(_from, _tokenId);
    removeTokenFrom(_from, _tokenId);
    addTokenTo(_to, _tokenId);
    emit T(_from, _to, _tokenId, msg.sender);
    emit Transfer(_from, _to, _tokenId);
  }

  function safeTransferFrom(address _from, address _to, uint256 _tokenId) public {
    safeTransferFrom(_from, _to, _tokenId, "");
  }
  
  function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes _data) public {
    transferFrom(_from, _to, _tokenId);
    require(checkAndCallSafeTransfer(_from, _to, _tokenId, _data));
  }

  function isApprovedOrOwner(address _spender, uint _tokenId) internal view returns (bool) {
    address owner = ownerOf(_tokenId);
    return (
      _spender == owner ||
      getApproved(_tokenId) == _spender ||
      isApprovedForAll(owner, _spender)
    );
  }

  function clearApproval(address _owner, uint _tokenId) internal {
    require(ownerOf(_tokenId) == _owner);
    if (artworkApprovals[_tokenId] != address(0)) {
      artworkApprovals[_tokenId] = address(0);
    }
  }

  function addTokenTo(address _to, uint _tokenId) internal {
    require(artworkIndexToOwner[_tokenId] == address(0));
    artworkIndexToOwner[_tokenId] = _to;
    ownershipTokenCount[_to] = ownershipTokenCount[_to].add(1);
  }

  function removeTokenFrom(address _from, uint _tokenId) internal {
    require(ownerOf(_tokenId) == _from);
    ownershipTokenCount[_from] = ownershipTokenCount[_from].sub(1);
    artworkIndexToOwner[_tokenId] = address(0);
  }

  function checkAndCallSafeTransfer(address _from, address _to, uint _tokenId, bytes _data) internal returns (bool) {
    if (!_to.isContract()) {
      return true;
    }
    bytes4 retval = ERC721Receiver(_to).onERC721Received(
      msg.sender, _from, _tokenId, _data);
    return (retval == ERC721_RECEIVED);
  }
}