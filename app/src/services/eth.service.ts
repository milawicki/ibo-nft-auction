import { ethers } from "ethers";

export default abstract class EthService {
  protected contract?: ethers.Contract;
  protected provider: ethers.providers.Web3Provider;

  constructor() {
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
  }

  connectToWallet(): Promise<string[]> {
    return this.provider.send("eth_requestAccounts", []);
  }

  async subscribeForEvent(event: string, callback: ethers.providers.Listener): Promise<void> {
    this.provider.once('block', () => this.contract?.on(event, callback));
  }
}
