// erc20.test.js
const { BN, ether, expectRevert, constants } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
// const { assert } = require('console');
var assert = require('chai').assert;

// https://www.chaijs.com/plugins/chai-fuzzy/
// https://www.npmjs.com/package/chai-fuzzy
var chai = require('chai');
chai.use(require('chai-fuzzy'));

// const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"; 
const Voting_03 = artifacts.require('Voting_03');

const BIGNUMBER_ZERO = new BN(0);

// --------------------------------------------------------------------------------------------------------------

describe('Serie 01 : Voting Contract tests', function()
{

// --------------------------------------------------------------------------------------------------------------
describe('Serie 01 - 01  : Ownable tests', function()
  {

    contract('Voting_03', function (accounts)
    {
      // const _name = 'ALYRA';
      // const _symbol = 'ALY';
      // const _initialsupply = new BN(1000);
      // const _decimals = new BN(18);

      const account_00 = accounts[0];
      const account_01 = accounts[1];
      const account_02 = accounts[2];
      const account_03 = accounts[3];

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
      it('Contract Voting_03 is owned by account_00', async () =>
      {
        expect(await this.contract_Voting_03_Instance.owner()).to.equal( account_00 );
      });

      it('Contract Voting_03 is NOT owned by account 01', async () =>
      {
        expect(await this.contract_Voting_03_Instance.owner()).to.not.equal( account_01 );
      });

      it("Contract Voting_03 can't be transferred to zero address", async () =>
      {
        await expectRevert
          (
            this.contract_Voting_03_Instance.transferOwnership( constants.ZERO_ADDRESS, {from: account_00_initial_owner_contract_Voting_03} )
            , "revert Ownable: new owner is the zero address" 
          );
        // Contract owner remains the same
        expect( await this.contract_Voting_03_Instance.owner() ).to.equal( account_00_initial_owner_contract_Voting_03 );
      });

      it('Contract Voting_03 is can only be transferred by owner', async () =>
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

      it('Contract Voting_03 is transferred to account_02', async () =>
      {
        const newOwner = account_02;
        await this.contract_Voting_03_Instance.transferOwnership( newOwner, {from: account_00_initial_owner_contract_Voting_03} );
        expect(await this.contract_Voting_03_Instance.owner()).to.equal( account_02 );
      });

      it('Contract Voting_03 is NO longer owned by to account_00', async () =>
      {
        expect(await this.contract_Voting_03_Instance.owner()).to.not.equal(account_00);
      });

      it('Contract Voting_03 is NO longer owned by anyone', async () =>
      {
        await this.contract_Voting_03_Instance.renounceOwnership( {from: account_02} );
        expect( await this.contract_Voting_03_Instance.owner() ).to.equal( constants.ZERO_ADDRESS );
      });

      it("Contract can't be transferred anymore", async () =>
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

  describe('Serie 01 - 02 : Admin_WL tests', function()
  {
    contract('Voting_03 Admin_WL', function (accounts)
    {
      // const _name = 'ALYRA';
      // const _symbol = 'ALY';
      // const _initialsupply = new BN(1000);
      // const _decimals = new BN(18);

      const account_00 = accounts[0];
      const account_01 = accounts[1];
      const account_02 = accounts[2];
      const account_03 = accounts[3];

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
      it('Admin_WL : Contract Voting_03 is owned by account_00', async () =>
      {
        expect(await this.contract_Voting_03_Instance.owner()).to.equal( account_00 );
      });

      it("Admin_WL : Contract Voting_03 : account_01 can't whitelist himself", async () =>
      {
        await expectRevert
        (
          this.contract_Voting_03_Instance.whitelist( account_01, {from: account_01 } )
          , "Ownable: caller is not the owner." 
        );
        expect(await this.contract_Voting_03_Instance.isWhitelisted( account_01 )).to.be.false;
      });

      it('Admin_WL : Contract Voting_03 owner can whitelist account_01', async () =>
      {
        await this.contract_Voting_03_Instance.whitelist( account_01, {from: account_00_initial_owner_contract_Voting_03 } )
        expect(await this.contract_Voting_03_Instance.isWhitelisted( account_01 )).to.be.true;
      });

      it('Admin_WL : Contract Voting_03 owner is not initially whitelisted', async () =>
      {
        expect(await this.contract_Voting_03_Instance.isWhitelisted( account_00_initial_owner_contract_Voting_03 )).to.be.false;
      });

      it('Admin_WL : Contract Voting_03 account 03 is not whitelisted', async () =>
      {
        expect(await this.contract_Voting_03_Instance.isWhitelisted( account_03 )).to.be.false;
      });

      it('Admin_WL : Contract Voting_03 owner can whitelist himself', async () =>
      {
        await this.contract_Voting_03_Instance.whitelist( account_00_initial_owner_contract_Voting_03, {from: account_00_initial_owner_contract_Voting_03 } )
        expect(await this.contract_Voting_03_Instance.isWhitelisted( account_00_initial_owner_contract_Voting_03 )).to.be.true;
      });

      it("Admin_WL : Contract Voting_03 : whitelisted account_01 can't whitelist someone else", async () =>
      {
        await expectRevert
        (
          this.contract_Voting_03_Instance.whitelist( account_02, {from: account_01 } )
          , "Ownable: caller is not the owner." 
        );
        expect(await this.contract_Voting_03_Instance.isWhitelisted( account_02 )).to.be.false;
      });

      it("Admin_WL : Contract Voting_03 : Anyone can list whitelisted addresses", async () =>
      {
        res = await this.contract_Voting_03_Instance.getWhiteListedAddresses(  {from: account_03 } );
        expectedRes = [ account_00_initial_owner_contract_Voting_03 , account_01 ];
        // console.log(res);
        // console.log(expectedRes);
        expect( await this.contract_Voting_03_Instance.getWhiteListedAddresses(  {from: account_03 } ) ).to.have.members( expectedRes ) ;
      });

      it("Admin_WL : Contract Voting_03 : account 03 is not in whitelisted addresses list", async () =>
      {
        res = await this.contract_Voting_03_Instance.getWhiteListedAddresses(  {from: account_03 } );
        unexpectedRes = [ account_03 ];
        // console.log(res);
        // console.log(expectedRes);
        expect( await this.contract_Voting_03_Instance.getWhiteListedAddresses(  {from: account_03 } ) ).not.to.have.members( unexpectedRes ) ;
      });

    }); // contract('Voting_03'
  }); // describe('Serie 02'

// --------------------------------------------------------------------------------------------------------------

describe('Serie 01 - 03 : Voting_03 tests', function()
{
  contract('Voting_03 tests', function (accounts)
  {
    // const _name = 'ALYRA';
    // const _symbol = 'ALY';
    // const _initialsupply = new BN(1000);
    // const _decimals = new BN(18);

    const account_00 = accounts[0];
    const account_01 = accounts[1];
    const account_02 = accounts[2];
    const account_03 = accounts[3];

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
    it('Voting_03 : Contract Voting_03 is owned by account_00', async () =>
    {
      expect(await this.contract_Voting_03_Instance.owner()).to.equal( account_00 );
    });

    it("Voting_03 : ?", async () =>
    {
 
    });

  }); // contract('Voting_03'

}); // describe('Serie 03'

// --------------------------------------------------------------------------------------------------------------

}); // describe('Serie 01'

