// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Reentrancy guard for protection
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract FlightInsurance2 is ReentrancyGuard {
    
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

    // Allows a passenger to purchase a policy and transfers premium
    function purchasePolicy(
        string calldata name,
        string calldata flightNo,
        string calldata date,
        string calldata departure,
        string calldata destination
    ) external payable nonReentrant returns (bool, string memory) {
        if (msg.sender == insuranceProvider) {
            return (false, "Invalid Caller: Insurance Provider");
        }
        if (policiesByAddress[msg.sender].passengerAddress != address(0)) {
            return (false, "Policy already exists for this address");
        }
        if (keccak256(bytes(departure)) == keccak256(bytes(destination))) {
            return (false, "Departure and destination cities cannot be the same");
        }
        if (msg.value < PREMIUM) {
            return (false, "Insufficient funds: Minimum 0.01 ETH required");
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

        return (true, "Policy successfully purchased");
    }

    // Allows a passenger to view their policy
    function viewMyPolicy() external view returns (InsurancePolicy memory, string memory) {
        InsurancePolicy memory policy = policiesByAddress[msg.sender];
        if (msg.sender == insuranceProvider) {
            return (policy, "Invalid Caller: Insurance Provider");
        }

        if (policy.passengerAddress == address(0)) {
            return (policy, "No policy found");
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

    // Pay indemnity to a passenger if their flight was verified as affected
    // Flow for Phase II: load weather.txt --> Provider views all plans --> 
    function payIndemnity(address passenger) external {
        require(msg.sender == insuranceProvider, "Only insurance provider can initiate payment");
        InsurancePolicy storage policy = policiesByAddress[passenger];
        require(policy.passengerAddress != address(0), "No policy found");
        require(keccak256(bytes(policy.policyStatus)) == keccak256("purchased"), "Indemnity already claimed");

        payable(passenger).transfer(INDEMNITY);
        policy.policyStatus = "claimed";
    }

    // Allow any caller to check their current balance
    function viewBalance() external view returns (uint256) {
        return msg.sender.balance;
    }


}