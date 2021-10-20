// erc20.test.js
const { BN, ether, expectRevert, constants } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
// const { assert } = require('console');
var assert = require('chai').assert;

// https://www.chaijs.com/plugins/chai-fuzzy/
// https://www.npmjs.com/package/chai-fuzzy
// var chai = require('chai');
// chai.use(require('chai-fuzzy'));

const Voting_03 = artifacts.require('Voting_03');

// constants
const BIGNUMBER_ZERO = new BN(0);
const WorkflowStatus_00_RegisteringVoters = 0;
const WorkflowStatus_01_ProposalsRegistrationStarted = 1;
const WorkflowStatus_02_ProposalsRegistrationEnded = 2;
const WorkflowStatus_03_VotingSessionStarted = 3;
const WorkflowStatus_04_VotingSessionEnded = 4;
const WorkflowStatus_05_VotesTallied = 5;

// ==============================================================================================================
// Serie 01
// ==============================================================================================================

describe('Serie 01 : Voting Contract tests', function()
{

// --------------------------------------------------------------------------------------------------------------
// Serie 01 - 01 : Ownable
// --------------------------------------------------------------------------------------------------------------
describe('Serie 01 - 01  : Ownable tests', function()
  {

    contract('Voting_03-Ownable', function (accounts)
    {
      const account_00 = accounts[0];
      const account_01 = accounts[1];
      const account_02 = accounts[2];
      const account_00_initial_owner_contract_Voting_03 = account_00;

      before(async () =>
      {
        this.contract_Voting_03_Instance = await Voting_03.new( {from: account_00_initial_owner_contract_Voting_03} );
      });
    /*
      beforeEach(async () =>
      {
        this.ERC20Instance = await ERC20.new(_initialsupply,{from: owner});
      });
    */
      it('Voting_03-Ownable : Contract is owned by account_00', async () =>
      {
        expect(await this.contract_Voting_03_Instance.owner()).to.equal( account_00 );
      });

      it('Voting_03-Ownable : Contract is NOT owned by account 01', async () =>
      {
        expect(await this.contract_Voting_03_Instance.owner()).to.not.equal( account_01 );
      });

      it("Voting_03-Ownable : Contract can't be transferred to zero address", async () =>
      {
        await expectRevert
          (
            this.contract_Voting_03_Instance.transferOwnership( constants.ZERO_ADDRESS, {from: account_00_initial_owner_contract_Voting_03} )
            , "revert Ownable: new owner is the zero address" 
          );
        // Contract owner remains the same
        expect( await this.contract_Voting_03_Instance.owner() ).to.equal( account_00_initial_owner_contract_Voting_03 );
      });

      it('Voting_03-Ownable : Contract can only be transferred by owner', async () =>
      {
        const newOwner = account_02;
        await expectRevert
          (
            this.contract_Voting_03_Instance.transferOwnership( newOwner, {from: account_01} )
            , "revert Ownable: caller is not the owner" 
          );
        // Contract owner remains the same
        expect(await this.contract_Voting_03_Instance.owner()).to.equal(account_00);
      });

      it('Voting_03-Ownable : Contract is transferred to account_02', async () =>
      {
        const newOwner = account_02;
        await this.contract_Voting_03_Instance.transferOwnership( newOwner, {from: account_00_initial_owner_contract_Voting_03} );
        expect(await this.contract_Voting_03_Instance.owner()).to.equal( account_02 );
      });

      it('Voting_03-Ownable : Contract is NO longer owned by account_00', async () =>
      {
        expect(await this.contract_Voting_03_Instance.owner()).to.not.equal(account_00);
      });

      it('Voting_03-Ownable : Contract is NO longer owned by anyone', async () =>
      {
        await this.contract_Voting_03_Instance.renounceOwnership( {from: account_02} );
        expect( await this.contract_Voting_03_Instance.owner() ).to.equal( constants.ZERO_ADDRESS );
      });

      it("Voting_03-Ownable : Contract can't be transferred anymore", async () =>
      {
        await expectRevert
        (
          this.contract_Voting_03_Instance.transferOwnership( account_00_initial_owner_contract_Voting_03, {from: await this.contract_Voting_03_Instance.owner() } )
          , "sender account not recognized" 
        );
        expect(await this.contract_Voting_03_Instance.owner()).to.equal( constants.ZERO_ADDRESS );
      });
    }); // contract('Voting_03'

  }); // describe('Serie 01'

// --------------------------------------------------------------------------------------------------------------
// Serie 01 - 02 : Admin
// --------------------------------------------------------------------------------------------------------------

  describe('Serie 01 - 02 : Voting_03-Admin_WL tests', function()
  {
    contract('Voting_03-Admin_WL', function (accounts)
    {
      const account_00 = accounts[0];
      const account_01 = accounts[1];
      const account_02 = accounts[2];
      const account_03 = accounts[3];
      // const account_04 = accounts[4];

      const account_00_initial_owner_contract_Voting_03 = account_00;

      before(async () =>
      {
      this.contract_Voting_03_Instance = await Voting_03.new( {from: account_00_initial_owner_contract_Voting_03} );
      });
    /*
      beforeEach(async () =>
      {
        this.ERC20Instance = await ERC20.new(_initialsupply,{from: owner});
      });
    */
      it('Voting_03-Admin_WL : Contract is owned by account_00', async () =>
      {
        expect(await this.contract_Voting_03_Instance.owner()).to.equal( account_00 );
      });

      it("Voting_03-Admin_WL : account_01 can't whitelist himself", async () =>
      {
        await expectRevert
        (
          this.contract_Voting_03_Instance.whitelist( account_01, {from: account_01 } )
          , "Ownable: caller is not the owner." 
        );
        expect(await this.contract_Voting_03_Instance.isWhitelisted( account_01 )).to.be.false;
      });

      it('Voting_03-Admin_WL : Contract Voting_03 owner can whitelist account_01', async () =>
      {
        await this.contract_Voting_03_Instance.whitelist( account_01, {from: account_00_initial_owner_contract_Voting_03 } )
        expect( await this.contract_Voting_03_Instance.isWhitelisted( account_01 ) ).to.be.true;
      });

      it('Voting_03-Admin_WL : owner is not initially whitelisted', async () =>
      {
        expect(await this.contract_Voting_03_Instance.isWhitelisted( account_00_initial_owner_contract_Voting_03 )).to.be.false;
      });

      it('Voting_03-Admin_WL : account 03 is not whitelisted', async () =>
      {
        expect(await this.contract_Voting_03_Instance.isWhitelisted( account_03 )).to.be.false;
      });

      it('Voting_03-Admin_WL : owner can whitelist himself', async () =>
      {
        await this.contract_Voting_03_Instance.whitelist( account_00_initial_owner_contract_Voting_03, {from: account_00_initial_owner_contract_Voting_03 } )
        expect(await this.contract_Voting_03_Instance.isWhitelisted( account_00_initial_owner_contract_Voting_03 )).to.be.true;
      });

      it("Voting_03-Admin_WL : : whitelisted account_01 can't whitelist someone else", async () =>
      {
        await expectRevert
        (
          this.contract_Voting_03_Instance.whitelist( account_02, {from: account_01 } )
          , "Ownable: caller is not the owner." 
        );
        expect(await this.contract_Voting_03_Instance.isWhitelisted( account_02 )).to.be.false;
      });

      it("Voting_03-Admin_WL : : Anyone can list whitelisted addresses", async () =>
      {
        res = await this.contract_Voting_03_Instance.getWhiteListedAddresses(  {from: account_03 } );
        expectedRes = [ account_00_initial_owner_contract_Voting_03 , account_01 ];
        expect( res ).to.have.members( expectedRes ) ;
      });

      it("Voting_03-Admin_WL : : account 03 is not in whitelisted addresses list", async () =>
      {
        res = await this.contract_Voting_03_Instance.getWhiteListedAddresses(  {from: account_03 } );
        unexpectedRes = [ account_03 ];
        expect( await this.contract_Voting_03_Instance.getWhiteListedAddresses(  {from: account_03 } ) ).not.to.have.members( unexpectedRes ) ;
      });

    }); // contract 'Voting_03-Admin_WL'
  }); // 'Serie 01 - 02 : Voting_03-Admin_WL tests'

// --------------------------------------------------------------------------------------------------------------
// Serie 01 - 03 : Voting
// --------------------------------------------------------------------------------------------------------------
describe('Serie 01 - 03 : Voting_03-Voting_03', function()
{

  // --------------------
  // Transitions
  // --------------------
  describe('Serie 01 - 03 - 01 : Voting_03-Voting_03-Transitions : Transitions consistency', function()
  {
    
    contract('Voting_03-Voting_03-Transitions', function (accounts)
    {
      const account_00 = accounts[0];
      const account_00_initial_owner_contract_Voting_03 = account_00;

      before(async () =>
      {
      this.contract_Voting_03_Instance = await Voting_03.new( {from: account_00_initial_owner_contract_Voting_03} );
      });

      // Etat initial
      it("Voting_03-Voting_03-Transitions : 00 : Initial state should be 'registering voters'", async () =>
      {
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_00_RegisteringVoters );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });

      // Vérification de transition interdite de "Enregistrement des votants" à "Fin d'enregistrement des propositions"
      it("Voting_03-Voting_03-Transitions : 01 : Transition forbidden : Should not go to state 'EndProposalsRegistration'", async () =>
      {

        await expectRevert
        (
          this.contract_Voting_03_Instance.setStateEndProposalsRegistration( {from: account_00_initial_owner_contract_Voting_03 } )
          , "Not in 'ProposalsRegistrationStarted' state. -- Reason given: Not in 'ProposalsRegistrationStarted' state.." 
        );
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_00_RegisteringVoters );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });

      // Vérification de transition interdite de "Enregistrement des votants" à "Ouverture de la session de vote"
      it("Voting_03-Voting_03-Transitions : 02 : Transition forbidden : Should not go to state 'Ouverture de la session de vote'", async () =>
      {
        await expectRevert
        (
          this.contract_Voting_03_Instance.setStateStartVotingSession( {from: account_00_initial_owner_contract_Voting_03 } )
          , "Not in 'ProposalsRegistrationEnded' state. -- Reason given: Not in 'ProposalsRegistrationEnded' state.." 
        );
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_00_RegisteringVoters );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });

      // Vérification de transition interdite de "Enregistrement des votants" à "Fin de la session de vote"
      it("Voting_03-Voting_03-Transitions : 03 : Transition forbidden : Should not go to state 'Fin de la session de vote'", async () =>
      {
        await expectRevert
        (
          this.contract_Voting_03_Instance.setStateEndVotingSession( {from: account_00_initial_owner_contract_Voting_03 } )
          , "Not in 'VotingSessionStarted' state. -- Reason given: Not in 'VotingSessionStarted' state.." 
        );
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_00_RegisteringVoters );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });
      
      // Vérification de transition interdite de "Enregistrement des votants" à "Décompte des votes effectué"
      it("Voting_03-Voting_03-Transitions : 04 : Transition forbidden : Should not go to state 'Décompte des votes effectué'", async () =>
      {
        await expectRevert
        (
          this.contract_Voting_03_Instance.countAndTallyVotes( {from: account_00_initial_owner_contract_Voting_03 } )
          , "Not in 'VotingSessionEnded' state. -- Reason given: Not in 'VotingSessionEnded' state.." 
        );
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_00_RegisteringVoters );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });

      // ***************************************************************************************
      // Passage de "Enregistrement des votants" (0) à "Ouverture d'enregistrement des Propositions" (1)
      // ***************************************************************************************
      it("Voting_03-Voting_03-Transitions : 0-9 : Should transition to 'ProposalsRegistrationStarted'", async () =>
      {
        await this.contract_Voting_03_Instance.setStateStartProposalsRegistration( {from: account_00_initial_owner_contract_Voting_03 } )
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_01_ProposalsRegistrationStarted );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
    
      });

      // Vérification de transition interdite de "Ouverture d'enregistrement des Propositions" (1) à "Ouverture d'enregistrement des Propositions" (1)
      it("Voting_03-Voting_03-Transitions : 1-0 : Transition forbidden : Already in 'ProposalsRegistration'", async () =>
      {
        await expectRevert
        (
          this.contract_Voting_03_Instance.setStateStartProposalsRegistration( {from: account_00_initial_owner_contract_Voting_03 } )
          , "Not in 'RegisteringVoters' state. -- Reason given: Not in 'RegisteringVoters' state.." 
        );
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_01_ProposalsRegistrationStarted );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });

      // Vérification de transition interdite de "Enregistrement des Propositions" (1) à "Ouverture de la session de vote" (3)
      it("Voting_03-Voting_03-Transitions : 1-1 : Transition forbidden : Should not go to state 'Ouverture de la session de vote'", async () =>
      {
        await expectRevert
        (
          this.contract_Voting_03_Instance.setStateStartVotingSession( {from: account_00_initial_owner_contract_Voting_03 } )
          , "Not in 'ProposalsRegistrationEnded' state. -- Reason given: Not in 'ProposalsRegistrationEnded' state.." 
        );
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_01_ProposalsRegistrationStarted );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });

      // Vérification de transition interdite de "Enregistrement des Propositions" (1) à "Fin de la session de vote" (4)
      it("Voting_03-Voting_03-Transitions : 1-2 : Transition forbidden : Should not go to state 'Fin de la session de vote'", async () =>
      {
        await expectRevert
        (
          this.contract_Voting_03_Instance.setStateEndVotingSession( {from: account_00_initial_owner_contract_Voting_03 } )
          , "Not in 'VotingSessionStarted' state. -- Reason given: Not in 'VotingSessionStarted' state.." 
        );
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_01_ProposalsRegistrationStarted );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });
      
      // Vérification de transition interdite de "Enregistrement des Propositions" (1) à "Décompte des votes effectué" (5)
      it("Voting_03-Voting_03-Transitions : 1-3 : Transition forbidden : Should not go to state 'Décompte des votes effectué'", async () =>
      {
        await expectRevert
        (
          this.contract_Voting_03_Instance.countAndTallyVotes( {from: account_00_initial_owner_contract_Voting_03 } )
          , "Not in 'VotingSessionEnded' state. -- Reason given: Not in 'VotingSessionEnded' state.." 
        );
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_01_ProposalsRegistrationStarted );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });

      // ***************************************************************************************
      // Passage de "Ouverture d'enregistrement des Propositions" (1) à "Fin d'enregistrement des propositions" (2)
      // ***************************************************************************************
      it("Voting_03-Voting_03-Transitions : 1-9 : Should transition to 'ProposalsRegistration'", async () =>
      {
        await this.contract_Voting_03_Instance.setStateEndProposalsRegistration( {from: account_00_initial_owner_contract_Voting_03 } )
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_02_ProposalsRegistrationEnded );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });

      // Vérification de transition interdite de "Fin d'enregistrement des propositions" (2) à "Ouverture d'enregistrement des Propositions" (1)
      it("Voting_03-Voting_03-Transitions : 2-1 : Transition forbidden : Already in 'ProposalsRegistration'", async () =>
      {
        await expectRevert
        (
          this.contract_Voting_03_Instance.setStateStartProposalsRegistration( {from: account_00_initial_owner_contract_Voting_03 } )
          , "Not in 'RegisteringVoters' state. -- Reason given: Not in 'RegisteringVoters' state.." 
        );
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_02_ProposalsRegistrationEnded );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });

      // Vérification de transition interdite de "Fin d'enregistrement des propositions" (2) à "Fin d'enregistrement des propositions" (2)
      it("Voting_03-Voting_03-Transitions : 2-2 : Transition forbidden : Should not go to state 'ProposalsRegistrationEnded'", async () =>
      {
        await expectRevert
        (
          this.contract_Voting_03_Instance.setStateEndVotingSession( {from: account_00_initial_owner_contract_Voting_03 } )
          , "Not in 'VotingSessionStarted' state. -- Reason given: Not in 'VotingSessionStarted' state.." 
        );
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_02_ProposalsRegistrationEnded );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });

      // Vérification de transition interdite de "Fin d'enregistrement des propositions" (2) à "Fin de la session de vote" (4)
      it("Voting_03-Voting_03-Transitions : 2-3 : Transition forbidden : Should not go to state 'End voting session'", async () =>
      {
        await expectRevert
        (
          this.contract_Voting_03_Instance.setStateEndVotingSession( {from: account_00_initial_owner_contract_Voting_03 } )
          , "Not in 'VotingSessionStarted' state. -- Reason given: Not in 'VotingSessionStarted' state.." 
        );
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_02_ProposalsRegistrationEnded );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });
      
      // Vérification de transition interdite de "Fin d'enregistrement des propositions" (2) à "Décompte des votes effectué" (5)
      it("Voting_03-Voting_03-Transitions : 2-4 : Transition forbidden : Should not go to state 'Votes tallied'", async () =>
      {
        await expectRevert
        (
          this.contract_Voting_03_Instance.countAndTallyVotes( {from: account_00_initial_owner_contract_Voting_03 } )
          , "Not in 'VotingSessionEnded' state. -- Reason given: Not in 'VotingSessionEnded' state.." 
        );
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_02_ProposalsRegistrationEnded );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });

      // ***************************************************************************************
      // Passage de "Fin d'enregistrement des propositions" (2) à "Ouverture des votes" (3)
      // ***************************************************************************************
      it("Voting_03-Voting_03-Transitions : 2-9 : Should transition to 'StartVotingSession'", async () =>
      {
        await this.contract_Voting_03_Instance.setStateStartVotingSession( {from: account_00_initial_owner_contract_Voting_03 } )
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_03_VotingSessionStarted );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });

      // Vérification de transition interdite de "Vote en cours" (3) à "Ouverture d'enregistrement des Propositions" (1)
      it("Voting_03-Voting_03-Transitions : 3-1 : Transition forbidden : Already in 'ProposalsRegistration'", async () =>
      {
        await expectRevert
        (
          this.contract_Voting_03_Instance.setStateStartProposalsRegistration( {from: account_00_initial_owner_contract_Voting_03 } )
          , "Not in 'RegisteringVoters' state. -- Reason given: Not in 'RegisteringVoters' state.." 
        );
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_03_VotingSessionStarted );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });

      // Vérification de transition interdite de "Vote en cours" (3) à "Fin d'enregistrement des propositions" (2)
      it("Voting_03-Voting_03-Transitions : 3-2 : Transition forbidden : Should not go to state 'ProposalsRegistrationEnded'", async () =>
      {
        await expectRevert
        (
          this.contract_Voting_03_Instance.setStateEndProposalsRegistration( {from: account_00_initial_owner_contract_Voting_03 } )
          , "Not in 'ProposalsRegistrationStarted' state. -- Reason given: Not in 'ProposalsRegistrationStarted' state.." 
        );
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_03_VotingSessionStarted );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });

      // Vérification de transition interdite de "Vote en cours" (3) à "Vote en cours" (3)
      it("Voting_03-Voting_03-Transitions : 3-3 : Transition forbidden : Should not go to state 'StartVotingSession'", async () =>
      {
        await expectRevert
        (
          this.contract_Voting_03_Instance.setStateStartVotingSession( {from: account_00_initial_owner_contract_Voting_03 } )
          , "Not in 'ProposalsRegistrationEnded' state. -- Reason given: Not in 'ProposalsRegistrationEnded' state.." 
        );
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_03_VotingSessionStarted );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });
      
      // Vérification de transition interdite de "Vote en cours" (3) à "Décompte des votes effectué" (5)
      it("Voting_03-Voting_03-Transitions : 3-4 : Transition forbidden : Should not go to state 'Décompte des votes effectué'", async () =>
      {
        await expectRevert
        (
          this.contract_Voting_03_Instance.countAndTallyVotes( {from: account_00_initial_owner_contract_Voting_03 } )
          , "Not in 'VotingSessionEnded' state. -- Reason given: Not in 'VotingSessionEnded' state.." 
        );
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_03_VotingSessionStarted );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });

      // ***************************************************************************************
      // Passage de "Session de vote en cours" (3) à "Fermeture des votes" (4)
      // ***************************************************************************************
      it("Voting_03-Voting_03-Transitions : 3-9 : Should transition to 'EndVotingSession'", async () =>
      {
        await this.contract_Voting_03_Instance.setStateEndVotingSession( {from: account_00_initial_owner_contract_Voting_03 } )
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_04_VotingSessionEnded );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });

      // Vérification de transition interdite de "Vote terminé" (4) à "Ouverture d'enregistrement des Propositions" (1)
      it("Voting_03-Voting_03-Transitions : 4-1 : Transition forbidden : Already in 'ProposalsRegistration'", async () =>
      {
        await expectRevert
        (
          this.contract_Voting_03_Instance.setStateStartProposalsRegistration( {from: account_00_initial_owner_contract_Voting_03 } )
          , "Not in 'RegisteringVoters' state. -- Reason given: Not in 'RegisteringVoters' state.." 
        );
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_04_VotingSessionEnded );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });

      // Vérification de transition interdite de "Vote terminé" (4) à "Fin d'enregistrement des propositions" (2)
      it("Voting_03-Voting_03-Transitions : 4-2 : Transition forbidden : Should not go to state 'ProposalsRegistrationEnded'", async () =>
      {
        await expectRevert
        (
          this.contract_Voting_03_Instance.setStateEndProposalsRegistration( {from: account_00_initial_owner_contract_Voting_03 } )
          , "Not in 'ProposalsRegistrationStarted' state. -- Reason given: Not in 'ProposalsRegistrationStarted' state.." 
        );
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_04_VotingSessionEnded );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });

      // Vérification de transition interdite de "Vote terminé" (4) à "Vote en cours" (3)
      it("Voting_03-Voting_03-Transitions : 4-3 : Transition forbidden : Should not go to state 'StartVotingSession'", async () =>
      {
        await expectRevert
        (
          this.contract_Voting_03_Instance.setStateStartVotingSession( {from: account_00_initial_owner_contract_Voting_03 } )
          , "Not in 'ProposalsRegistrationEnded' state. -- Reason given: Not in 'ProposalsRegistrationEnded' state.." 
        );
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_04_VotingSessionEnded );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });
      
      // Vérification de transition interdite de "Vote terminé" (4) à "Vote terminé" (4)
      it("Voting_03-Voting_03-Transitions : 4-4 : Transition forbidden : Should not go to state 'VotingSessionEnded'", async () =>
      {
        await expectRevert
        (
          this.contract_Voting_03_Instance.setStateEndVotingSession( {from: account_00_initial_owner_contract_Voting_03 } )
          , "Not in 'VotingSessionStarted' state. -- Reason given: Not in 'VotingSessionStarted' state.." 
        );
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_04_VotingSessionEnded );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });

      // ***************************************************************************************
      // Passage de "Fermeture des votes" (4) à "Décomptage des votes effectué" (5)
      // ***************************************************************************************
      it("Voting_03-Voting_03-Transitions : 4-9 : Should transition to 'VotesTallied'", async () =>
      {
        await this.contract_Voting_03_Instance.countAndTallyVotes( {from: account_00_initial_owner_contract_Voting_03 } )
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_05_VotesTallied );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });

      // Vérification de transition interdite de "Décomptage des votes effectué" (5) à "Ouverture d'enregistrement des Propositions" (1)
      it("Voting_03-Voting_03-Transitions : 5-1 : Transition forbidden : Already in 'ProposalsRegistration'", async () =>
      {
        await expectRevert
        (
          this.contract_Voting_03_Instance.setStateStartProposalsRegistration( {from: account_00_initial_owner_contract_Voting_03 } )
          , "Not in 'RegisteringVoters' state. -- Reason given: Not in 'RegisteringVoters' state.." 
        );
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_05_VotesTallied );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });

      // Vérification de transition interdite de "Décomptage des votes effectué" (5) à "Fin d'enregistrement des propositions" (2)
      it("Voting_03-Voting_03-Transitions : 5-2 : Transition forbidden : Should not go to state 'ProposalsRegistrationEnded'", async () =>
      {
        await expectRevert
        (
          this.contract_Voting_03_Instance.setStateEndProposalsRegistration( {from: account_00_initial_owner_contract_Voting_03 } )
          , "Not in 'ProposalsRegistrationStarted' state. -- Reason given: Not in 'ProposalsRegistrationStarted' state.." 
        );
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_05_VotesTallied );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });

      // Vérification de transition interdite de "Décomptage des votes effectué" (5) à "Vote en cours" (3)
      it("Voting_03-Voting_03-Transitions : 5-3 : Transition forbidden : Should not go to state 'StartVotingSession'", async () =>
      {
        await expectRevert
        (
          this.contract_Voting_03_Instance.setStateStartVotingSession( {from: account_00_initial_owner_contract_Voting_03 } )
          , "Not in 'ProposalsRegistrationEnded' state. -- Reason given: Not in 'ProposalsRegistrationEnded' state.." 
        );
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_05_VotesTallied );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });
      
      // Vérification de transition interdite de "Décomptage des votes effectué" (5) à "Fin des votes" (4)
      it("Voting_03-Voting_03-Transitions : 5-4 : Transition forbidden : Should not go to state 'VotingSessionEnded'", async () =>
      {
        await expectRevert
        (
          this.contract_Voting_03_Instance.setStateEndVotingSession( {from: account_00_initial_owner_contract_Voting_03 } )
          , "Not in 'VotingSessionStarted' state. -- Reason given: Not in 'VotingSessionStarted' state.." 
        );
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_05_VotesTallied );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });

      // Vérification de transition interdite de "Décomptage des votes effectué" (5) à Décomptage des votes effectué" (5)
      it("Voting_03-Voting_03-Transitions : 5-4 : Transition forbidden : Should not go to state 'VotingSessionEnded'", async () =>
      {
        await expectRevert
        (
          this.contract_Voting_03_Instance.countAndTallyVotes( {from: account_00_initial_owner_contract_Voting_03 } )
          , "Not in 'VotingSessionEnded' state. -- Reason given: Not in 'VotingSessionEnded' state.." 
        );
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_05_VotesTallied );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });

    }); // Contract 'Voting_03-Voting_03-Transitions'

    // WorkflowStatus_VotesTallied
      // countVotes

  }); // Serie 01 - 03 - 01 : Voting_03-Voting_03-Transitions : Transitions

  // --------------------
  // Test des transitions
  // --------------------

  describe('Serie 01 - 03 - 02 : Voting_03-Voting_03-Transitions-CheckAdminOnly-NotWhitelisted : Transitions can only be done by Admin - checks not whitelisted accounts', function()
  {
    contract('Voting_03 Voting_03-Transitions-CheckAdminOnly-NotWhitelisted', function (accounts)
    {
       const account_00 = accounts[0];
       const account_01 = accounts[1];
       const account_02 = accounts[2];
       const account_03 = accounts[3];
       const account_04 = accounts[4];
       const account_05 = accounts[5];
       const account_00_initial_owner_contract_Voting_03 = account_00;

       before(async () =>
       {
       this.contract_Voting_03_Instance = await Voting_03.new( {from: account_00_initial_owner_contract_Voting_03} );
       });
     /*
       beforeEach(async () =>
       {
         this.ERC20Instance = await ERC20.new(_initialsupply,{from: owner});
       });
     */

      // Etat initial
      it("Voting_03-Voting_03-Transitions-CheckAdminOnly-NotWhitelisted : 0 : Initial state should be 'registering voters'", async () =>
      {
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_00_RegisteringVoters );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });

      // ***************************************************************************************
      // Passage de "Enregistrement des votants" (0) à "Ouverture d'enregistrement des Propositions" (1)
      // ***************************************************************************************
      it("Voting_03-Voting_03-Transitions-CheckAdminOnly-NotWhitelisted : 0-0 : Transition forbidden : Should not go to state 'StartProposalsRegistration'", async () =>
      {
        await expectRevert
        (
          this.contract_Voting_03_Instance.setStateStartProposalsRegistration( {from: account_01 } )
          , "revert Ownable: caller is not the owner" 
        );
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_00_RegisteringVoters );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });

      it("Voting_03-Voting_03-Transitions-CheckAdminOnly-NotWhitelisted : 0-1 : Should transition to 'ProposalsRegistrationStarted'", async () =>
      {
        await this.contract_Voting_03_Instance.setStateStartProposalsRegistration( {from: account_00_initial_owner_contract_Voting_03 } )
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_01_ProposalsRegistrationStarted );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
    
      });
      // ***************************************************************************************
      // Passage de "Ouverture d'enregistrement des Propositions" (1) à "Fin d'enregistrement des propositions" (2)
      // ***************************************************************************************
      it("Voting_03-Voting_03-Transitions-CheckAdminOnly-NotWhitelisted : 1-1 : Transition forbidden : Should not go to state 'ProposalsRegistration'", async () =>
      {
        await expectRevert
        (
          this.contract_Voting_03_Instance.setStateEndProposalsRegistration( {from: account_02 } )
          , "revert Ownable: caller is not the owner" 
        );
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_01_ProposalsRegistrationStarted );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });

      it("Voting_03-Voting_03-Transitions-CheckAdminOnly-NotWhitelisted : 1-2 : Should transition to 'ProposalsRegistration'", async () =>
      {
        await this.contract_Voting_03_Instance.setStateEndProposalsRegistration( {from: account_00_initial_owner_contract_Voting_03 } )
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_02_ProposalsRegistrationEnded );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });

      // ***************************************************************************************
      // Passage de "Fin d'enregistrement des propositions" (2) à "Ouverture des votes" (3)
      // ***************************************************************************************
      it("Voting_03-Voting_03-Transitions-CheckAdminOnly-NotWhitelisted : 2-2 : Transition forbidden : Should not go to state 'ProposalsRegistration'", async () =>
      {
        await expectRevert
        (
          this.contract_Voting_03_Instance.setStateStartVotingSession( {from: account_03 } )
          , "revert Ownable: caller is not the owner" 
        );
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_02_ProposalsRegistrationEnded );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });

      it("Voting_03-Voting_03-Transitions-CheckAdminOnly-NotWhitelisted : 2-3 : Should transition to 'StartVotingSession'", async () =>
      {
        await this.contract_Voting_03_Instance.setStateStartVotingSession( {from: account_00_initial_owner_contract_Voting_03 } )
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_03_VotingSessionStarted );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });

      // ***************************************************************************************
      // Passage de "Session de vote en cours" (3) à "Fermeture des votes" (4)
      // ***************************************************************************************
      it("Voting_03-Voting_03-Transitions-CheckAdminOnly-NotWhitelisted : 3-3 : Transition forbidden : Should not go to state 'ProposalsRegistration'", async () =>
      {
        await expectRevert
        (
          this.contract_Voting_03_Instance.setStateEndVotingSession( {from: account_04 } )
          , "revert Ownable: caller is not the owner" 
        );
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_03_VotingSessionStarted );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });

      it("Voting_03-Voting_03-Transitions-CheckAdminOnly-NotWhitelisted : 3-4 : Should transition to 'EndVotingSession'", async () =>
      {
        await this.contract_Voting_03_Instance.setStateEndVotingSession( {from: account_00_initial_owner_contract_Voting_03 } )
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_04_VotingSessionEnded );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });

      // ***************************************************************************************
      // Passage de "Fermeture des votes" (4) à "Décomptage des votes effectué" (5)
      // ***************************************************************************************
      it("Voting_03-Voting_03-Transitions-CheckAdminOnly-NotWhitelisted : 4-4 : Transition forbidden : Should not go to state 'ProposalsRegistration'", async () =>
      {
        await expectRevert
        (
          this.contract_Voting_03_Instance.countAndTallyVotes( {from: account_05 } )
          , "revert Ownable: caller is not the owner" 
        );
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_04_VotingSessionEnded );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });

      it("Voting_03-Voting_03-Transitions-CheckAdminOnly-NotWhitelisted : 4-5 : Should transition to 'VotesTallied'", async () =>
      {
        await this.contract_Voting_03_Instance.countAndTallyVotes( {from: account_00_initial_owner_contract_Voting_03 } )
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_05_VotesTallied );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });
   
     }); // contract Voting_03'

  }); // Serie 01 - 03 - 02 : Voting_03-Voting_03-Transitions-CheckAdminOnly-NotWhitelisted : Transitions Admin checks




