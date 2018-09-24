const Auction = artifacts.require('./Auction.sol');

const ETHER = 10**18

module.exports = function(deployer) {
  deployer.deploy(Auction, 3600, 0, 5 * ETHER, 10 * ETHER, 0.5 * ETHER)
}