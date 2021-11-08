import React, { Component } from "react";
/* Traduction */
import { withTranslation /*, useTranslation */ } from 'react-i18next';


/* Bootstrap */
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';

// Interface du smartcontract
import contractVotingImport from "./contracts/Voting_03.json";

/* Utils Web3 */
import { getWeb3, toChecksumAddress /*, isAddress*/ } from "./getWeb3";

/* Composants React */
import  { Web3Loader, StatusTranslated } from "./AppComponents-Status";
import  { AdminTranslated } from "./AppComponents-Admin";
import  { Toolbar } from "./AppComponents-Header";
import  { AdminToolbar } from "./AppComponents-Admin-Header";
import  { User } from "./AppComponents-User";
import  { Alerts } from "./AppComponents-Alerts";


/* Constantes */
import  * as CONSTS from "./consts";

/* Utils */
import  { truncateString } from "./AppUtils";

/* CSS spécifique pour la barre de progression */
import "./App.css";

/*
// //////////////////////////////////////////////////////////////////////////////////////////
*/
class MainApp extends Component
{
  constructor(props) {
    super(props);

    // Etats
    this.states=[
      CONSTS.STATUSES_VALUES.STATUS_00_REGISTERINGVOTERS,
      CONSTS.STATUSES_VALUES.STATUS_01_PROPOSALSREGISTRATIONSTARTED,
      CONSTS.STATUSES_VALUES.STATUS_02_PROPOSALSREGISTRATIONENDED,
      CONSTS.STATUSES_VALUES.STATUS_03_VOTINGSESSIONSTARTED,
      CONSTS.STATUSES_VALUES.STATUS_04_VOTINGSESSIONENDED,
      CONSTS.STATUSES_VALUES.STATUS_05_VOTESTALLIED
      ];

    /* Handlers */
    this.whitelistNewAddress = this.whitelistNewAddress.bind(this);
    this.registerProposal = this.registerProposal.bind(this);

    this.initEventHandlers = this.initEventHandlers.bind(this);
    this.handleError = this.handleError.bind(this);
    this.updateWorkflowStatus = this.updateWorkflowStatus.bind(this);
    this.agetAllProposals = this.agetAllProposals.bind(this);


  } // constructor
  
  /* Variables globales du composant principal */
  state = {
    web3: null,
    connectedAccountAddr: null,
    whitelistedAddresses: [],
    contractVoting: null ,
    ethereum : null,
    owner: null,
    allProposals: null,
    winningProposalId: null,
    alertsList: []
  };

  // ----------------------------
  