describe('Serie 01 - 03 - 03 : Voting_03-Voting_03-Transitions-CheckAdminOnly-Whitelisted : Transitions can only be done by Admin - checks whitelisted accounts', function()
{
  contract('Voting_03 Voting_03-Transitions-CheckAdminOnly-Whitelisted', function (accounts)
  {
     const account_00 = accounts[0];
     const account_01 = accounts[1];
     const account_02 = accounts[2];
     const account_03 = accounts[3];
     const account_04 = accounts[4];
     const account_05 = accounts[5];
     const account_00_initial_owner_contract_Voting_03 = account_00;

     before(async () =>
     {
     this.contract_Voting_03_Instance = await Voting_03.new( {from: account_00_initial_owner_contract_Voting_03} );

     // Whitelist accounts
       await this.contract_Voting_03_Instance.whitelist( account_01, {from: account_00_initial_owner_contract_Voting_03} );
       await this.contract_Voting_03_Instance.whitelist( account_02, {from: account_00_initial_owner_contract_Voting_03} );
       await this.contract_Voting_03_Instance.whitelist( account_03, {from: account_00_initial_owner_contract_Voting_03} );
       await this.contract_Voting_03_Instance.whitelist( account_04, {from: account_00_initial_owner_contract_Voting_03} );
       await this.contract_Voting_03_Instance.whitelist( account_05, {from: account_00_initial_owner_contract_Voting_03} );
     }); // before


   /*
     beforeEach(async () =>
     {
       this.ERC20Instance = await ERC20.new(_initialsupply,{from: owner});
     });
   */

    // Etat initial
    it("Voting_03-Voting_03-Transitions-CheckAdminOnly-Whitelisted : 0 : Initial state should be 'registering voters'", async () =>
    {
      currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
      expectedStatus = new BN( WorkflowStatus_00_RegisteringVoters );
      expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
    });

    it("Voting_03-Voting_03-Transitions-CheckAdminOnly-Whitelisted : 00 : Accounts addresses 01-05 should be whitelisted", async () =>
    {
      res = await this.contract_Voting_03_Instance.getWhiteListedAddresses(  {from: account_05 } );
      expectedRes = [ account_01, account_02, account_03, account_04, account_05 ];
      // console.log(res);
      // console.log(expectedRes);
      expect( res ).to.have.members( expectedRes ) ;
    });


    // ***************************************************************************************
    // Passage de "Enregistrement des votants" (0) à "Ouverture d'enregistrement des Propositions" (1)
    // ***************************************************************************************
    it("Voting_03-Voting_03-Transitions-CheckAdminOnly-Whitelisted : 0-0 : Transition forbidden : Should not go to state 'StartProposalsRegistration'", async () =>
    {
      await expectRevert
      (
        this.contract_Voting_03_Instance.setStateStartProposalsRegistration( {from: account_01 } )
        , "revert Ownable: caller is not the owner" 
      );
      currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
      expectedStatus = new BN( WorkflowStatus_00_RegisteringVoters );
      expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
    });

    it("Voting_03-Voting_03-Transitions-CheckAdminOnly-Whitelisted : 0-1 : Should transition to 'ProposalsRegistrationStarted'", async () =>
    {
      await this.contract_Voting_03_Instance.setStateStartProposalsRegistration( {from: account_00_initial_owner_contract_Voting_03 } )
      currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
      expectedStatus = new BN( WorkflowStatus_01_ProposalsRegistrationStarted );
      expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
  
    });
    // ***************************************************************************************
    // Passage de "Ouverture d'enregistrement des Propositions" (1) à "Fin d'enregistrement des propositions" (2)
    // ***************************************************************************************
    it("Voting_03-Voting_03-Transitions-CheckAdminOnly-Whitelisted : 1-1 : Transition forbidden : Should not go to state 'ProposalsRegistration'", async () =>
    {
      await expectRevert
      (
        this.contract_Voting_03_Instance.setStateEndProposalsRegistration( {from: account_02 } )
        , "revert Ownable: caller is not the owner" 
      );
      currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
      expectedStatus = new BN( WorkflowStatus_01_ProposalsRegistrationStarted );
      expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
    });

    it("Voting_03-Voting_03-Transitions-CheckAdminOnly-Whitelisted : 1-2 : Should transition to 'ProposalsRegistration'", async () =>
    {
      await this.contract_Voting_03_Instance.setStateEndProposalsRegistration( {from: account_00_initial_owner_contract_Voting_03 } )
      currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
      expectedStatus = new BN( WorkflowStatus_02_ProposalsRegistrationEnded );
      expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
    });

    // ***************************************************************************************
    // Passage de "Fin d'enregistrement des propositions" (2) à "Ouverture des votes" (3)
    // ***************************************************************************************
    it("Voting_03-Voting_03-Transitions-CheckAdminOnly-Whitelisted : 2-2 : Transition forbidden : Should not go to state 'ProposalsRegistration'", async () =>
    {
      await expectRevert
      (
        this.contract_Voting_03_Instance.setStateStartVotingSession( {from: account_03 } )
        , "revert Ownable: caller is not the owner" 
      );
      currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
      expectedStatus = new BN( WorkflowStatus_02_ProposalsRegistrationEnded );
      expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
    });

    it("Voting_03-Voting_03-Transitions-CheckAdminOnly-Whitelisted : 2-3 : Should transition to 'StartVotingSession'", async () =>
    {
      await this.contract_Voting_03_Instance.setStateStartVotingSession( {from: account_00_initial_owner_contract_Voting_03 } )
      currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
      expectedStatus = new BN( WorkflowStatus_03_VotingSessionStarted );
      expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
    });

    // ***************************************************************************************
    // Passage de "Session de vote en cours" (3) à "Fermeture des votes" (4)
    // ***************************************************************************************
    it("Voting_03-Voting_03-Transitions-CheckAdminOnly-Whitelisted : 3-3 : Transition forbidden : Should not go to state 'ProposalsRegistration'", async () =>
    {
      await expectRevert
      (
        this.contract_Voting_03_Instance.setStateEndVotingSession( {from: account_04 } )
        , "revert Ownable: caller is not the owner" 
      );
      currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
      expectedStatus = new BN( WorkflowStatus_03_VotingSessionStarted );
      expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
    });

    it("Voting_03-Voting_03-Transitions-CheckAdminOnly-Whitelisted : 3-4 : Should transition to 'EndVotingSession'", async () =>
    {
      await this.contract_Voting_03_Instance.setStateEndVotingSession( {from: account_00_initial_owner_contract_Voting_03 } )
      currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
      expectedStatus = new BN( WorkflowStatus_04_VotingSessionEnded );
      expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
    });

    // ***************************************************************************************
    // Passage de "Fermeture des votes" (4) à "Décomptage des votes effectué" (5)
    // ***************************************************************************************
    it("Voting_03-Voting_03-Transitions-CheckAdminOnly-Whitelisted : 4-4 : Transition forbidden : Should not go to state 'ProposalsRegistration'", async () =>
    {
      await expectRevert
      (
        this.contract_Voting_03_Instance.countAndTallyVotes( {from: account_05 } )
        , "revert Ownable: caller is not the owner" 
      );
      currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
      expectedStatus = new BN( WorkflowStatus_04_VotingSessionEnded );
      expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
    });

    it("Voting_03-Voting_03-Transitions-CheckAdminOnly-Whitelisted : 4-5 : Should transition to 'VotesTallied'", async () =>
    {
      await this.contract_Voting_03_Instance.countAndTallyVotes( {from: account_00_initial_owner_contract_Voting_03 } )
      currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
      expectedStatus = new BN( WorkflowStatus_05_VotesTallied );
      expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
    });
 
   }); // contract Voting_03'

}); // Serie 01 - 03 - 03 : Voting_03-Voting_03-Transitions-CheckAdminOnly-Whitelisted : Transitions can only be done by Admin - checks whitelisted accounts


