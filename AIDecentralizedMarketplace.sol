// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AIDecentralizedMarketplace {
    struct Model {
        string name;
        string description;
        uint256 price;
        address creator;
        uint8 ratingCount;
        uint256 totalRating;
    }

    Model[] public models;
    address public owner;

    // Event emitted when a new model is created
    event ModelCreated(uint256 modelId, string name, address creator);

    // Event emitted when a model is purchased
    event ModelPurchased(uint256 modelId, address buyer, uint256 amount);

    // Event emitted when a model is rated
    event ModelRated(uint256 modelId, address rater, uint8 rating);

    constructor() {
        owner = msg.sender;
    }

    // Function to list a new AI model
    function listModel(string memory name, string memory description, uint256 price) public {
        require(price > 0, "Price must be greater than zero.");
        models.push(Model(name, description, price, msg.sender, 0, 0));
        emit ModelCreated(models.length - 1, name, msg.sender);
    }

    // Function to purchase a model
    function purchaseModel(uint256 modelId) public payable {
        require(modelId < models.length, "Model does not exist.");
        Model storage model = models[modelId];
        require(msg.value == model.price, "Incorrect price.");
        payable(model.creator).transfer(msg.value);
        emit ModelPurchased(modelId, msg.sender, msg.value);
    }

    // Function to rate a model
    function rateModel(uint256 modelId, uint8 rating) public {
        require(modelId < models.length, "Model does not exist.");
        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5.");
        Model storage model = models[modelId];
        model.ratingCount++;
        model.totalRating += rating;
        emit ModelRated(modelId, msg.sender, rating);
    }

    // Function to withdraw funds (only owner)
    function withdrawFunds() public {
        require(msg.sender == owner, "Only owner can withdraw funds.");
        payable(owner).transfer(address(this).balance);
    }

    // Function to get model details
    function getModelDetails(uint256 modelId) public view returns (
        string memory name,
        string memory description,
        uint256 price,
        address creator,
        uint8 ratingCount,
        uint256 averageRating
    ) {
        require(modelId < models.length, "Model does not exist.");
        Model storage model = models[modelId];
        uint256 avgRating = model.ratingCount > 0 ? model.totalRating / model.ratingCount : 0;
        return (
            model.name,
            model.description,
            model.price,
            model.creator,
            model.ratingCount,
            avgRating
        );
    }

    // Function to get the total number of models
    function getModelCount() public view returns (uint256) {
        return models.length;
    }
}
