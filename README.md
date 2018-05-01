# Ten

User sends ETHs to a common pot. On the 10th bet, all the Eths in the pot gets randomly assigned to one of the users that contributed.

This is a bare bones Dapp (Distributed app) running on Ethereum.
Meant to ilustrate how to interface a web app to a smart contract on Ethereum
Intentionally not using any CSS or any frontend framework not to distract from the Distributed concept.

Frontend uses:
  - [JQuery](http://jquery.com/) (to make DOM processing a little simpler and less ugly)
  - [Ethjs](https://github.com/ethjs/ethjs) - A light-weight async lib to communicate with the Ethereum network
  - Bare minimum javascript using [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) and [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) (personal preference for functional style)

"Backend" uses:
- [Solidity](https://solidity.readthedocs.io/en/v0.4.23/) for the language to write the Smart Contract
- [Remix](http://remix.ethereum.org) online Solidity compiler


User uses:
- a Web3 browser (Any browser with the [MetaMask](https://metamask.io/) extension should do)
  

### How to test

The Smart Contract [(Ten.Sol)](Ten.sol) needs to be deployed to the Ethereum Network.
Deploying Smart Contracts to the Ethereum network and doing write operations costs ETHs, so a functioning wallet with some ETHs in it is required.

In order not to spend real ETHs to test this, we'll setup a testing environment.
(I used Ubuntu 17.10, if you're using something else, adapt accordingly.)

We'll need a Ethereum network simulator like [ganache-cli](https://github.com/trufflesuite/ganache-cli)
```
$ sudo apt install npm
$ sudo npm install -g ganache-cli
```

We run it like this:
```sh
$ ganache-cli -d
```
Besides setting up a private "test network" this will generate 10 accounts with 100 ETHs already in each of them for you to spend (isn't that nice ? ;-) )
The flag "-d" starts it in _deterministic_ mode, which means it will pre-generate always the same seed and accounts which makes it easier to develop.
When you run it, at the end you'll see something like:
```
HD Wallet
==================
Mnemonic:      myth like bonus scare over problem client lizard pioneer submit female collect
Base HD Path:  m/44'/60'/0'/0/{account_index}

Listening on localhost:8545
```
That _Mnemonic_ part is a human readable _seed_ for a [_Deterministic Wallet_](https://en.bitcoin.it/wiki/Deterministic_wallet), that allows to recover all the generated accounts. This is what you generally want to backup and keep a secret.
Copy the mnemonic seed words and click on your MetaMask browser extension.
Choose the network to connect to. It should be "localhost 8545". This is where Ganache is listening to, but could also be your own Ethereum node.
Choose "Restore from seed phrase" and paste the seed you copied. Then choose a password to protect this seed.
This procedure allows MetaMask to generate the same private keys that were generated in Ganache, and gives you access to all those ETHs.
If all goes well, MetaMask should show you an "Account 1" with 100 ETHs in it. Yay !

Because this is a test network that resets everytime we restart it, we still have to deploy our contract (our "backend" code). In the real Ethereum network, we would only need to do this once.
To compile and deploy, head up to Remix IDE and:
* import both [Ten.sol](Ten.sol) and [ownable.sol](ownable.sol)
* select a compiler version in the "Settings" tab (like the latest non nightly build)
* Click "Start to compile" in the compile tab
* In the Run tab, click Environment and select "Web3 Provider" and point it to "http://localhost:8545" (where ganache is listening)
* Still on the Run tab, click Create
* The contract API and an address for the contract should appear below

Also, the ganache log should show something like:

```
  Transaction: 0x7d8fdaaa48ef715f7a9bf891e18b694ea68280cd382d72ce90930ce9c1508c50
  Contract created: 0xe78a0f7e598cc8b0bb87894b0f60dd2a88d6a8ab
  Gas usage: 470280
  Block Number: 1
  Block Time: Mon Apr 30 2018 20:20:18 GMT+0100 (WEST)
```
The "Contract created" address, should match the "tenAddress" that is in the app [code](ten.js)

One final step is to run a http server where the index.html is located. You could try to open the file in the browser, but chrome will probably give you some [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) troubles, because you're loading the file from disk, and the javascript libraries are being downloaded from the net.
So, I just served the current directory with:
```
$ ruby -run -e httpd . -p 8000
```
If you don't have ruby installed, you may find this alternative [list](https://gist.github.com/willurd/5720255) useful.
Now you can use you web3 enabled browser and open:
```
http://localhost:8000/index.html
```
You should now see something like:
|||
|--|--|
|Network status:|	has web3|
|Pot (Eth):|	0|
|Minimum bet (Eth):|	0.1|
|Account:|	0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1|
|balance:|	99.99811887999811888|
[Bet]()

When you click the "Bet" button, a MetaMask popup will show, asking you to confirm sending 0.1 ETH to the contract. If the field "Gas price" says 0, it's possible you have to increase it to 1.
Click "submit", wait a few seconds and both your account balance and the pot should update.
If you want to play with different accounts, go to MetaMask click the account button on top, and create a new one. Since the account generation is deterministic and has the seed we gave it earlier, a new account with already 100 ETHs will show up (courtesy of ganache :-) )

If something doesn't quite work, try firing up the developer console in the browser and see if any javascript errors show up. Chances are, in my experience, that MetaMask didn't correctly connect to your private Ethereum network (ganache), because you launched the browser before launching ganache.

Enjoy !

### Licence
![Creative Commons License](https://i.creativecommons.org/l/by/4.0/88x31.png)
This work is licensed under a [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/)
