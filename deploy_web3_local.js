const Web3 = require('web3');
const fs = require('fs');

const providerURL = 'http://127.0.0.1:7545';
const insuranceProvider = '0x89b8DEF9aEDeE85A9651a22baad88EE7DfdF25C9'; // Ganache address

const web3 = new Web3(providerURL);

(async () => {
    try {
        console.log('Deploying to local Ganache...');

        const artifactsPath = './artifacts/FlightInsurance2.json';
        const metadata = JSON.parse(fs.readFileSync(artifactsPath, 'utf8'));

        const accounts = await web3.eth.getAccounts();

        const contract = new web3.eth.Contract(metadata.abi);

        const deployed = await contract.deploy({
            data: metadata.data.bytecode.object,
            arguments: [insuranceProvider]
        }).send({
            from: accounts[0],
            gas: 2000000,
            gasPrice: '30000000000'
        });

        console.log('✅ Contract deployed at:', deployed.options.address);
    } catch (err) {
        console.error('Deployment failed:', err.message);
    }
})();