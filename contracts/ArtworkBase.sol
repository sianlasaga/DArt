pragma solidity ^0.4.24;

import '../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol';
import '../node_modules/zeppelin-solidity/contracts/math/SafeMath.sol';

contract ArtworkBase is Ownable {

  using SafeMath for uint;

  struct Artwork {
    bytes10 title;
    bytes10 category;
    bytes20 artist;
    string photoIpfsHash;
    string description;
    uint16 year;
    // uint32 usdPrice;
  }

  struct Gallery {
    bytes10 name;
    bytes20 completeAddress;
    uint16 artworkCount;
    bool canAddArtwork;
  }

  Artwork[] public artworks;

  address private owner;

  mapping (uint => address) internal artworkIndexToOwner;
  mapping (address => uint) internal ownershipTokenCount;
  mapping (uint => address) internal artworkApprovals;
  mapping (address => mapping (address => bool)) internal operatorApprovals;
  
  mapping (address => Gallery) private galleries;
  mapping (bytes10 => uint[]) public categoryToArtIndexes;
  mapping (bytes20 => uint[]) public artistToArtIndexes;

  // uint private artAvailableIndex;

  event AddGallery(address _galleryAddress, bytes10 _name, bytes20 _completeAddress);

  constructor () public {
    owner = msg.sender;
  }

  modifier canAddArtwork() {
    require(galleries[msg.sender].canAddArtwork);
    _;
  }

  function addGallery(address _galleryAddress, bytes10 _name, bytes20 _completeAddress) public onlyOwner {
    Gallery memory gallery = Gallery(_name, _completeAddress, 0, true);
    galleries[_galleryAddress] = gallery;
  }

  function addArtwork(bytes10 _title, bytes10 _category, bytes20 _artist, string _photoIpfsHash, string _description, uint16 _year) public canAddArtwork returns (bool) {
    Artwork memory artwork = Artwork(_title, _category, _artist, _photoIpfsHash, _description, _year);
    uint index = artworks.push(artwork);
    artworkIndexToOwner[index] = msg.sender;
    ownershipTokenCount[msg.sender] = ownershipTokenCount[msg.sender].add(1);
    categoryToArtIndexes[_category].push(index);
    artistToArtIndexes[_artist].push(index);
  }
}