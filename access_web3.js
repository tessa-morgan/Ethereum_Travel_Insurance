// access_web3.js for Remix Script Runner (no require, no fs)

(async function () {
    console.log("Running access_web3.js...");

    const web3 = new Web3(web3.currentProvider);
    const accounts = await web3.eth.getAccounts();

    // Paste your contract ABI here (from FlightInsurance2.json)
    const abi = [
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_insuranceProvider",
					"type": "address"
				}
			],
			"stateMutability": "nonpayable",
			"type": "constructor"
		},
		{
			"inputs": [],
			"name": "INDEMNITY",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "PREMIUM",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "insuranceProvider",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "passenger",
					"type": "address"
				}
			],
			"name": "markFlightDelayed",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "passenger",
					"type": "address"
				}
			],
			"name": "payIndemnity",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "name",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "flightNo",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "date",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "departure",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "destination",
					"type": "string"
				}
			],
			"name": "purchasePolicy",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				},
				{
					"internalType": "string",
					"name": "",
					"type": "string"
				}
			],
			"stateMutability": "payable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "viewAllPolicies",
			"outputs": [
				{
					"components": [
						{
							"internalType": "string",
							"name": "passengerName",
							"type": "string"
						},
						{
							"internalType": "address",
							"name": "passengerAddress",
							"type": "address"
						},
						{
							"internalType": "string",
							"name": "flightNumber",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "flightDate",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "departureCity",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "destinationCity",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "policyStatus",
							"type": "string"
						}
					],
					"internalType": "struct FlightInsurance2.InsurancePolicy[]",
					"name": "",
					"type": "tuple[]"
				},
				{
					"internalType": "string",
					"name": "",
					"type": "string"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "viewAvailablePolicy",
			"outputs": [
				{
					"internalType": "string",
					"name": "",
					"type": "string"
				}
			],
			"stateMutability": "pure",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "viewBalance",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "viewMyPolicy",
			"outputs": [
				{
					"components": [
						{
							"internalType": "string",
							"name": "passengerName",
							"type": "string"
						},
						{
							"internalType": "address",
							"name": "passengerAddress",
							"type": "address"
						},
						{
							"internalType": "string",
							"name": "flightNumber",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "flightDate",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "departureCity",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "destinationCity",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "policyStatus",
							"type": "string"
						}
					],
					"internalType": "struct FlightInsurance2.InsurancePolicy",
					"name": "",
					"type": "tuple"
				},
				{
					"internalType": "string",
					"name": "",
					"type": "string"
				}
			],
			"stateMutability": "view",
			"type": "function"
		}
	];

    // Paste your deployed contract address here
    const contractAddress = "0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B";

    const contract = new web3.eth.Contract(abi, contractAddress);

    // Paste weather.txt contents here as a string
    const weatherText = `
    UA123,1672531200,ORD,snow
    AA456,1672534800,JFK,rain
    DL789,1672538400,LAX,clear
    `;

    const lines = weatherText.trim().split("\n");

    for (const line of lines) {
        const [flight, timestampStr, location, weatherCode] = line.trim().split(",");
        const timestamp = parseInt(timestampStr.trim());

        try {
            const result = await contract.methods
                .verify(flight.trim(), timestamp, location.trim(), weatherCode.trim())
                .call({ from: accounts[0] });

            console.log(
                `Flight ${flight.trim()} at ${location.trim()} on ${timestamp} with weather '${weatherCode.trim()}':`,
                result ? "✅ Policy Payable" : "Not Payable"
            );
        } catch (err) {
            console.error(`Error on line: ${line}`);
            console.error(err.message);
        }
    }

    console.log("Done.");
})();