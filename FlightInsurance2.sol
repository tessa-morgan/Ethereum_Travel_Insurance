// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract FlightInsurance1 is ReentrancyGuard {
    // Struct for storing insurance policy details
    struct InsurancePolicy {
        string passengerName;
        address passengerAddress;
        string flightNumber;
        string flightDate;
        string departureCity;
        string destinationCity;
        string policyStatus; // "purchased" or "claimed"
    }

    uint256 public constant PREMIUM = 0.01 ether;
    uint256 public constant INDEMNITY = 0.02 ether;

    address public insuranceProvider;

    mapping(address => InsurancePolicy) private policiesByAddress;
    address[] private insuredPassengerList;

    modifier onlyInsuranceProvider() {
        require(msg.sender == insuranceProvider, "Caller is not the insurance provider");
        _;
    }

    constructor(address _insuranceProvider) {
        insuranceProvider = _insuranceProvider;
    }

    // Returns static policy details
    function viewAvailablePolicy() external pure returns (string memory) {
        return "Premium: 0.01 ETH, Indemnity: 0.02 ETH, Coverage: Hail and flood delays.";
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

        policiesByAddress[msg.sender] = InsurancePolicy({
            passengerName: name,
            passengerAddress: msg.sender,
            flightNumber: flightNo,
            flightDate: date,
            departureCity: fromCity,
            destinationCity: toCity,
            policyStatus: "purchased"
        });

        insuredPassengerList.push(msg.sender);

        payable(insuranceProvider).transfer(msg.value);
    }

    // Allows a passenger to view their policy
    function viewMyPolicy() external view returns (InsurancePolicy memory) {
        require(policiesByAddress[msg.sender].passengerAddress != address(0), "No policy found");
        return policiesByAddress[msg.sender];
    }

    // Returns all purchased policies to the provider only
    function viewAllPolicies() external view onlyInsuranceProvider returns (InsurancePolicy[] memory) {
        InsurancePolicy[] memory allPolicies = new InsurancePolicy[](insuredPassengerList.length);
        for (uint256 i = 0; i < insuredPassengerList.length; i++) {
            allPolicies[i] = policiesByAddress[insuredPassengerList[i]];
        }
        return allPolicies;
    }

    // Optional: Allows insurance claim functionality to be added later
    function claimInsurance() external {
        // Logic to validate claim and transfer indemnity to passenger
        // e.g., check weather condition, date, flight number, etc.
        // Only payable if policyStatus is "purchased"
    }
}