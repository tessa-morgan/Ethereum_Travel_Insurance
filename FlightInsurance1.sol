// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Reentrancy guard for protection
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract FlightInsurance1 is ReentrancyGuard {
    
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
        string calldata fromCity,
        string calldata toCity
    ) external payable nonReentrant {
        require(msg.value == PREMIUM, "Incorrect premium: must be exactly 0.01 ETH");
        require(policiesByAddress[msg.sender].passengerAddress == address(0), "Policy already exists for this address");

        // Check that critical fields are not empty
        require(bytes(name).length > 0, "Passenger name is required");
        require(bytes(flightNo).length > 0, "Flight number is required");
        require(bytes(date).length > 0, "Flight date is required");
        require(bytes(fromCity).length > 0, "Departure city is required");
        require(bytes(toCity).length > 0, "Destination city is required");

        // Departure and destination must be different
        require(keccak256(bytes(fromCity)) != keccak256(bytes(toCity)), "Departure and destination cities cannot be the same");

        // Create a new policy
        policiesByAddress[msg.sender] = InsurancePolicy({
            passengerName: name,
            passengerAddress: msg.sender,
            flightNumber: flightNo,
            flightDate: date,
            departureCity: fromCity,
            destinationCity: toCity,
            policyStatus: "purchased"
        });

        // Track the passenger for provider use
        insuredPassengerList.push(msg.sender);

        // Transfer premium to the provider
        payable(insuranceProvider).transfer(msg.value);
    }

    // Allows a passenger to view their policy
    function viewMyPolicy() external view returns (InsurancePolicy memory) {
        require(policiesByAddress[msg.sender].passengerAddress != address(0), "No policy found");
        return policiesByAddress[msg.sender];
    }

    // Returns all purchased policies to the PROVIDER ONLY
    function viewAllPolicies() external view returns (InsurancePolicy[] memory) {
        // Ensure only the insurance provider can call this
        require(msg.sender == insuranceProvider, "Caller is not the insurance provider");

        InsurancePolicy[] memory allPolicies = new InsurancePolicy[](insuredPassengerList.length);
       
        for (uint256 i = 0; i < insuredPassengerList.length; i++) {
            allPolicies[i] = policiesByAddress[insuredPassengerList[i]];
        }
        return allPolicies;
    }
}