  render()
   {
    const { workflowStatus, whitelistedAddresses, allProposals, hasVoted, votedProposalId, winningProposalId } = this.state;
    if (!this.state.web3) {
      return (
       <Web3Loader/>
      )
    }


    return (
        /* Début : 0 conteneur de Toute l'App */
        <Container  className="vh-100 d-flex flex-column ">
        <div className="container-fluid bg-dark"> 

          {/* Début : 1.0 conteneur LIGNE de l'entête */}
          <div className="row bg-dark">
            {/* Début : 1.1 entête */}
            <div className="container-fluid bg-dark">
              {/* Début : 1.1.1 barre de progression */}
              <div className="row bg-dark">
                    <div className="container-fluid col-sm-12 col-md-12 col-lg-12">
                    <Toolbar handleReload={this.handleReload} owner={this.state.owner} connectedAccountAddr={this.state.connectedAccountAddr} hasVoted={hasVoted} />
                    <Alerts alertsList={ this.state.alertsList } />
                  </div>
              </div>
              <div className="row bg-dark">
                <br/>
              </div>
              { this.state.connectedAccountAddr === this.state.owner &&
                  <div className="row bg-dark">
                        <div className="container-fluid col-sm-12 col-md-12 col-lg-12">
                        <AdminToolbar workflowStatus={workflowStatus} goToNextState={this.goToNextState} countAndTallyVotes={this.countAndTallyVotes}/>
                        </div>
                  </div>
              }
              <div className="row bg-dark">
                <br/>
              </div>
              <div className="row bg-dark">
                    <div className="container-fluid col-sm-12 col-md-12 col-lg-12">
                    <StatusTranslated displayType={"ProgressBar"} states={this.states} workflowStatus={workflowStatus} />
                    </div>
              </div>
              {/* Fin : 1.1.1 barre de progression */}
            </div>
            {/* Fin : 1.1 entête */}
          </div>
          {/* Fin : 1.0 conteneur LIGNE de l'entête */}


          {/* Début : 2.0 conteneur LIGNE du contenu de l'App */}
          <div className="row bg-dark">

            {/* Début : 2.1 conteneur du contenu de l'App */}
            <div className="container-fluid bg-dark">

              {/* Début : 2.1.1 conteneur LIGNE de la première ligne de contenu de l'App */}
              {/*<div className="row ">*/}


                 
                {/* Début : <div className="container-fluid p-3"> */}
                <div className="container-fluid p-3">

                  {/* Début : 2.1.1.1 conteneur de la première ligne de contenu de l'App */}
                  <div className="row bg-dark border border-5 border-white text-light">
                    <div className="container ">
                    
                       { this.state.connectedAccountAddr === this.state.owner &&
                    <AdminTranslated owner={this.state.owner} whitelistedAddresses={whitelistedAddresses} handleWhitelistNewAddress={this.whitelistNewAddress} connectedAccountAddr={this.state.connectedAccountAddr} workflowStatus={workflowStatus}/>
                       }
                    </div>

                  </div>

                  {/* Début : 2.1.1.2 conteneur de la deuxième ligne de contenu de l'App */}
                  <div className="row bg-dark border border-5 border-white text-light">
                    <div className="container bg-dark">

                       <User connectedAccountAddr={this.state.connectedAccountAddr} workflowStatus={workflowStatus} whitelistedAddresses={whitelistedAddresses} hasVoted={hasVoted} votedProposalId={votedProposalId} winningProposalId={winningProposalId} onRegisterNewProposal={this.registerProposal} allProposals={allProposals} onVoteForProposal={this.voteForProposal} />

                    </div>

                  </div>

                </div>
                {/* Fin : <div className="container-fluid p-3"> */}

              {/*</div>*/}
              {/* Fin : 2.1.1 conteneur LIGNE de la première ligne de contenu de l'App */}

            </div>
            {/* Fin : 2.1 conteneur du contenu de l'App */}

          </div>
          {/* Fin : 2.0 conteneur LIGNE du contenu de l'App */}

          {/* Début : 3.0 conteneur du bas de l'App */}
          <div className="row bg-dark">
            
          </div>
          {/* Fin : 3.0 conteneur du bas de l'App */}


        </div>

        </Container>
        /* Fin : 0 conteneur de Toute l'App */
        );

  } // render()

/* ****************************
  handleAccountsChangedEvent
  ! accounts :
  pour les adresses renvoyées par l'évènement window.ethereum.on("accountsChanged" ...
  la casse est en minuscules (version sans checksum : ex. 0x627306090abab3a6e1400e9345bc60c78a8bef57 au lieu de 0x627306090abaB3A6e1400e9345bC60c78a8BEf57)
 *****************************/
handleAccountsChangedEvent = (accounts) => {
  this.refreshContractVotingData()
  this.refreshUserAccount()
};

/******************************
  get_workflowStatus

/*****************************/
get_workflowStatus = async (contractVoting) =>
 {
  let val = await contractVoting.methods._workflowStatus().call()
  const workflowStatus_current_val = parseInt( val, 10 )
  return workflowStatus_current_val
 }

