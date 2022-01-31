import { Address } from "@/interfaces";
import { ethers } from "ethers";
import { EthService } from ".";

class UserService extends EthService {
  async getCurrentUser(): Promise<Address | undefined> {
    return this.provider?.getSigner().getAddress();
  }

  async getCurrentUserBalance(): Promise<number> {
    const balance = await this.provider?.getSigner().getBalance();
    return balance ? +ethers.utils.formatEther(balance) : 0;
  }
}

export default new UserService;
