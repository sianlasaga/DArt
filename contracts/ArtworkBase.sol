pragma solidity ^0.4.24;

contract ArtworkBase {
  struct ArtWork {
    bytes10 name;
    uint16 artistIndex;
    string[] photoHashes;
    // uint32 usdPrice;
  }

  // Artwork[] artwork;

  mapping (uint256 => address) artworkIndexToOwner;
  mapping (address => uint16) ownershipTokenCount;
  mapping (uint256 => address) artworkApprovals;
  mapping (address => mapping (address => bool)) internal operatorApprovals;
}