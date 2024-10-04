// models/model.js

let models = []; // In-memory storage for models

// Function to create a new model
function createModel(name, description, owner) {
    const newModel = {
        id: models.length + 1,
        name,
        description,
        owner,
    };
    models.push(newModel);
    return newModel;
}

// Function to get all models
function getAllModels() {
    return models;
}

module.exports = {
    createModel,
    getAllModels,
};
