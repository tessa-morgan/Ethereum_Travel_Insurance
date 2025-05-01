const fs = require('fs');
const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
const web3 = new Web3(provider);

const contractJSON = require('./artifacts/FlightInsurance2.json');
const contractAddress = '...'; // deployed contract address
const contract = new web3.eth.Contract(contractJSON.abi, contractAddress);

async function verifyAndPay() {
    const weatherData = fs.readFileSync('weather.txt', 'utf8').split('\n');
    const accounts = await web3.eth.getAccounts();

    const policies = await contract.methods.viewAllPolicies().call({ from: accounts[0] });

    for (const policy of policies) {
        const city = policy.departureCity.toLowerCase();
        const date = policy.flightDate;
        const searchKey = `${city},${date}`;

        if (weatherData.some(line => line.toLowerCase().includes(searchKey) && (line.includes('hail') || line.includes('flood')))) {
            console.log(`Flight delayed due to weather: ${searchKey}`);
            await contract.methods.markFlightDelayed(policy.passengerAddress).send({ from: accounts[0], gas: 200000 });
        }
    }
}

verifyAndPay();