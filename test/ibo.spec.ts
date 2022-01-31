import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, network } from "hardhat";
import { Ibo } from "../typechain/Ibo";

const TOKENS = 20;
const BIDDING_DAYS = 5;

describe('Ibo', () => {
  let contract: Ibo;
  let signers: SignerWithAddress[];

  beforeEach(async() => {
    const contractFactory = await ethers.getContractFactory('Ibo');
    contract = await contractFactory.deploy('Solaris 23', 'SOL23', TOKENS, BIDDING_DAYS);
    await contract.deployed();

    signers = await ethers.getSigners();
  })

  it('should add all tokens to contract during deployment', async() => {
    expect(await contract.totalSupply()).to.be.equal(TOKENS);
    expect(await contract.balanceOf(signers[0].address)).to.be.equal(TOKENS);
  });

  it('should get list of tokens with bid price', async() => {
    const bids = await contract.getTokensList();

    for(let ndx = 0; ndx < TOKENS; ndx++) {
      expect(bids[ndx].value).to.equal(0);
      expect(bids[ndx].bidder).to.equal('0x0000000000000000000000000000000000000000');
      expect(bids[ndx].tokenId).to.equal(ndx);
    }
  });

  it('should get current bid', async() => {
    const bid = await contract.getCurrentBid(0);

    expect(bid.value).to.equal(0);
    expect(bid.bidder).to.equal('0x0000000000000000000000000000000000000000');
  });

  describe('Bidding', () => {
    it('should add new bid', async() => {
      await contract.bid(1, { value: ethers.utils.parseEther('1')});
      const bid = await contract.getCurrentBid(1);

      expect(bid.value).to.equal(ethers.utils.parseEther('1'));
      expect(bid.bidder).to.equal(signers[0].address);
    });

    it('should reject bid if when not bigger that current', async() => {
      await contract.bid(1, { value: ethers.utils.parseEther('1')});
      await expect(contract.connect(signers[1]).bid(1, { 
        value: ethers.utils.parseEther('0.5'),
      })).to.be.revertedWith('Your bid must be higher than curent one');
    });

    it('should reject bid when current address is equal to current max bidder', async() => {
      await contract.bid(1, { value: ethers.utils.parseEther('1')});
      await expect(contract.bid(1, { 
        value: ethers.utils.parseEther('1.5'),
      })).to.be.revertedWith('You cannot overbid yourself');
    });

    it('should reject when bidding period is over', async() => {
      const contractFactory = await ethers.getContractFactory('Ibo');
      contract = await contractFactory.deploy('Solaris 23', 'SOL23', TOKENS, 0);
      await contract.deployed();

      await expect(contract.bid(1, { 
        value: ethers.utils.parseEther('1.5'),
      })).to.be.revertedWith('Bidding is over');
    });

    it('should emit NewBid event', async() => {
      await contract.connect(signers[1]).bid(1, { value: ethers.utils.parseEther('1') })

      expect(await contract.bid(1, { value: ethers.utils.parseEther('2') })).
        to.emit(contract, 'NewBid').withArgs(
          ethers.utils.parseEther('2'), 1, signers[0].address, signers[1].address
        );
    });

    it('should add previous bidder to refund', async() => {
      await contract.bid(1, { value: ethers.utils.parseEther('1')});
      await contract.connect(signers[1]).bid(1, { value: ethers.utils.parseEther('2') });

      expect(await contract.getRefundValue()).to.eql(ethers.utils.parseEther('1'));
    });
  });

  describe('Withdrawing tokens', () => {
    it('should fail when bidding period is not over', async() => {
      await expect(contract.transferTokens()).to.be.revertedWith('Bidding is still on');
    });

    it('should transfer tokens when user is top bidder', async() => {
      await contract.connect(signers[1]).bid(1, { value: ethers.utils.parseEther('1') });
      await network.provider.send('evm_increaseTime', [BIDDING_DAYS * 24 * 60 * 60]);
      await contract.connect(signers[1]).transferTokens();

      const bid = await contract.getCurrentBid(1);
      expect(bid.value).to.equal(0);
      expect(bid.bidder).to.equal('0x0000000000000000000000000000000000000000');

      expect(await contract.balanceOf(signers[1].address)).to.equal(1);
      expect(await contract.ownerOf(1)).to.equal(signers[1].address);
    });

    it('should transfer ETH to previous owner', async() => {
      await contract.connect(signers[1]).bid(1, { value: ethers.utils.parseEther('1') });
      await network.provider.send('evm_increaseTime', [BIDDING_DAYS * 24 * 60 * 60]);

      const balance = await signers[0].getBalance();
      await contract.connect(signers[1]).transferTokens();

      expect(await signers[0].getBalance()).to.to.gt(balance);
    });
  });

  describe('Refunds', () => {
    it('should fail when nothing to refund', async() => {
      await expect(contract.refund()).to.revertedWith('Nothing to refund');
    });

    it('should handle refund', async() => {
      await contract.bid(1, { value: ethers.utils.parseEther('1')});
      await contract.connect(signers[1]).bid(1, { value: ethers.utils.parseEther('2') });
      
      const balance = await signers[0].getBalance();
      const refundResult = await contract.refund()
      expect(await signers[0].getBalance()).to.be.gt(balance);

      expect(refundResult).to.emit(contract, 'Refund').withArgs(
          ethers.utils.parseEther('1'), signers[0].address
        );
    });
  });

  it('should get endOfBiddingDate', async() => {
    expect(+(await contract.endOfBiddingDate()).toString()).is.a('number');
  })
});
