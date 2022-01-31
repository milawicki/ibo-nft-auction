# Initial Bottle Offering - NTF Auction

![Screenshot](https://user-images.githubusercontent.com/30719996/151843910-32eeca27-9041-42a9-8b43-eb448ab2f592.png)


Yet another varian of IBO (check [description of IBO](https://github.com/milawicki/ibo) for better understanding of this app). In this version bottles are represented by NFT tokens, so they're dedicated for emitting limited / collector editions. Each bottle will have unique ID on it. Tokens are offered on time limited auction.

Feel free to check other variants of this dApp:

* [IBO](https://github.com/milawicki/ibo) - base version of this app, handling only one token at a time
* [IBO Manager](https://github.com/milawicki/ibo-manager) - handles multiple tokens

## Disclaimer

Following code is NOT production ready. It may contain bugs and be not gas efficient. It was created as learning project. Feel free to use it as an example of creating ERC721 token (non-fungible token) and dApp associated with it.


## Tooling
**Frontend**: TypeScript / VueJS / VueX / Vuetify / Ethers

**Smart contract**: Solidity / HardHat / Chai / Mocha / Waffle

## Instalation

1. Clone this repository

```
git clone https://github.com/milawicki/ibo-nft-auction
```

2. Install smart contract dependencies
```
npm install
```

3. Install front end app dependencies
```
cd app
npm install
```

## Testing
You can test all features of smart contract by executing
```
npm run compile
npm run test
```

## Running

1. Run local Ethereum node
```
npx hardhat node
```

2. (Optionally) Change Token details
Open `scripts/deploy.ts` and setup token details:
```
const NAME_OF_TOKEN = 'Solaris 2022';
const SYMBOL_OF_TOKEN = 'SOL22';
const NUMBER_OF_BOTTLES_TO_AUCTION = 20;
const AUCTION_DURATION_IN_DAYS = 5
```

3. Deploy Smart contract
```
npm run deploy
```

After the contract will be deployed you will see its address in console copy it and paste in `app/src/services/tokens.service.ts` as a value of
```
const TOKEN_ADDRESS = '';
```

3. Start VueJS app
```
cd app
npm run serve
```

Go to http://localhost:8080/  to interact with the app

*Remember to connect your wallet to Hardhat network*

## Using the app

When you'll open the app and login with your wallet you'll be able to make a bid. You'll also see current bids for all tokens as well as bidding history (if exists). 

If someone overbid you your funds will be ready to refund. You'll see "Refund" button on the top of the page. If the auction will be over and you'll be top bidder for at least one token you'll see "click here to get your tokens" button. When you'll click it all tokens will be transferred to your wallet.



## Author
Mike Lawicki http://lawicki.pl