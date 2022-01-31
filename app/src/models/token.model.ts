import { Address, Token } from "@/interfaces";
import { TokensService } from "@/services";

export default class TokenModel implements Token {
  value!: number;
  bidder!: string;
  tokenId!: number;

  constructor(token: Token) {
    Object.assign(this, token);

    this.value = +this.value;
    this.tokenId = +this.tokenId;
  }

  public hasBidder(): boolean {
    return Boolean(this.bidder !== '0x0000000000000000000000000000000000000000');
  }

  public bid(bidValue: number): void {
    TokensService.bid(this.tokenId, bidValue);
  }

  public async getName(): Promise<string | undefined> {
    return TokensService.getName();
  }

  public isBidder(address: Address): boolean {
    return this.bidder === address;
  }
}
