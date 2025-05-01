(async function accessScript() {
  console.log("Running access_web3.js in Remix...");

  if (typeof web3 === 'undefined') {
    console.error("web3 is not injected. Are you using JavaScript VM or Injected Provider?");
    return;
  }

  // Replace with actual ABI from FlightInsurance2.json
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
			"name": "payIndemnity",
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

  // Replace with your deployed contract address
  const contractAddress = "0xDA0bab807633f07f013f94DD0E6A4F96F8742B53"; // <-- Replace

  const accounts = await web3.eth.getAccounts();
  console.log("Accounts:", accounts);

  const contract = new web3.eth.Contract(abi, contractAddress);

  // Provided weather data
  const weatherData = [
    ["2023-04-15", "Denver", "Hail"],
    ["2023-04-15", "Austin", "Normal"],
    ["2023-04-16", "Houston", "Rainfall"],
    ["2023-04-16", "Boston", "Rainfall"],
    ["2023-04-17", "Phoenix", "Flood"],
    ["2023-04-18", "Tampa", "Hail"],
    ["2023-04-18", "Miami", "Flood"],
    ["2023-04-19", "Tucson", "Normal"]
  ];

  const delayWeather = ["Hail", "Flood", "Rainfall"];

  for (let i = 0; i < weatherData.length; i++) {
    const [date, city, weather] = weatherData[i];
    const passenger = accounts[i + 1]; // assume passengers are accounts[1] through accounts[8]

    if (!delayWeather.includes(weather)) {
      console.log(`${date} | ${city} | ${weather}: No delay. Indemnity not paid.`);
      continue;
    }

    console.log(`${date} | ${city} | ${weather}: Attempting indemnity payout for ${passenger}...`);

    try {
      const result = await contract.methods
        .payIndemnity(passenger)
        .send({ from: accounts[0] });

      console.log(`Indemnity paid to ${passenger}. Tx: ${result.transactionHash}`);
    } catch (err) {
      console.log(`Failed to pay indemnity to ${passenger}: ${err.message}`);
    }
  }

  console.log("Script complete.");
})();