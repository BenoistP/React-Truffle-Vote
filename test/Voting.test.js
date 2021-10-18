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
const WorkflowStatus_RegisteringVoters = 0;
const WorkflowStatus_ProposalsRegistrationStarted = 1;
const WorkflowStatus_ProposalsRegistrationEnded = 2;
const WorkflowStatus_VotingSessionStarted = 3;
const WorkflowStatus_VotingSessionEnded = 4;
const WorkflowStatus_VotesTallied = 5;

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
      it("Voting_03-Voting_03-Transitions : Initial state should be 'registering voters'", async () =>
      {
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_RegisteringVoters );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });

      // Vérification de transition interdite de "Enregistrement des votants" à "Fin d'enregistrement des propositions"
      it("Voting_03-Voting_03-Transitions : Transition forbidden : Should not switch to state 'EndProposalsRegistration'", async () =>
      {

        await expectRevert
        (
          this.contract_Voting_03_Instance.setStateEndProposalsRegistration( {from: account_00_initial_owner_contract_Voting_03 } )
          , "Not in 'ProposalsRegistrationStarted' state. -- Reason given: Not in 'ProposalsRegistrationStarted' state.." 
        );
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_RegisteringVoters );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });
      
      // Passage de "Enregistrement des votants" à "Ouverture d'enregistrement des Propositions"
      it("Voting_03-Voting_03-Transitions : Should transition to 'ProposalsRegistrationStarted'", async () =>
      {
        await this.contract_Voting_03_Instance.setStateStartProposalsRegistration( {from: account_00_initial_owner_contract_Voting_03 } )
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_ProposalsRegistrationStarted );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
    
      });



      

      // Vérification de transition interdite de "Ouverture d'enregistrement des Propositions" à "Ouverture d'enregistrement des Propositions"
      it("Voting_03-Voting_03-Transitions : Transition forbidden : Already in 'ProposalsRegistration'", async () =>
      {
        await expectRevert
        (
          this.contract_Voting_03_Instance.setStateStartProposalsRegistration( {from: account_00_initial_owner_contract_Voting_03 } )
          , "Not in 'ProposalsRegistrationStarted' state. -- Reason given: Not in 'ProposalsRegistrationStarted' state.." 
        );
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_ProposalsRegistrationStarted );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });





      // Passage de "Ouverture d'enregistrement des Propositions" à "Fin d'enregistrement des propositions"
      it("Voting_03-Voting_03-Transitions : Should transition to 'ndProposalsRegistration'", async () =>
      {
        await this.contract_Voting_03_Instance.setStateEndProposalsRegistration( {from: account_00_initial_owner_contract_Voting_03 } )
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_ProposalsRegistrationEnded );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });

      // Passage de "Fin d'enregistrement des propositions" à "Ouverture des votes"
      it("Voting_03-Voting_03-Transitions : Should transition to 'StartVotingSession'", async () =>
      {
        await this.contract_Voting_03_Instance.setStateStartVotingSession( {from: account_00_initial_owner_contract_Voting_03 } )
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_VotingSessionStarted );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });

      // Passage de "Ouverture des votes" à "Fermeture des votes"
      it("Voting_03-Voting_03-Transitions : Should transition to 'EndVotingSession'", async () =>
      {
        await this.contract_Voting_03_Instance.setStateEndVotingSession( {from: account_00_initial_owner_contract_Voting_03 } )
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_VotingSessionEnded );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });

      // Passage de "Fermeture des votes" à "Décomptage des votes effectué" 
      it("Voting_03-Voting_03-Transitions : Should transition to 'VotesTallied'", async () =>
      {
        await this.contract_Voting_03_Instance.countAndTallyVotes( {from: account_00_initial_owner_contract_Voting_03 } )
        currentStatus = await this.contract_Voting_03_Instance._workflowStatus();
        expectedStatus = new BN( WorkflowStatus_VotesTallied );
        expect(currentStatus).to.be.a.bignumber.that.equals(expectedStatus);
      });

      


    }); // Contract 'Voting_03-Voting_03-Transitions'

    // WorkflowStatus_VotesTallied
      // countVotes

  }); // Serie 01 - 03 - 01 : Voting_03-Voting_03-Transitions : Transitions


  // --------------------
  // Fonctionnement
  // --------------------
  describe('Serie 01 - 03 - 02 : Voting_03-Voting_03-Fonctionnement : Fonctionnement', function()
  {
    contract('Voting_03 Fonctionnement', function (accounts)
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
       it('Voting_03-Voting_03 : Contract is owned by account_00', async () =>
       {
         expect( await this.contract_Voting_03_Instance.owner() ).to.equal( account_00 );
       });


       it("Voting_03-Voting_03 : Whitelist account 01", async () =>
       {
         await this.contract_Voting_03_Instance.whitelist( account_01, {from: account_00_initial_owner_contract_Voting_03} );
         expect( await this.contract_Voting_03_Instance.isWhitelisted( account_01 ) ).to.be.true;
       });
       
       it("Voting_03-Voting_03 : Whitelist account 02", async () =>
       {
         await this.contract_Voting_03_Instance.whitelist( account_02, {from: account_00_initial_owner_contract_Voting_03} );
         expect( await this.contract_Voting_03_Instance.isWhitelisted( account_02 ) ).to.be.true;
       });

       it("Voting_03-Voting_03 : Whitelist account 03", async () =>
       {
         await this.contract_Voting_03_Instance.whitelist( account_03, {from: account_00_initial_owner_contract_Voting_03} );
         expect( await this.contract_Voting_03_Instance.isWhitelisted( account_03 ) ).to.be.true;
       });

       it("Voting_03-Voting_03 : Whitelist account 043", async () =>
       {
         await this.contract_Voting_03_Instance.whitelist( account_04, {from: account_00_initial_owner_contract_Voting_03} );
         expect( await this.contract_Voting_03_Instance.isWhitelisted( account_04 ) ).to.be.true;
       });

       it("Voting_03-Voting_03 : Accounts addresses 01-04 should be whitelisted", async () =>
       {
         res = await this.contract_Voting_03_Instance.getWhiteListedAddresses(  {from: account_05 } );
         expectedRes = [ account_01, account_02, account_03, account_04 ];
         // console.log(res);
         // console.log(expectedRes);
         expect( res ).to.have.members( expectedRes ) ;
       });


   
     }); // contract Voting_03'

  }); // Serie 01 - 03 - 02 : Voting_03-Voting_03-X : Fonctionnement

}); // Serie 01 - 03 : Voting
    

}); // Serie 01

