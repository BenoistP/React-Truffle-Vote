const path = require("path");

const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs');
const mnemonic = fs.readFileSync(".secret").toString().trim();
console.error("mnemonic = " + mnemonic)
const myInfuraProjectId = "b0905077aa2945e8926ca58ac91c2a39";

const network_id_rinkeby = 4;
const network_id_ropsten = 3;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts")
  
  ,

  compilers: {
    solc: {
      version: "0.6.12"
    }
  }

  ,

  networks: {

  // GANACHE LOCAL

  devlocal:
   {
    host: "127.0.0.1", // localhost de notre réseau ganache 
    port: 7545, // le port rpc de notre réseau ganache 
    network_id: "3333",// le network id de notre réseau ganache 
   }
/*
    develop: {
      port: 8545
    }
*/
,
ropsten: {
  //     provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/YOUR-PROJECT-ID`),
       provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/`+myInfuraProjectId),
       network_id: network_id_ropsten,       // Ropsten's id
       gas: 5500000,        // Ropsten has a lower block limit than mainnet
       confirmations: 2,    // # of confs to wait between deployments. (default: 0)
       timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
       skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
       }
  } // networks

};