 /******************************
  goToNextState
/*****************************/
  goToNextState = async () => {
    const { connectedAccountAddr, contractVoting } = this.state;
    // const { t } = this.props;

    try
     {
      // const { connectedAccountAddr, contractVoting, alertsList } = this.state;
      const workflowStatus_current_val = await this.get_workflowStatus(contractVoting)

      switch (workflowStatus_current_val) {
        case 0: // RegisteringVoters -> ProposalsRegistrationStarted
          await contractVoting.methods.setStateStartProposalsRegistration().send({from: connectedAccountAddr});
        break;

        case 1: // ProposalsRegistrationStarted -> ProposalsRegistrationEnded
          await contractVoting.methods.setStateEndProposalsRegistration().send({from: connectedAccountAddr});
        break;

        case 2: // ProposalsRegistrationEnded -> VotingSessionStarted
          await contractVoting.methods.setStateStartVotingSession().send({from: connectedAccountAddr});
        break;

        case 3: // VotingSessionStarted -> VotingSessionEnded
          await contractVoting.methods.setStateEndVotingSession().send({from: connectedAccountAddr});
        break;

        // setStateVotesTallied n'est pas appelable directement : méthode internal appelée par countAndTallyVotes
        case 4: // votingSessionEnded -> VotesTallied
        // await contractVoting.methods.setStateVotesTallied().send({from: connectedAccountAddr});
        // break;

        case 5: // VotesTallied
          default:
        break;
      }

      const workflowStatus_new = await this.get_workflowStatus(contractVoting)
      const winningProposalId = await this.getWinningProposalId(workflowStatus_new)

      this.setState({ workflowStatus: workflowStatus_new, winningProposalId });
    }
  // Catch any errors for any of the above operations.
    catch (error)
     {
      this.handleError( error, true )
     }
  }; // goToNextState

/* ****************************
  componentDidMount
 *****************************/

componentDidMount = async () => {
  try
   {
    // Get network provider and web3 instance.
    const web3 = await getWeb3();

    // const { whitelistedAddresses } = this.state;

    // Use web3 to get the user's accounts.
    const connectedAccountsAddrs = await web3.eth.getAccounts();
    // const connectedAccountAddr = toChecksumAddress(connectedAccountsAddrs[0])

    // Get the contract instance.
    const networkId = await web3.eth.net.getId();
    const contractVoting_deployedNetwork = contractVotingImport.networks[networkId];

    const contractInstanceVoting = new web3.eth.Contract(
      contractVotingImport.abi,
      contractVoting_deployedNetwork && contractVoting_deployedNetwork.address,
    );

    this.setState( { web3, /*connectedAccountAddr,*/ contractVoting: contractInstanceVoting, ethereum: window.ethereum }, this.runMainInit );

   }
  catch (error)
   {
    // Catch any errors for any of the above operations.
    alert(
      `Failed to load web3, accounts, or contract. Check console for details.`,
    );
    console.error(error);
   }
}; // componentDidMount

// -------------------------------------

  /* ****************************
  componentWillUnmount
 *****************************/
  componentWillUnmount() {
  }


/**
 * ***************************************************************
 * Evenements
 * ***************************************************************
 */

  initEventHandlers = () =>
   {

    // Mise en place du handler pour l'évènement -> changement de compte
    window.ethereum.on("accountsChanged", accounts =>
     {
      this.handleAccountsChangedEvent(accounts)
     });


  // Mise en place du handler pour les évènements du contrat
    // https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html#events-allevents

    const { contractVoting, whitelistedAddresses } = this.state;

    var contractVotingEvents = contractVoting.events.allEvents
     (
      { fromBlock: 'latest' },
      (error, result) =>
        {
          if (error)
          {
           console.error("contractVotingEvents:error:"+error)
          }
         else
          {
           console.log("contractVotingEvents:result:"+result)

          }
        }
     ); // contractInstanceVoting.events.allEvents

     
     contractVotingEvents.on('data', event =>{
        if (event.event === "VoterRegistered")
          {
            let whitelistedAddress = event.returnValues.voterAddress
            whitelistedAddresses.push( whitelistedAddress )
            this.setState({ whitelistedAddresses });
          }
        else if (event.event === "WorkflowStatusChange")
          {
            this.updateWorkflowStatus()
          }
        else if (event.event === "ProposalRegistered")
          {
            let proposalId = event.returnValues.proposalId
            // Liste des propositions
            const allProposals = this.agetAllProposals();
            // alert("contractVotingEvents.on:"+JSON.stringify(allProposals))
            // this.setState({ allProposals });
          }
          /*
          else if (event.event === "Voted")
          {
            let voter = event.returnValues.voter
            let proposalId = event.returnValues.proposalId
          }
          */
      }); // contractInstanceVotingEvents.on

  }; // initEventHandlers

