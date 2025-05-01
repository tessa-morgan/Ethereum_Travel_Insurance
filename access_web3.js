(async function accessScript() {
    console.log("Running access_web3.js in Remix...");

    // Actual ABI from FlightInsuranceX.json
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
	]
    
    // Actual deployed contract address
    const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138"; // <-- Replace

    const accounts = await web3.eth.getAccounts();
    // Prints all available testing accounts when uncommented
    // console.log("Accounts:");
    // accounts.forEach((addr, i) => {
    //     console.log(`  [${i}]: ${addr}`);
    // });
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

    // START USER TESTS BEFORE WEATHER CHECKS
    if (false) {
        // === [1] Test: View Available Policy ===
        try {
            const availablePolicy = await contract.methods.viewAvailablePolicy().call();
            console.log("\n[1] viewAvailablePolicy():");
            console.log(`Returned: ${availablePolicy}`);
            console.log("Expected: Premium: 0.01 ETH, Indemnity: 0.02 ETH, Coverage: Extreme Weather Delays (e.g., hail, flooding, etc.).");
         } catch (err) {
            console.error("Error calling viewAvailablePolicy:", err.message);
        }

        // === [2] Test: Purchase Policies ===
        const passengers = [
            { idx: 1, name: "Alice", flight: "AA100", date: "2023-04-15", from: "Denver", to: "Dallas" },
            { idx: 2, name: "Bob", flight: "DL200", date: "2023-04-16", from: "Houston", to: "Chicago" },
            { idx: 3, name: "Carol", flight: "UA300", date: "2023-04-17", from: "Tampa", to: "Seattle" },
        ];

        for (const p of passengers) {
            try {
                const result = await contract.methods.purchasePolicy(p.name, p.flight, p.date, p.from, p.to).call({
                    from: accounts[p.idx],
                    value: web3.utils.toWei("0.01", "ether")
                });
                console.log(`\n[2] purchasePolicy() by ${p.name} (${accounts[p.idx]}):`);
                console.log(`Returned: ${result[1]}`);
                console.log("Expected: Policy successfully purchased");
            } catch (err) {
                console.log(`\n[2] purchasePolicy() by ${p.name} (${accounts[p.idx]}):`);
                console.log(`Returned Error: ${err.message}`);
                console.log("Expected: Success with sufficient ETH and valid inputs");
            }
        }

        // === [3] Test: View Purchased Policies ===
        for (const p of passengers) {
            try {
                const result = await contract.methods.viewMyPolicy().call({ from: accounts[p.idx] });
                console.log(`\n[3] viewMyPolicy() for ${p.name} (${accounts[p.idx]}):`);
                const returnedPolicy = result[0]; // This is the actual policy struct object
                const message = result[1];

                console.log(`Returned: Policy for ${returnedPolicy.passengerName} with flight ${returnedPolicy.flightNumber} and departure ${returnedPolicy.departureCity}`);
                console.log(`Expected: Policy for ${p.name} with flight ${p.flight} and departure ${p.from}`);
            } catch (err) {
                console.log(`\n[3] viewMyPolicy() for ${p.name} (${accounts[p.idx]}):`);
                console.log("Returned Error:", err.message);
            }
        }

        // === [4] Test: Attempt Re-purchase (should fail) ===
        try {
            const p = passengers[0]; // Try Alice again
            const result = await contract.methods.purchasePolicy(p.name, p.flight, p.date, p.from, p.to).call({
                from: accounts[p.idx],
                value: web3.utils.toWei("0.01", "ether")
            });

            console.log(`\n[4] Re-purchase by ${p.name} (${accounts[p.idx]}):`);
            console.log(`Returned: ${result[0]} because ${result[1]}`);
            console.log("Expected: false because Policy already exists for this address");
        } catch (err) {
            console.log(`\n[4] Re-purchase by ${passengers[0].name} (${accounts[passengers[0].idx]}):`);
            console.log("Returned Error:", err.message);
            console.log("Expected: \nPolicy already exists error");
        }
    }
    // END USER TESTS BEFORE WEATHER CHECKS

    // Below is where verification and testing is done 
    const delayWeather = ["Hail", "Flood", "Rainfall"];

    let policies = [];
    try {
        const result = await contract.methods.viewAllPolicies().call({ from: accounts[0] });
        policies = result[0];
        console.log("\n\nFetched policies:", policies);
    } catch (err) {
        console.error("Failed to fetch policies:", err.message);
        return;
    }

    for (let i = 0; i < weatherData.length; i++) {
        const [date, city, weather] = weatherData[i];

        for (let j = 0; j < policies.length; j++) {
            const policy = policies[j];

            if (policy.flightDate === date && policy.departureCity === city) {
                console.log(`${date} | ${city} | ${weather}: Delay matches policy for ${policy.passengerName}`);

                try {
                    const tx = await contract.methods
                    .payIndemnity(policy.passengerAddress)
                    .send({ from: accounts[0] });

                    console.log(`\tIndemnity paid to ${policy.passengerName}. Tx: ${tx.transactionHash}`);
                } catch (err) {
                    console.log(`\tFailed to pay indemnity to ${policy.passengerName}: ${err.message}`);
                }
            }
        }
    }

    console.log("Script complete.");
})();