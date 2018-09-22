const ArtworkBase = artifacts.require('./ArtworkBase.sol');

module.exports = function(deployer) {
  deployer.deploy(ArtworkBase)
}