 agetAllProposals = async() => {
  let allProposals = await this.getAllProposals();
   this.setState({ allProposals });
  // return proposalsObjectsArray
 }

updateWorkflowStatus = async() => {
  const { contractVoting } = this.state;
  const newWorkflowStatus = await this.get_workflowStatus(contractVoting)
  this.setState({ workflowStatus: newWorkflowStatus });
}

/* ****************************
  runMainInit
 *****************************/

runMainInit = async() => {

  try{
      await this.refreshContractVotingData()
      await this.refreshUserAccount() 

      this.initEventHandlers();
  } // try
catch (error)
 {
  // Catch any errors for any of the above operations.
  this.handleError( error, true, true )
 } // catch

} // runMainInit


/* ****************************
  refreshContractVotingData
 *****************************/
  refreshContractVotingData = async() => {

  const { contractVoting } = this.state;
  // récupérer la liste des comptes autorisés
  const whitelistedAddresses = await contractVoting.methods.getWhiteListedAddresses().call();
  // Etat du contrat
  const workflowStatus = await this.get_workflowStatus(contractVoting)
  // Gestionnaire
  const owner = await contractVoting.methods.owner().call();
  // Liste des propositions
  const allProposals = await this.getAllProposals()
  // Proposition gagnante
  const winningProposalId = await this.getWinningProposalId(workflowStatus)

  // Mise à jour de tous les states en une fois
   this.setState({ whitelistedAddresses, workflowStatus, owner, allProposals, winningProposalId });

  } // refreshContractVotingData
  
  
/* -------------------------------------------------------------
  whitelistNewAddress
   Interaction avec le smart contract pour ajouter un compte 
   ------------------------------------------------------------- */
  whitelistNewAddress = async(address) => {

    try
     {

      const { connectedAccountAddr, contractVoting } = this.state;
      await contractVoting.methods.whitelist(address).send({from: connectedAccountAddr});
      // Mettre à jour les données du contrat
      await this.refreshContractVotingData()
     } // try
    catch (error)
     {
      // Catch any errors for any of the above operations.
      this.handleError( error, true )
     } // catch
  } // whitelistNewAddress


/* -------------------------------------------------------------
          handleReload
   ------------------------------------------------------------- */
  // handleReload()
  handleReload = async() => {
      this.refreshUserAccount()
    }
      
/* -------------------------------------------------------------
      refreshUserAccount
   ------------------------------------------------------------- */
refreshUserAccount = async() => {
  try
   {
    const { web3 } = this.state
    // Use web3 to get the user's accounts.
    // Mise à jour des données de l'utilisateur connecté
    const connectedAccountsAddrs = await web3.eth.getAccounts();
    const connectedAccountAddr = toChecksumAddress(connectedAccountsAddrs[0])
    const userVote = await this.getUserVote( connectedAccountAddr )
    const hasVoted = userVote[0]
    const votedProposalId = userVote[1]

    this.setState( { connectedAccountAddr, hasVoted, votedProposalId } )
   } // try
  catch (error)
   {
    // Catch any errors for any of the above operations.
    this.handleError( error, true )
   } // catch

}; // refreshUserAccount

/* ************************************
  errorHandlers

 ************************************* */
/* -------------------------------
  Smart contract errors
 -------------------------------- */
 
handleError = (error, bLogToConsole, bshowAlertPopup) => {
  const { t } = this.props;
  const { alertsList } = this.state;
  let newAlert = {}

  let now = new Date( );
  newAlert.time= now.toLocaleDateString( t("Formats.date") ) + " " +
     new Intl.DateTimeFormat( t("Formats.date"), {hour: "numeric", minute: "numeric", second: "numeric", timeZoneName: "short"} ).format(  )

  if (bLogToConsole)
  {
    console.error(error);
  }
  if (bshowAlertPopup)
  {
    alert( t("Errors.default.title") + "\n" + error)
    return
  }

  if (error.code != undefined)
  {

   if (error.code == 4001)
    {
     newAlert.title = t("Errors.4001.title")
     newAlert.variant = t("Errors.4001.variant")
     newAlert.message = t("Errors.4001.message")
    } // 4001
   else
    {
     newAlert.title = t("Errors.default.title")
     newAlert.variant = t("Errors.default.variant")
     newAlert.message = t("Errors.default.message")
    } // default

     if (error.message != undefined)
     {
       newAlert.detail = truncateString(error.message, 50)
     } // switch (error.code)
   }
 else
 {
     newAlert.title = t("Errors.default.title")
     newAlert.variant = t("Errors.default.variant")
     newAlert.message = t("Errors.default.message")
     newAlert.detail = truncateString(error, 100)
 } // else

 const alertsListUpdated = [...alertsList, newAlert ]
 this.setState({ alertsList: alertsListUpdated })

} // handleError

/* ************************************
  Smart contract interaction methods

 ************************************* */
/* -------------------------------
  getUserVote
 -------------------------------- */
  getUserVote = async( connectedAccountAddr ) => {
    const { workflowStatus, contractVoting } = this.state;
    const res = ( workflowStatus >= CONSTS.STATUSES_VALUES.STATUS_03_VOTINGSESSIONSTARTED ? await contractVoting.methods.hasVoted(connectedAccountAddr).call() : [false, 0] )
    return res
  } // getUserVote

/* ****************************
  getAllProposals
 *****************************/
  getAllProposals = async() => {
    const { contractVoting } = this.state;
    const proposals = await contractVoting.methods.getAllProposals().call();
    let proposalsObjectsArray= [];
     
    for (let proposalId=0;proposalId<proposals.length;proposalId++)
      {
        let proposal = {};
        proposal.id = proposalId; // id
        proposal.description = proposals[proposalId][0]; // string description
        proposal.voteCount = proposals[proposalId][1]; // uint voteCount
        proposal.proposingAddr = proposals[proposalId][2]; // address proposing

        proposalsObjectsArray.push(proposal)
    } // for
    // alert(JSON.stringify(proposalsObjectsArray))
      return proposalsObjectsArray;
  } // getAllProposals


/* ****************************
  registerProposal
  *****************************/
  registerProposal = async(description) =>
  {
   try
    {
      const { connectedAccountAddr, contractVoting } = this.state;   
      // Interaction avec le smart contract pour ajouter une proposition
      await contractVoting.methods.registerProposal(description).send({from: connectedAccountAddr});
      // Recharger les propositions
      const allProposals = await this.getAllProposals()
      this.setState({ allProposals });
    } // try
  catch (error)
   {
    // Catch any errors for any of the above operations.
    this.handleError( error, true )
   } // catch
  } // registerProposal

/* ****************************
  voteForProposal
  *****************************/
  voteForProposal = async(proposalId) => {
    try
     {
      const { connectedAccountAddr, contractVoting } = this.state;
      // Interaction avec le smart contract pour voter pour une proposition
      await contractVoting.methods.vote(proposalId).send({from: connectedAccountAddr});

      const userVote = await this.getUserVote( connectedAccountAddr )
      const hasVoted = userVote[0]
      const votedProposalId = userVote[1]

      this.setState( { hasVoted, votedProposalId } )
    } // try
  catch (error)
   {
    // Catch any errors for any of the above operations.
    this.handleError( error, true )
   } // catch
  } // registerProposal

/* ****************************
  getWinningProposalId
 *****************************/
  getWinningProposalId = async(workflowStatus) => {
    const { contractVoting } = this.state;
    // Interaction avec le smart contract pour compter les votes dès les session de vote fermée et AVANT le décompte : méthode VIEW
    // permet le comptage qq. soit le nombre votes SANS transaction
    const winningProposalId = ( workflowStatus === CONSTS.STATUSES_VALUES.STATUS_04_VOTINGSESSIONENDED ? await contractVoting.methods.countVotes().call() : ( workflowStatus === CONSTS.STATUSES_VALUES.STATUS_05_VOTESTALLIED ? await contractVoting.methods.getWinningProposal().call() : -1 ) )
    return winningProposalId
  } // getWinningProposalId

  /* ****************************
  countAndTallyVotes
 *****************************/
  countAndTallyVotes = async() => {
    try
     {
      const { connectedAccountAddr, contractVoting } = this.state;
      // Interaction avec le smart contract pour décompter les votes et écrire le résultat on chain
      // permet le décomptage qq. soit le nombre votes AVEC transaction
      // Appel seulement autorisé pour le PROPRIETAIRE du contrat
      const winningProposalId = await contractVoting.methods.countAndTallyVotes().send({from: connectedAccountAddr});
      
      this.setState( { winningProposalId } )
    
      return winningProposalId
      } // try
    catch (error)
     {
      // Catch any errors for any of the above operations.
      this.handleError( error, true )
     } // catch
  } // countAndTallyVotes

// //////////////////////////////////////////////////////////////////////////////////////////

} // class MainApp extends Component


const MainAppTranslated = withTranslation()(MainApp);

export default MainAppTranslated;