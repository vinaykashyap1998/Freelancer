// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract Freelancer {
    struct Project {
        uint256 id;
        address client;
        address freelancer;
        uint256 totalAmount;
        string title;
        bool isCompleted;
        uint256 createdAt;
    }

    struct Milestone {
        uint256 id;
        uint256 projectId;
        string description;
        uint256 amount;
        bool isApproved;
        bool isPaid;
        bool isSubmitted;
    }

    // New: mapping for milestone submissions (IPFS hashes / URLs)
    mapping(uint256 => string) public milestoneSubmissions;

    mapping(uint256 => Project) public projects;
    mapping(uint256 => Milestone) public milestones;
    mapping(address => uint256[]) public userProjects;
    mapping(uint256 => uint256[]) public projectMilestones;

    uint256 public projectCounter;
    uint256 public milestoneCounter;
    address public owner;
    uint256 public platformFeePercentage = 250; // 2.5%

    // Events
    event ProjectCreated(uint256 indexed projectId, address indexed client, address indexed freelancer, uint256 totalAmount);
    event MilestoneCreated(uint256 indexed milestoneId, uint256 indexed projectId, uint256 amount);
    event MilestoneSubmitted(uint256 indexed milestoneId, uint256 indexed projectId, string submissionHash);
    event MilestoneApproved(uint256 indexed milestoneId, uint256 indexed projectId);
    event PaymentReleased(uint256 indexed milestoneId, uint256 indexed projectId, uint256 amount);
    event ProjectCompleted(uint256 indexed projectId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyProjectParticipant(uint256 _projectId) {
        require(
            msg.sender == projects[_projectId].client ||
            msg.sender == projects[_projectId].freelancer,
            "Only project participants can call this function"
        );
        _;
    }

    modifier projectExists(uint256 _projectId) {
        require(projects[_projectId].id != 0, "Project does not exist");
        _;
    }

    modifier milestoneExists(uint256 _milestoneId) {
        require(milestones[_milestoneId].id != 0, "Milestone does not exist");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // ------------------------------
    // 1️⃣ Create Project
    // ------------------------------
    function createProject(
        address _freelancer,
        uint256 _totalAmount,
        string memory _title
    ) external payable {
        require(_freelancer != address(0), "Invalid freelancer address");
        require(_freelancer != msg.sender, "Client and freelancer cannot be the same");
        require(_totalAmount > 0, "Total amount must be greater than 0");
        require(msg.value >= _totalAmount, "Insufficient payment for project");

        projectCounter++;
        projects[projectCounter] = Project({
            id: projectCounter,
            client: msg.sender,
            freelancer: _freelancer,
            totalAmount: _totalAmount,
            title: _title,
            isCompleted: false,
            createdAt: block.timestamp
        });

        userProjects[msg.sender].push(projectCounter);
        userProjects[_freelancer].push(projectCounter);

        emit ProjectCreated(projectCounter, msg.sender, _freelancer, _totalAmount);
    }

   
    //  Create Milestone
    
    function createMilestone(
        uint256 _projectId,
        string memory _description,
        uint256 _amount
    ) external onlyProjectParticipant(_projectId) projectExists(_projectId) {
        Project storage project = projects[_projectId];
        require(!project.isCompleted, "Project is completed");
        require(msg.sender == project.client, "Only client can create milestones");
        require(_amount > 0, "Milestone amount must be greater than 0");

        // ✅ Enforce total milestone amount <= project total
        uint256 totalMilestoneAmount = 0;
        uint256[] storage mIds = projectMilestones[_projectId];
        for (uint256 i = 0; i < mIds.length; i++) {
            totalMilestoneAmount += milestones[mIds[i]].amount;
        }
        require(totalMilestoneAmount + _amount <= project.totalAmount, "Milestones exceed total amount");

        milestoneCounter++;
        milestones[milestoneCounter] = Milestone({
            id: milestoneCounter,
            projectId: _projectId,
            description: _description,
            amount: _amount,
            isApproved: false,
            isPaid: false,
            isSubmitted: false
        });

        projectMilestones[_projectId].push(milestoneCounter);

        emit MilestoneCreated(milestoneCounter, _projectId, _amount);
    }

    // ------------------------------
    // 3️⃣ Freelancer submits milestone
    // ------------------------------
    function submitMilestone(uint256 _milestoneId, string memory _submissionHash)
        external
        milestoneExists(_milestoneId)
    {
        Milestone storage milestone = milestones[_milestoneId];
        Project storage project = projects[milestone.projectId];

       
        require(!milestone.isApproved, "Milestone already approved");
        require(!milestone.isPaid, "Milestone already paid");
        require(!milestone.isSubmitted, "Already submitted");

        milestone.isSubmitted = true;
        milestoneSubmissions[_milestoneId] = _submissionHash;

        emit MilestoneSubmitted(_milestoneId, milestone.projectId, _submissionHash);
    }

    // ------------------------------
    // 4️⃣ Client approves milestone
    // ------------------------------
    function approveMilestone(uint256 _milestoneId)
        external
        milestoneExists(_milestoneId)
    {
        Milestone storage milestone = milestones[_milestoneId];
        Project storage project = projects[milestone.projectId];

       
        require(milestone.isSubmitted, "Milestone not submitted yet");
        require(!milestone.isApproved, "Milestone already approved");
        require(!milestone.isPaid, "Milestone already paid");

        milestone.isApproved = true;
        emit MilestoneApproved(_milestoneId, milestone.projectId);

        _releasePayment(_milestoneId);
    }

    // ------------------------------
    // 5️⃣ Payment Release
    // ------------------------------
    function _releasePayment(uint256 _milestoneId) internal {
        Milestone storage milestone = milestones[_milestoneId];
        Project storage project = projects[milestone.projectId];

        require(milestone.isApproved, "Milestone not approved");
        require(!milestone.isPaid, "Already paid");

        milestone.isPaid = true;

        uint256 platformFee = (milestone.amount * platformFeePercentage) / 10000;
        uint256 freelancerAmount = milestone.amount - platformFee;

        payable(project.freelancer).transfer(freelancerAmount);
        if (platformFee > 0) payable(owner).transfer(platformFee);

        emit PaymentReleased(_milestoneId, milestone.projectId, freelancerAmount);

        // Check if all milestones paid
        bool allPaid = true;
        uint256[] memory mIds = projectMilestones[milestone.projectId];
        for (uint256 i = 0; i < mIds.length; i++) {
            if (!milestones[mIds[i]].isPaid) {
                allPaid = false;
                break;
            }
        }

        if (allPaid) {
            project.isCompleted = true;
            emit ProjectCompleted(milestone.projectId);
        }
    }

    // ------------------------------
    // 6️⃣ View Functions
    // ------------------------------
    function getProject(uint256 _projectId) external view projectExists(_projectId) returns (
        uint256 id,
        address client,
        address freelancer,
        uint256 totalAmount,
        string memory title,
        bool isCompleted,
        uint256 createdAt
    ) {
        Project memory project = projects[_projectId];
        return (
            project.id,
            project.client,
            project.freelancer,
            project.totalAmount,
            project.title,
            project.isCompleted,
            project.createdAt
        );
    }

    function getMilestone(uint256 _milestoneId) external view milestoneExists(_milestoneId) returns (
        uint256 id,
        uint256 projectId,
        string memory description,
        uint256 amount,
        bool isApproved,
        bool isPaid,
        bool isSubmitted
    ) {
        Milestone memory milestone = milestones[_milestoneId];
        return (
            milestone.id,
            milestone.projectId,
            milestone.description,
            milestone.amount,
            milestone.isApproved,
            milestone.isPaid,
            milestone.isSubmitted
        );
    }

    function getUserProjects(address _user) external view returns (uint256[] memory) {
        return userProjects[_user];
    }

    function getProjectMilestones(uint256 _projectId) external view projectExists(_projectId) returns (uint256[] memory) {
        return projectMilestones[_projectId];
    }

    // ------------------------------
    // 7️⃣ Admin Utilities
    // ------------------------------
    function updatePlatformFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 1000, "Fee cannot exceed 10%");
        platformFeePercentage = _newFee;
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
