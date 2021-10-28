const path = require("path");

require('dotenv').config()

const HDWalletProvider = require('@truffle/hdwallet-provider');

Wallet_mnemonic = process.env.Wallet_mnemonic
Infura_ProjectId=process.env.InfuraProjectId
Infura_ProjectSecret=process.env.InfuraProjectSecret


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
  // networks : à commenter pour les tests
// /*
    // GANACHE LOCAL
    devlocal:
     {
        host: "127.0.0.1", // localhost de notre réseau ganache 
        port: 7545, // le port rpc de notre réseau ganache 
        network_id: "3333",// le network id de notre réseau ganache 
     }

   ,
    ropsten:
    {
       provider: () => new HDWalletProvider( Wallet_mnemonic, `https://ropsten.infura.io/v3/`+ Infura_ProjectId ),
       network_id: network_id_ropsten,       // Ropsten's id
       gas: 5500000,        // Ropsten has a lower block limit than mainnet
       confirmations: 2,    // # of confs to wait between deployments. (default: 0)
       timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
       skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
       }

} // networks

};
