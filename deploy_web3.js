// deploy_web3.js
const Web3 = require("web3").default;
const fs = require("fs");

// Connect to local Ganache instance
const web3 = new Web3("http://127.0.0.1:7545");  // default Ganache RPC

async function main() {
    console.log("Running deployWithWeb3 script...");

    const accounts = await web3.eth.getAccounts();
    const deployer = accounts[0];
    console.log("Deploying from account:", deployer);

    // Load ABI and Bytecode
    const artifact = JSON.parse(fs.readFileSync("artifacts/FlightInsurance2.json", "utf8"));
    const abi = artifact.abi;
    const bytecode = artifact.bytecode;

    if (!bytecode || bytecode === "0x") {
        throw new Error("Bytecode is empty — did you compile the contract?");
    }

    const contract = new web3.eth.Contract(abi);

    const deployedContract = await contract
        .deploy({ data: bytecode })
        .send({ from: deployer, gas: 5000000 });

    console.log("Contract deployed to:", deployedContract.options.address);

    // Save the address for later use
    fs.writeFileSync("deployed_address.txt", deployedContract.options.address);
    console.log("Saved deployed address to deployed_address.txt");
}

main().catch(err => {
    console.error("Deployment failed:", err.message);
});