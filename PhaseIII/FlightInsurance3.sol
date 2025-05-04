// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract FlightInsurance3 {
    
    // Struct storing insurance policy details
    struct InsurancePolicy {
        string passengerName;
        address passengerAddress;
        string flightNumber;
        string flightDate;
        string departureCity;
        string destinationCity;
        string policyStatus; // "purchased" or "claimed"
    }

    // Fixed premium and indemnity values
    uint256 public constant PREMIUM = 0.01 ether;
    uint256 public constant INDEMNITY = 0.02 ether;

    address public insuranceProvider;

    // Mapping to store one policy per passenger address
    mapping(address => InsurancePolicy) private policiesByAddress;

    // Array to track all passengers for the insurance provider to review
    address[] private insuredPassengerList;

    // Set the insurance provider at contract deployment
    constructor(address _insuranceProvider) {
        insuranceProvider = _insuranceProvider;
    }

    // Returns static policy details to passenger
    function viewAvailablePolicy() external pure returns (string memory) {
        return "Premium: 0.01 ETH, Indemnity: 0.02 ETH, Coverage: Extreme Weather Delays (e.g., hail, flooding, etc.).";
    }

    // Allows a passenger to purchase a policy then transfers premium if valid
    // If same customer calls multiple times, only first considered valid
    function purchasePolicy(
        string calldata name,
        string calldata flightNo,
        string calldata date,
        string calldata departure,
        string calldata destination
    ) external payable returns (string memory) {
        if (bytes(name).length == 0 || bytes(name).length > 64) {
            revert("Invalid name: Must be a non-empty string");
        }

        if (bytes(flightNo).length < 2 || bytes(flightNo).length > 6) {
            revert("Invalid flight number: Must be 2 to 6 characters");
        }

        // if (bytes(departure).length != 3 || bytes(destination).length != 3) {
        //     return (false, "Invalid city code: Must be 3 characters (e.g., JFK)");
        // }

        if (keccak256(bytes(departure)) == keccak256(bytes(destination))) {
            revert("Departure and destination cities cannot be the same");
        }

        if (bytes(date).length != 10 || 
            bytes(date)[4] != "-" || 
            bytes(date)[7] != "-") {
            revert("Invalid date format: Must be YYYY-MM-DD");
        }

        if (msg.value < PREMIUM) {
            revert("Insufficient funds: Minimum 0.01 ETH required");
        }

        if (policiesByAddress[msg.sender].passengerAddress != address(0)) {
            revert("Policy already exists for this address");
        }

        // Create and store the policy
        policiesByAddress[msg.sender] = InsurancePolicy({
            passengerName: name,
            passengerAddress: msg.sender,
            flightNumber: flightNo,
            flightDate: date,
            departureCity: departure,
            destinationCity: destination,
            policyStatus: "purchased"
        });

        // Track the passenger for provider use
        insuredPassengerList.push(msg.sender);

        // Transfer premium to the provider
        payable(insuranceProvider).transfer(PREMIUM);

        if (msg.sender == insuranceProvider) {
            return ("Insurance Provider: Policy successfully purchased");
        }

        return ("Policy successfully purchased");
    }

    // Allows a passenger to view their policy
    function viewMyPolicy() external view returns (InsurancePolicy memory, string memory) {
        InsurancePolicy memory policy = policiesByAddress[msg.sender];
        if (policy.passengerAddress == address(0)) {
            return (policy, "No policy found");
        }

        if (msg.sender == insuranceProvider) {
            return (policy, "Insurance Provider: Policy retrieved successfully");
        }

        return (policy, "Policy retrieved successfully");
    }

    // Returns all purchased policies to the PROVIDER ONLY
    function viewAllPolicies() external view returns (InsurancePolicy[] memory, string memory) {
        // If the caller is not the insurance provider, return an empty array and a message
        if (msg.sender != insuranceProvider) {
            InsurancePolicy[] memory empty;
            return (empty, "Caller must be insurance provider");
        }

        InsurancePolicy[] memory allPolicies = new InsurancePolicy[](insuredPassengerList.length);
        for (uint256 i = 0; i < insuredPassengerList.length; i++) {
            allPolicies[i] = policiesByAddress[insuredPassengerList[i]];
        }
        return (allPolicies, "All policies retrieved successfully");
    }

    // Allow any caller to check their current balance
    function viewBalance() external view returns (uint256) {
        return msg.sender.balance;
    }

    // Pay indemnity to a passenger if their flight was verified as affected
    function payIndemnity(address passenger) external payable returns (bool, string memory) {
        if (msg.sender != insuranceProvider) {
            return (false, "Only insurance provider can initiate payment");
        }

        if (passenger == address(0)) {
            return (false, "Invalid address");
        }

        if (msg.value < INDEMNITY) {
            return (false, "Insufficient funds provider: Minimum 0.02 ETH required");
        }

        InsurancePolicy storage policy = policiesByAddress[passenger];
        if (policy.passengerAddress == address(0)) {
            return (false, "No policy found");
        }

        if (keccak256(bytes(policy.policyStatus)) != keccak256("purchased")) {
            return (false, "Indemnity already claimed");
        }

        payable(passenger).transfer(INDEMNITY);
        policy.policyStatus = "claimed";
        return (true, "Indemnity successfully paid");
    }

}