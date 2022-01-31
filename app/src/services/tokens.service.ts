import contractMetadata from '../../../artifacts/contracts/Ibo.sol/Ibo.json';
import { NewBid, Token } from '@/interfaces';
import { TokenModel } from '@/models';
import { ethers } from 'ethers';
import { EthService } from '.';

const TOKEN_ADDRESS = '';

export enum TokensServiceEvents {
  NewBid = 'NewBid',
  Refund = 'Refund'
}

class TokensService extends EthService {
  protected contract: ethers.Contract;

  constructor() {
    super();

    this.contract = new ethers.Contract(TOKEN_ADDRESS, contractMetadata.abi, this.provider);
    window?.ethereum.on('accountsChanged', () => this.connectSigner());
    this.connectSigner();
  }

  protected async connectSigner(): Promise<void> {
    if ((await this.provider.listAccounts()).length) {
      this.contract = this.contract.connect(this.provider.getSigner());
    }
  }

  async getTokensList(): Promise<TokenModel[] | undefined> {
    const tokens:Token[] = await this.contract.getTokensList()
    return tokens?.map(token => new TokenModel(token));
  }

  bid(tokenId: number, bidValue: number): void {
    this.contract.functions.bid(tokenId, { 
      value: ethers.utils.parseUnits(bidValue.toString())
    });
  }

  async getName(): Promise<string | undefined> {
    return this.contract.name();
  }

  async refund(): Promise<void> {
    return this.contract.functions.refund();
  }

  async getRefundValue(): Promise<number> {
    return +await this.contract.getRefundValue();
  }

  async endOfBiddingDate(): Promise<number> {
    return +await this.contract.endOfBiddingDate();
  }

  async getAllBids(tokenId: number): Promise<NewBid[] | null> {
    const eventFilter = this.contract.filters[TokensServiceEvents.NewBid](null, tokenId);
    const data = await this.contract.queryFilter(eventFilter);
    
    return data.map(event => event.args as unknown as NewBid);
  }

  async transferTokens(): Promise<void> {
    return this.contract.functions.transferTokens();
  }
}

export default new TokensService;
