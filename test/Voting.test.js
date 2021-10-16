// erc20.test.js
const { BN, ether, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
// const { assert } = require('console');
var assert = require('chai').assert;

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"; 

const Voting_03 = artifacts.require('Voting_03');

const BIGNUMBER_ZERO = new BN(0);

describe('Serie 01 : Contract is Ownable', function()
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
          this.contract_Voting_03_Instance.transferOwnership( ZERO_ADDRESS, {from: account_00_initial_owner_contract_Voting_03} )
          , "revert Ownable: new owner is the zero address" 
        );
    });

    it('Contract Voting_03 is can only be transferred by owner', async () =>
    {
      const newOwner = account_02;
      await expectRevert
        (
          this.contract_Voting_03_Instance.transferOwnership( newOwner, {from: account_01} )
          , "revert Ownable: caller is not the owner" 
        );

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
      await this.contract_Voting_03_Instance.renounceOwnership({from: account_02});
      expect(await this.contract_Voting_03_Instance.owner()).to.equal( ZERO_ADDRESS );
    });

    it('Contract is lost', async () =>
    {
      this.contract_Voting_03_Instance.transferOwnership( account_00_initial_owner_contract_Voting_03 )
      expect(await this.contract_Voting_03_Instance.owner()).to.not.equal( account_00_initial_owner_contract_Voting_03 );
      // await expectRevert( this.contract_Voting_03_Instance.transferOwnership( account_00_initial_owner_contract_Voting_03 ), "" );
    });
  }); // contract('Voting_03'

}); // describe('Serie 01'

describe('Serie 02', function()
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


  }); // contract('Voting_03'
}); // describe('Serie 02'

