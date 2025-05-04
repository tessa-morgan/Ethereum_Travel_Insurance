(async function accessScript() {
    console.log("Running access_web3.js with Phase III Automation in Remix...");

    // Contract ABI 
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
			"stateMutability": "payable",
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
					"internalType": "struct FlightInsurance3.InsurancePolicy[]",
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
					"internalType": "struct FlightInsurance3.InsurancePolicy",
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
    
    const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138"; // <-- Update as needed
    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(abi, contractAddress);

    //  Addresses
    const USERS = {
        Alice: "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
        Bob: "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
        Carol: "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB",
        David: "0x617F2E2fD72FD9D5503197092aC168c91465E7f2"
    };

    //  Purchase Sample Policies
    const testPolicies = [
        {
            user: "Alice",
            args: ["Alice", "AA100", "2025-05-09", "Phoenix", "Seattle"]
        },
        {
            user: "Bob",
            args: ["Bob", "DL200", "2025-05-06", "Denver", "Dallas"]
        },
        {
            user: "Carol",
            args: ["Carol", "UA300", "2025-05-07", "Tucson", "Chicago"]
        },
        {
            user: "David",
            args: ["David", "BA400", "2025-5-10", "Miami", "Miami"] 
        }
    ];

    for (const policy of testPolicies) {
        const fromAddr = USERS[policy.user];
        console.log(`Attempting to purchase policy for ${policy.user}...`);

        try {
            const tx = await contract.methods
                .purchasePolicy(...policy.args)
                .send({ from: fromAddr, value: web3.utils.toWei("0.01", "ether") });
        } catch (err) {
            const revertMsg = err?.data?.message || err?.message || "Unknown error";
            console.error(`Purchase failed for ${policy.user}: ${revertMsg}`);
        }
    }

    //  City to Coordinates Map
    const cityToLatLon = {
        "Denver": [39.7392, -104.9903],
        "Austin": [30.2672, -97.7431],
        "Houston": [29.7604, -95.3698],
        "Boston": [42.3601, -71.0589],
        "Phoenix": [33.4484, -112.0740],
        "Tampa": [27.9506, -82.4572],
        "Miami": [25.7617, -80.1918],
        "Tucson": [32.2226, -110.9747],
        "Dallas": [32.7767, -96.7970],
        "Chicago": [41.8781, -87.6298],
        "Seattle": [47.6062, -122.3321]
    };

    async function isSevereWeather(city, date) {
        const coords = cityToLatLon[city];
        if (!coords) {
            console.warn(`City ${city} not mapped to lat/lon`);
            return false;
        }

        const [lat, lon] = coords;

        try {
            // Step 1: Get grid metadata
            const pointResp = await fetch(`https://api.weather.gov/points/${lat},${lon}`);
            if (!pointResp.ok) throw new Error("Failed to get point metadata");
            const pointData = await pointResp.json();
            const { gridId, gridX, gridY } = pointData.properties;

            // Step 2: Get forecast
            const forecastResp = await fetch(`https://api.weather.gov/gridpoints/${gridId}/${gridX},${gridY}/forecast`);
            if (!forecastResp.ok) throw new Error("Failed to get forecast");
            const forecastData = await forecastResp.json();
            const periods = forecastData.properties.periods;

            // Step 3: Check for matching date (check all 12-hour periods)
                const keywords = ["hail", "flood", "storm", "heavy rain", "hurricane", "severe", "mph"];

                let foundMatch = false;
                let severeFound = false;

                for (const period of periods) {
                    const startDate = period.startTime.split("T")[0]; // "YYYY-MM-DD"
                    if (startDate === date) {
                        foundMatch = true;
                        const desc = period.shortForecast.toLowerCase();
                        if (keywords.some(k => desc.includes(k))) {
                            console.log(`Severe weather in ${city} on ${date}: ${desc}`);
                            severeFound = true;
                        } else {
                            console.log(`Normal period in ${city} on ${date}: ${desc}`);
                        }
                    }
                }

                if (!foundMatch) {
                    console.warn(`No forecast data found for ${city} on ${date}`);
                    return false;
                }

                return severeFound;
        } catch (err) {
            console.error(`Weather API error for ${city}:`, err.message);
        }

        return false;
    }

    //  Fetch All Policies 
    let policies = [];
    try {
        const result = await contract.methods.viewAllPolicies().call({ from: accounts[0] });
        policies = result[0];
        console.log("\nFetched policies:", policies);
    } catch (err) {
        console.error("Failed to fetch policies:", err.message);
        return;
    }

    //  Check Weather & Payout 
    for (const policy of policies) {
        const { passengerName, passengerAddress, departureCity, flightDate } = policy;
        console.log(`\nChecking ${passengerName}'s flight from ${departureCity} on ${flightDate}...`);

        const severe = await isSevereWeather(departureCity, flightDate);
        if (severe) {
            try {
                const balanceBefore = await web3.eth.getBalance(passengerAddress);
                const tx = await contract.methods
                    .payIndemnity(passengerAddress)
                    .send({ from: accounts[0], value: web3.utils.toWei("0.02", "ether") });

                const balanceAfter = await web3.eth.getBalance(passengerAddress);
                const diff = web3.utils.fromWei((BigInt(balanceAfter) - BigInt(balanceBefore)).toString(), 'ether');

                console.log(`Paid indemnity to ${passengerName}: ${diff} Ether`);
            } catch (err) {
                console.error(`Could not pay ${passengerName}:`, err.message);
            }
        } else {
            console.log(`No indemnity paid to ${passengerName}`);
        }
    }


    console.log("\nRunning additional system-level tests...");

    // Test 1: Check policy terms are displayed
    try {
        const policyInfo = await contract.methods.viewAvailablePolicy().call();
        console.log("\n[Test 1] Policy Terms:", policyInfo);
    } catch (err) {
        console.error("[Test 1] Could not fetch policy terms:", err.message);
    }

    // Test 2: Check each user can view their policy
    for (const [name, addr] of Object.entries(USERS)) {
       try {
            const result = await contract.methods.viewMyPolicy().call({ from: addr });
            const policy = result[0];
            const message = result[1];

            console.log(`\n[Test 2] ${name}'s Policy:`, policy, `Message: ${message}`);
        } catch (err) {
            console.error(`[Test 2] Could not fetch ${name}'s policy: ${err.message}`);
        }
    }

    // Test 3: Check provider can view all policies 
    try {
        const result = await contract.methods.viewAllPolicies().call({ from: accounts[0] });
        console.log("\n[Test 3] All policies viewable by provider:", result[0]);
    } catch (err) {
        console.error("[Test 3] Could not fetch all policies:", err.message);
    }

    // Test 4: Check non-provider cannot view all policies 
    try {
        const result = await contract.methods.viewAllPolicies().call({ from: accounts[2] });
        console.log(`\n[Test 4] All policies not viewable by user: ${result[1]}`);
    } catch (err) {
        console.error("[Test 4] Could not fetch all policies:", err.message);
    }

    // Test 5: Performance Analysis
    try {
        const tx = await contract.methods.viewAllPolicies().send({ from: accounts[0] });
        console.log("\n[Test 5] Performance Stats:", {
            gasUsed: tx.gasUsed,
            executionTime: tx.blockHash ? "executed" : "pending"
        });
    } catch (err) {
        console.error("[Test 5] Performance stats unavailable:", err.message);
    }


    console.log("\nPhase III automation complete.");
})();