// ---------------------------------------------------------------------------


// Tester registerProposal fonctionne uniquement pour whitelisted
// Tester vote fonctionne uniquement pour whitelisted


  // --------------------
  // Fonctionnement
  // --------------------
  describe('Serie 01 - 03 - 04 : Voting_03-Voting_03-Fonctionnement : Fonctionnement', function()
  {
    contract('Voting_03-Voting_03-Fonctionnement', function (accounts)
    {
       const account_00 = accounts[0];
       const account_01 = accounts[1];
       const account_02 = accounts[2];
       const account_03 = accounts[3];
       const account_04 = accounts[4];
       const account_05 = accounts[5];
       const account_00_initial_owner_contract_Voting_03 = account_00;

       const account_01_proposal_01_description = "account_01's first proposal"
       const account_02_proposal_02_description = "account_02 proposal"
       const account_03_proposal_03_description = "account_03 proposal"
       const account_04_proposal_04_description = "account_04 proposal"
       const account_01_proposal_05_description = "account_01's second proposal"

       const proposalsDescriptions = [account_01_proposal_01_description, account_02_proposal_02_description, account_03_proposal_03_description, account_04_proposal_04_description, account_01_proposal_05_description]
       const proposalsAccounts = [ account_01, account_02, account_03, account_04, account_01 ]

       before(async () =>
       {
        this.contract_Voting_03_Instance = await Voting_03.new( {from: account_00_initial_owner_contract_Voting_03} );
       });
     /*
       beforeEach(async () =>
       {
         this.ERC20Instance = await ERC20.new(_initialsupply,{from: owner});
       });
     */
       it('Voting_03-Voting_03-Fonctionnement : 0.0 : Contract is owned by account_00', async () =>
       {
         expect( await this.contract_Voting_03_Instance.owner() ).to.equal( account_00 );
       });


       it("Voting_03-Voting_03-Fonctionnement : 0.1 : Whitelist account 01", async () =>
       {
         await this.contract_Voting_03_Instance.whitelist( account_01, {from: account_00_initial_owner_contract_Voting_03} );
         expect( await this.contract_Voting_03_Instance.isWhitelisted( account_01 ) ).to.be.true;
       });
       
       it("Voting_03-Voting_03-Fonctionnement : 0.2 : Whitelist account 02", async () =>
       {
         await this.contract_Voting_03_Instance.whitelist( account_02, {from: account_00_initial_owner_contract_Voting_03} );
         expect( await this.contract_Voting_03_Instance.isWhitelisted( account_02 ) ).to.be.true;
       });

       it("Voting_03-Voting_03-Fonctionnement : 0.3 : Whitelist account 03", async () =>
       {
         await this.contract_Voting_03_Instance.whitelist( account_03, {from: account_00_initial_owner_contract_Voting_03} );
         expect( await this.contract_Voting_03_Instance.isWhitelisted( account_03 ) ).to.be.true;
       });

       it("Voting_03-Voting_03-Fonctionnement : 0.4 : Whitelist account 04", async () =>
       {
         await this.contract_Voting_03_Instance.whitelist( account_04, {from: account_00_initial_owner_contract_Voting_03} );
         expect( await this.contract_Voting_03_Instance.isWhitelisted( account_04 ) ).to.be.true;
       });

       it("Voting_03-Voting_03-Fonctionnement : 0.5 : Accounts addresses 01-04 should be whitelisted", async () =>
       {
         res = await this.contract_Voting_03_Instance.getWhiteListedAddresses(  {from: account_05 } );
         expectedRes = [ account_01, account_02, account_03, account_04 ];
         // console.log(res);
         // console.log(expectedRes);
         expect( res ).to.have.members( expectedRes ) ;
       });

       // Passage à 'Enregistrement des propositions'
       it("Voting_03-Voting_03-Fonctionnement : 0-1 : Should transition to 'ProposalsRegistration'", async () =>
       {
         await this.contract_Voting_03_Instance.setStateStartProposalsRegistration( {from: account_00_initial_owner_contract_Voting_03 } )
         currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
         expectedStatus = new BN( WorkflowStatus_01_ProposalsRegistrationStarted );
         expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
       });

       // Propositions

       it("Voting_03-Voting_03-Fonctionnement : 1.1 : Register account_01 first proposal", async () =>
       {
         await this.contract_Voting_03_Instance.registerProposal( account_01_proposal_01_description, {from: account_01 } )

         proposals = await this.contract_Voting_03_Instance.getAllProposals();
         let proposalIdx=0
         let proposal_description = proposals[proposalIdx][0]
         let proposal_votesCount = proposals[proposalIdx][1]
         let proposal_proposingAddress = proposals[proposalIdx][2]

        expect(proposal_description).to.be.equal(account_01_proposal_01_description)
        expect( parseInt(proposal_votesCount,10) ).to.be.equal(0)
        expect(proposal_proposingAddress).to.be.equal(account_01)
       });
       
       it("Voting_03-Voting_03-Fonctionnement : 1.2 : Register account_02 proposal", async () =>
       {
         await this.contract_Voting_03_Instance.registerProposal( account_02_proposal_02_description, {from: account_02 } )

         proposals = await this.contract_Voting_03_Instance.getAllProposals();
         let proposalIdx=1
         let proposal_description = proposals[proposalIdx][0]
         let proposal_votesCount = proposals[proposalIdx][1]
         let proposal_proposingAddress = proposals[proposalIdx][2]

        expect(proposal_description).to.be.equal(account_02_proposal_02_description)
        expect( parseInt(proposal_votesCount,10) ).to.be.equal(0)
        expect(proposal_proposingAddress).to.be.equal(account_02)
       });
       
       it("Voting_03-Voting_03-Fonctionnement : 1.3 : Register account_03 proposal", async () =>
       {
         await this.contract_Voting_03_Instance.registerProposal( account_03_proposal_03_description, {from: account_03 } )

         proposals = await this.contract_Voting_03_Instance.getAllProposals();
         let proposalIdx=2
         let proposal_description = proposals[proposalIdx][0]
         let proposal_votesCount = proposals[proposalIdx][1]
         let proposal_proposingAddress = proposals[proposalIdx][2]

        expect(proposal_description).to.be.equal(account_03_proposal_03_description)
        expect( parseInt(proposal_votesCount,10) ).to.be.equal(0)
        expect(proposal_proposingAddress).to.be.equal(account_03)
       });

       it("Voting_03-Voting_03-Fonctionnement : 1.4 : Register account_04 proposal", async () =>
       {
         await this.contract_Voting_03_Instance.registerProposal( account_04_proposal_04_description, {from: account_04 } )

         proposals = await this.contract_Voting_03_Instance.getAllProposals();
         let proposalIdx=3
         let proposal_description = proposals[proposalIdx][0]
         let proposal_votesCount = proposals[proposalIdx][1]
         let proposal_proposingAddress = proposals[proposalIdx][2]

        expect(proposal_description).to.be.equal(account_04_proposal_04_description)
        expect( parseInt(proposal_votesCount,10) ).to.be.equal(0)
        expect(proposal_proposingAddress).to.be.equal(account_04)
       });

       it("Voting_03-Voting_03-Fonctionnement : 1.1 : Register account_01 second proposal", async () =>
       {
         await this.contract_Voting_03_Instance.registerProposal( account_01_proposal_05_description, {from: account_01 } )

         proposals = await this.contract_Voting_03_Instance.getAllProposals();
         let proposalIdx=4
         let proposal_description = proposals[proposalIdx][0]
         let proposal_votesCount = proposals[proposalIdx][1]
         let proposal_proposingAddress = proposals[proposalIdx][2]

        expect(proposal_description).to.be.equal(account_01_proposal_05_description)
        expect( parseInt(proposal_votesCount,10) ).to.be.equal(0)
        expect(proposal_proposingAddress).to.be.equal(account_01)
       });
       










    // ***************************************************************************************
    // Passage de "Ouverture d'enregistrement des Propositions" (1) à "Fin d'enregistrement des propositions" (2)
    // ***************************************************************************************
    it("Voting_03-Voting_03-Transitions-CheckAdminOnly-Whitelisted : 1-2 : Should transition to 'ProposalsRegistration'", async () =>
    {
      await this.contract_Voting_03_Instance.setStateEndProposalsRegistration( {from: account_00_initial_owner_contract_Voting_03 } )
      currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
      expectedStatus = new BN( WorkflowStatus_02_ProposalsRegistrationEnded );
      expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
    });



    it("Voting_03-Voting_03-Fonctionnement : 2.0 : Check proposals", async () =>
    {
      proposals = await this.contract_Voting_03_Instance.getAllProposals();

      proposals.forEach( (proposal,idx) => {
        let proposal_description = proposal[0]
        let proposal_votesCount = proposal[1]
        let proposal_proposingAddress = proposal[2]

        expect(proposal_description).to.be.equal( proposalsDescriptions[idx] )
        expect( parseInt(proposal_votesCount,10) ).to.be.equal(0)
        expect(proposal_proposingAddress).to.be.equal( proposalsAccounts[idx] )
      })
    }); //
















    // ***************************************************************************************
    // Passage de "Fin d'enregistrement des propositions" (2) à "Ouverture des votes" (3)
    // ***************************************************************************************

    it("Voting_03-Voting_03-Fonctionnement : 2-3 : Should transition to 'StartVotingSession'", async () =>
    {
      await this.contract_Voting_03_Instance.setStateStartVotingSession( {from: account_00_initial_owner_contract_Voting_03 } )
      currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
      expectedStatus = new BN( WorkflowStatus_03_VotingSessionStarted );
      expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
    });




     }); // contract Voting_03'

  }); // Serie 01 - 03 - 04 : Voting_03-Voting_03-Fonctionnement : Fonctionnement

}); // Serie 01 - 04 : Voting
    

}); // Serie 01

