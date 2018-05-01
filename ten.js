window.addEventListener('load',startApp );

function startApp(){
	// Checking if Web3 has been injected by the browser (Mist/MetaMask)
	if (typeof web3 === 'undefined') {
		$("#txStatus").text("No web3 provider! Use metamask or similar");
		// Use Mist/MetaMask's provider
		return;
	}
	$("#txStatus").text("has web3");
	//web3 = new Web3(web3.currentProvider);
	const eth = new Eth(web3.currentProvider);

	var tenAddress = "0xe78a0f7e598cc8b0bb87894b0f60dd2a88d6a8ab";
	var tenABI = 
	[
		{
			"constant": false,
			"inputs": [],
			"name": "bet",
			"outputs": [],
			"payable": true,
			"stateMutability": "payable",
			"type": "function"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"name": "previousOwner",
					"type": "address"
				},
				{
					"indexed": true,
					"name": "newOwner",
					"type": "address"
				}
			],
			"name": "OwnershipTransferred",
			"type": "event"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "_minBet",
					"type": "uint256"
				}
			],
			"name": "setMinBet",
			"outputs": [],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "newOwner",
					"type": "address"
				}
			],
			"name": "transferOwnership",
			"outputs": [],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "minBet",
			"outputs": [
				{
					"name": "",
					"type": "uint256"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "owner",
			"outputs": [
				{
					"name": "",
					"type": "address"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "pot",
			"outputs": [
				{
					"name": "",
					"type": "uint256"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		}
	];	
	var tenContract = eth.contract(tenABI).at(tenAddress);

	function timeout(ms) { //add promise delay, from stackoverflow
		return value => new Promise(resolve => setTimeout(() => resolve(value), ms));
	}
	function toEthUi(id) {
		return _ => {
			let ether = Eth.fromWei(_[0] || _ , 'ether')
			$(id).text(ether);
			return ether;
		}
	}

	var account;
	eth.accounts()
		.then(a => {
			account = a[0];
			$("#account").text(account);
			return account;
		} )
		.then(eth.getBalance)
		.then(toEthUi("#balance"));
	
	tenContract.pot()
		.then(toEthUi("#pot"));
		 
	 var minBet; 
	 tenContract.minBet()
	 	.then(toEthUi("#minBet"))
	 	.then(_ => minBet = _);
	 
	 $("#bet").click( () => {
		var bidTxObject = {
			from: account,
			value: Eth.toWei(minBet, 'ether'),
		};
		console.log(bidTxObject)
		tenContract.bet(bidTxObject)
			.then(_ => {
				$("#txStatus").text(_);
				return eth.getTransactionReceipt(_)
					.then(timeout(10000))
			})
			.then(() => eth.getBalance(account))
			.then(toEthUi("#balance"))
			.then(() => tenContract.pot())
			.then(toEthUi("#pot"))
			.catch(console.log)

	 });


	}
