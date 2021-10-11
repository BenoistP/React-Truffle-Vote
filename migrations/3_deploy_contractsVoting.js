//var votingAdmin = artifacts.require("./Admin_WL_03.sol");
var voting = artifacts.require("./Voting_03.sol");
/*
module.exports = function(deployer) {
  deployer.deploy( votingAdmin );
};
*/
module.exports = function(deployer) {
  deployer.deploy( voting );
};
