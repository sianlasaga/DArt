pragma solidity ^0.4.24;

import '../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol';
import '../node_modules/zeppelin-solidity/contracts/math/SafeMath.sol';

contract ArtworkBase is Ownable {

  using SafeMath for uint;

  struct Artwork {
    string title;
    string category;
    string artist;
    string photoIpfsHash;
    string description;
    uint16 year;
    address currentOwner;
    address[] ownerHistory;
    // uint32 usdPrice;
  }

  struct Gallery {
    string name;
    string completeAddress;
    uint artworkCount;
    bool canAddArtwork;
    bool canCreateAuction;
  }

  Artwork[] public artworks;

  address private owner;

  mapping (uint => address) internal artworkIndexToOwner;
  mapping (address => uint) internal ownershipTokenCount;
  mapping (uint => address) internal artworkApprovals;
  mapping (address => mapping (address => bool)) internal operatorApprovals;
  
  mapping (address => Gallery) internal galleries;
  mapping (string => uint[]) categoryToArtIndexes;
  mapping (string => uint[]) artistToArtIndexes;

  // uint private artAvailableIndex;

  event AddGallery(address _galleryAddress, string _name, string _completeAddress);

  constructor () public {
    owner = msg.sender;
  }

  modifier canAddArtwork() {
    require(galleries[msg.sender].canAddArtwork);
    _;
  }

  modifier isArtworkExists(uint _index) {
    require(artworks.length > 0 && _index < artworks.length);
    _;
  }

  function addGallery(address _galleryAddress, string _name, string _completeAddress) public onlyOwner {
    Gallery memory gallery = Gallery({
      name: _name,
      completeAddress: _completeAddress,
      artworkCount: 0,
      canAddArtwork: true,
      canCreateAuction: true
    });
    galleries[_galleryAddress] = gallery;
  }

  function addArtwork(string _title, string _category, string _artist, string _photoIpfsHash, string _description, uint16 _year) public canAddArtwork returns (bool) {
    Artwork memory artwork = Artwork({
      title: _title,
      category: _category,
      artist: _artist,
      photoIpfsHash: _photoIpfsHash,
      description: _description,
      year: _year,
      currentOwner: msg.sender,
      ownerHistory: new address[](0)
      });
    uint index = artworks.push(artwork);
    artworkIndexToOwner[index] = msg.sender;
    ownershipTokenCount[msg.sender] = ownershipTokenCount[msg.sender].add(1);
    categoryToArtIndexes[_category].push(index);
    artistToArtIndexes[_artist].push(index);
    galleries[msg.sender].artworkCount = galleries[msg.sender].artworkCount.add(1);
    return true;
  }

  function getArtwork(uint _index) public view isArtworkExists(_index) returns (string, string, string, string, string, uint16) {
    return (
      artworks[_index].title,
      artworks[_index].category,
      artworks[_index].artist,
      artworks[_index].photoIpfsHash,
      artworks[_index].description,
      artworks[_index].year
    );
  }

  function getArtworkCount() public view returns (uint) {
    return artworks.length;
  }

  function getGalleryByAddress(address galleryAddress) public view returns (string, string, uint) {
    return (
      galleries[galleryAddress].name,
      galleries[galleryAddress].completeAddress,
      galleries[galleryAddress].artworkCount
    );
  }

  function getArtworkOwnerHistoryCount(uint _index) public view isArtworkExists(_index) returns (uint) {
    return artworks[_index].ownerHistory.length;
  }
}