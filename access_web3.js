// access_web3.js - Interact with deployed FlightInsurance2 contract
const fs = require("fs");
const Web3 = require("web3");

// Set this to match your Ganache (or testnet) RPC endpoint
const web3 = new Web3("http://localhost:8545");  // or your Infura URL

async function main() {
  const accounts = await web3.eth.getAccounts();
  const user = accounts[0];

  // Load ABI and deployed address
  const artifact = JSON.parse(fs.readFileSync("FlightInsurance2.json", "utf8"));
  const abi = artifact.abi;
  const contractAddress = "<YOUR_DEPLOYED_CONTRACT_ADDRESS>"; // replace this!

  const contract = new web3.eth.Contract(abi, contractAddress);

  // Read and parse weather.txt
  const weatherLines = fs.readFileSync("weather.txt", "utf8").trim().split("\n").slice(1); // skip header

  for (const line of weatherLines) {
    const [dateStr, city, weather] = line.trim().split(/\s+/);

    // Convert date to UNIX timestamp (e.g., 2023-04-15 => 1681516800)
    const timestamp = Math.floor(new Date(dateStr).getTime() / 1000);

    try {
      const result = await contract.methods.verify(
        "FL123", // dummy flight (you can change this to real logic)
        timestamp,
        city,
        weather
      ).call({ from: user });

      console.log(`Flight on ${dateStr} in ${city} with weather ${weather}:`, result ? "Payable" : "Not Payable");
    } catch (err) {
      console.error(`Error on ${dateStr}, ${city}: ${err.message}`);
    }
  }
}

main().catch(console.error);