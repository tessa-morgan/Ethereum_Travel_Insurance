// Right click on the script name and hit "Run" to execute
(async () => {
    try {
        console.log('Running deployWithWeb3 script...')
        
        // const contractName = '1_Storage' // Change this for other contract
        const constructorArgs = ['0x5B38Da6a701c568545dCfcB03FcB875f56beddC4']    // Put constructor args (if any) here for your contract
        // As of 4/30 9:30 deployed at: 0xDA0bab807633f07f013f94DD0E6A4F96F8742B53

        // Note that the script needs the ABI which is generated from the compilation artifact.
        // Make sure contract is compiled and artifacts are generated
        const artifactsPath = `artifacts/FlightInsurance2.json` // Change this for different path

        const metadata = JSON.parse(await remix.call('fileManager', 'getFile', artifactsPath))
        const accounts = await web3.eth.getAccounts()
    
        let contract = new web3.eth.Contract(metadata.abi)
    
        contract = contract.deploy({
            data: metadata.data.bytecode.object,
            arguments: constructorArgs
        })
    
        const newContractInstance = await contract.send({
            from: accounts[0],
            gas: 15000000,
            gasPrice: '30000000000'
        })
        console.log('Contract deployed at address: ', newContractInstance.options.address)
    } catch (e) {
        console.log(e.message)
    }
  })()

