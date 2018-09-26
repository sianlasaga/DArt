const Auction = artifacts.require('./Auction.sol');
const ArtworkOwnership = artifacts.require('./ArtworkOwnership.sol');

const ETHER = 10**18

module.exports = function(deployer) {
  deployer.deploy(ArtworkOwnership)
  .then(() => ArtworkOwnership.deployed())
  .then(instance => deployer.deploy(Auction, 0, '0x0', 3600, 5 * ETHER, 10 * ETHER, 0.5 * ETHER, instance.address))
}