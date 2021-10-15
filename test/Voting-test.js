// erc20.test.js
const { BN, ether } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
// const { assert } = require('console');
var assert = require('chai').assert;

const ERC20 = artifacts.require('ERC20Token');

const BIGNUMBER_ZERO = new BN(0);

contract('ERC20', function (accounts)
 {
  const _name = 'ALYRA';
  const _symbol = 'ALY';
  const _initialsupply = new BN(1000);
  const _decimals = new BN(18);
  const owner = accounts[0];
  const recipient = accounts[1];
  const spender = accounts[2];
  const recipient2 = accounts[3];

  before(async () =>
  {
   this.ERC20Instance = await ERC20.new(_initialsupply,{from: owner});
  });
/*
  beforeEach(async () =>
   {
    this.ERC20Instance = await ERC20.new(_initialsupply,{from: owner});
   });
*/
  it('a un nom', async () =>
   {
    expect(await this.ERC20Instance.name()).to.equal(_name);
   });

  it('a un symbole', async () =>
   {
    expect(await this.ERC20Instance.symbol()).to.equal(_symbol);
   });

  it('a une valeur décimal', async () =>
   {
    expect(await this.ERC20Instance.decimals()).to.be.bignumber.equal(_decimals);
   });

  it('vérifie la balance du propriétaire du contrat', async () =>
   {
    let balanceOwner = await this.ERC20Instance.balanceOf(owner);
    let totalSupply = await this.ERC20Instance.totalSupply();
    expect(balanceOwner).to.be.bignumber.equal(totalSupply);
   });

  it('vérifie si un transfert est bien effectué', async () =>
   {
    let balanceOwnerBeforeTransfer = await this.ERC20Instance.balanceOf(owner);
    let balanceRecipientBeforeTransfer = await this.ERC20Instance.balanceOf(recipient);
    let amount = new BN(10);
    await this.ERC20Instance.transfer(recipient, amount, {from: owner});
    let balanceOwnerAfterTransfer = await this.ERC20Instance.balanceOf(owner);
    let balanceRecipientAfterTransfer = await this.ERC20Instance.balanceOf(recipient);
    
    expect(balanceOwnerAfterTransfer).to.be.bignumber.equal(balanceOwnerBeforeTransfer.sub(amount));
    expect(balanceRecipientAfterTransfer).to.be.bignumber.equal(balanceRecipientBeforeTransfer.add(amount));
   });

   it('emits transfer approval for a spender', async () =>
   {
     // Autorise [spender] à dépenser numTokens tokens du [msgSender] (recipient)
    
    const allowedTokensAmountToBeSpent = new BN(100);
    transactionReceipt = await this.ERC20Instance.approve( spender, allowedTokensAmountToBeSpent, {from: recipient} );
    // console.log(transactionReceipt)

    allowedTokensAmountRemainingToSpend = await this.ERC20Instance.allowance( recipient, spender );

    expect(allowedTokensAmountRemainingToSpend).to.be.bignumber.equal(allowedTokensAmountToBeSpent);

   });
/*
   it('Checks transfer approval rejection for a zero address spender', async () =>
   {
    const allowedTokensAmountToBeSpent = new BN(100);
    transactionReceipt = await this.ERC20Instance.approve( 0, allowedTokensAmountToBeSpent, {from: recipient} );
    // console.log(transactionReceipt)

    // allowedTokensAmountRemainingToSpend = await this.ERC20Instance.allowance( owner, spender );

    // assert.throws( async () => { await this.ERC20Instance.allowance( owner, spender )  }, Error, "Error thrown");
    expect( async () => { await this.ERC20Instance.allowance( owner, spender )  } ).to.be.rejectedWith(Error)

    // expect(allowedTokensAmountRemainingToSpend).to.be.bignumber.equal(0);

   });
*/
   it('Spender transfers from recipient1 to recipient2', async () =>
   {
    // Initial amount of tokens to provide to the recipient
    const tokensAmountToTransferFromOwnerToRecipient = new BN(10);
    // Amount of tokens to be spent by spender
    const allowedTokensAmountToBeSpentBySpender = new BN(9);
    const allowedTokensAmountToBeSpentBySpenderToRecipient2 = new BN(8);

    // Spender must notbe allowed to spend more than initial amount of tokens initially given to recipient
    expect(tokensAmountToTransferFromOwnerToRecipient).to.be.bignumber.least(allowedTokensAmountToBeSpentBySpender);
    // Spender can't spend more than allowed tokens
    expect(allowedTokensAmountToBeSpentBySpender).to.be.bignumber.least(allowedTokensAmountToBeSpentBySpenderToRecipient2);

    // Remind all initial balances
    let balanceOwner_BeforeTransfer = await this.ERC20Instance.balanceOf(owner);
    let balanceRecipient_BeforeTransfer = await this.ERC20Instance.balanceOf(recipient);
    let balanceSpender_BeforeTransfer = await this.ERC20Instance.balanceOf(spender);

    // 1 : Transfer from owner to spender
    // Owner -> Recipient
    transactionReceipt = await this.ERC20Instance.transfer( recipient, tokensAmountToTransferFromOwnerToRecipient, {from: owner});
    // console.log(transactionReceipt)

    // Balances after transfer
    let balanceOwner_AfterTransfer = await this.ERC20Instance.balanceOf(owner);
    let balanceRecipient_AfterTransfer = await this.ERC20Instance.balanceOf(recipient);
    let balanceSpender_AfterTransfer= await this.ERC20Instance.balanceOf(spender);

    // Check all balances are up to date
    // Owner :decreased
    expect(balanceOwner_AfterTransfer).to.be.bignumber.equal(balanceOwner_BeforeTransfer.sub(tokensAmountToTransferFromOwnerToRecipient));
    // Recipient : increased
    expect(balanceRecipient_AfterTransfer).to.be.bignumber.equal(balanceRecipient_BeforeTransfer.add(tokensAmountToTransferFromOwnerToRecipient));
    // Spender : unchanged
    expect(balanceSpender_BeforeTransfer).to.be.bignumber.equal(balanceSpender_AfterTransfer);

    // 2 : Recipient allow Spender to spend (Recipient) tokens
    transactionReceipt = await this.ERC20Instance.approve( spender, allowedTokensAmountToBeSpentBySpender, {from: recipient} );
    // Check allowance
    allowedTokensAmountRemainingToSpendBySpender = await this.ERC20Instance.allowance( recipient, spender );
    expect(allowedTokensAmountRemainingToSpendBySpender).to.be.bignumber.equal(allowedTokensAmountToBeSpentBySpender);

    // 3 : TransferFrom
    // Remind all balances before TransferFrom
    let balanceOwner_BeforeTransferFrom = await this.ERC20Instance.balanceOf(owner);
    let balanceRecipient_BeforeTransferFrom = await this.ERC20Instance.balanceOf(recipient);
    let balanceRecipient2_BeforeTransferFrom = await this.ERC20Instance.balanceOf(recipient2);
    let balanceSpender_BeforeTransferFrom = await this.ERC20Instance.balanceOf(spender);
    // TransferFrom : Spender spends/sends recipient tokens to recipient2
    // recipient -> recipient2
    transactionReceipt = await this.ERC20Instance.transferFrom( recipient, recipient2, allowedTokensAmountToBeSpentBySpenderToRecipient2, {from: spender} );

    // Balances after transferFrom
    let balanceOwner_AfterTransferFrom = await this.ERC20Instance.balanceOf(owner);
    let balanceRecipient_AfterTransferFrom = await this.ERC20Instance.balanceOf(recipient);
    let balanceRecipient2_AfterTransferFrom = await this.ERC20Instance.balanceOf(recipient2);
    let balanceSpender_AfterTransferFrom = await this.ERC20Instance.balanceOf(spender);

    // Check all balances are up to date
    // Owner : unchanged
    expect(balanceOwner_AfterTransferFrom).to.be.bignumber.equal(balanceOwner_BeforeTransferFrom);
    // Recipient : decreased
    expect(balanceRecipient_AfterTransferFrom).to.be.bignumber.equal(balanceRecipient_BeforeTransferFrom.sub(allowedTokensAmountToBeSpentBySpenderToRecipient2));
    // Recipient2 : increased
    expect(balanceRecipient2_AfterTransferFrom).to.be.bignumber.equal(balanceRecipient2_BeforeTransferFrom.add(allowedTokensAmountToBeSpentBySpenderToRecipient2));
    // Spender : unchanged
    expect(balanceSpender_AfterTransferFrom).to.be.bignumber.equal(balanceSpender_BeforeTransferFrom);

   });

 }); // contract('ERC20'