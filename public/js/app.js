// public/js/app.js

const contractAddress = '0x130de89b847b67a8166a6a149dd4628da960b198'; // Replace with your deployed contract address on Ganache

const abi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "modelId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "creator",
                "type": "address"
            }
        ],
        "name": "ModelCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "modelId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "ModelPurchased",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "modelId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "rater",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint8",
                "name": "rating",
                "type": "uint8"
            }
        ],
        "name": "ModelRated",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "getModelCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "modelId",
                "type": "uint256"
            }
        ],
        "name": "getModelDetails",
        "outputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "creator",
                "type": "address"
            },
            {
                "internalType": "uint8",
                "name": "ratingCount",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "averageRating",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            }
        ],
        "name": "listModel",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "models",
        "outputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "creator",
                "type": "address"
            },
            {
                "internalType": "uint8",
                "name": "ratingCount",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "totalRating",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "modelId",
                "type": "uint256"
            }
        ],
        "name": "purchaseModel",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "modelId",
                "type": "uint256"
            },
            {
                "internalType": "uint8",
                "name": "rating",
                "type": "uint8"
            }
        ],
        "name": "rateModel",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdrawFunds",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

let web3;
let contract;
let userAccount;

// Initialize web3 and contract



async function init() {
    if (window.ethereum) {
        try {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            web3 = new Web3(window.ethereum);
        } catch (error) {
            console.error("User denied account access", error);
            alert('Please allow access to MetaMask to use this app');
            return;
        }
    } else if (window.web3) {
        // Legacy dapp browsers...
        web3 = new Web3(window.web3.currentProvider);
    } else {
        // Non-dapp browsers...
        alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
        // Fallback to Ganache
        web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
    }

    contract = new web3.eth.Contract(abi, contractAddress);

    // Get user account
    const accounts = await web3.eth.getAccounts();
    userAccount = accounts[0];
    console.log("Connected account:", userAccount);

    // Listen for ModelCreated events
    contract.events.ModelCreated({}, (error, event) => {
        if (error) {
            console.error('Error on ModelCreated event', error);
        } else {
            console.log('New model created:', event.returnValues);
            loadModels(); // Reload models when a new model is created
        }
    });

    loadModels(); // Load available models on initialization
}

// Function to list a new AI model
async function listModel(event) {
    event.preventDefault(); // Prevent form from submitting

    const name = document.getElementById('createModelName').value;
    const description = document.getElementById('createModelDescription').value;
    const priceInEth = document.getElementById('createModelPrice').value;

    if (!name || !description || !priceInEth) {
        alert("Please fill in all fields.");
        return;
    }

    const price = web3.utils.toWei(priceInEth, 'ether');

    try {
        await contract.methods.listModel(name, description, price).send({ from: userAccount });
        alert('Model listed successfully!');
        document.getElementById('createModelForm').reset();
        // loadModels(); // Automatically called via event listener
    } catch (error) {
        console.error('Error listing model:', error);
        alert('Error listing model. See console for details.');
    }
}

// Function to load available models
async function loadModels() {
    const modelListDiv = document.getElementById('modelList');
    modelListDiv.innerHTML = ''; // Clear existing models

    try {
        const modelCount = await contract.methods.getModelCount().call();
        console.log("Total models:", modelCount);

        for (let i = 0; i < modelCount; i++) {
            const model = await contract.methods.models(i).call();
            const averageRating = model.ratingCount > 0 ? (model.totalRating / model.ratingCount).toFixed(2) : 0;
            const modelElement = document.createElement('div');
            modelElement.className = 'model-item';
            modelElement.innerHTML = `
                <h3>${model.name}</h3>
                <p>${model.description}</p>
                <p><strong>Price:</strong> ${web3.utils.fromWei(model.price, 'ether')} ETH</p>
                <p><strong>Creator:</strong> ${model.creator}</p>
                <p><strong>Rating Count:</strong> ${model.ratingCount}</p>
                <p><strong>Average Rating:</strong> ${averageRating}</p>
                <button onclick="purchaseModel(${i}, '${web3.utils.fromWei(model.price, 'ether')}')">Purchase</button>
                <button onclick="rateModelPrompt(${i})">Rate Model</button>
                <button onclick="viewModelDetails(${i})">View Details</button>
            `;
            modelListDiv.appendChild(modelElement);
        }
    } catch (error) {
        console.error('Error loading models:', error);
        alert('Error loading models. See console for details.');
    }
}

// Function to purchase a model
async function purchaseModel(modelId, price) {
    const confirmed = confirm(`Are you sure you want to purchase this model for ${price} ETH?`);
    if (!confirmed) return;

    try {
        await contract.methods.purchaseModel(modelId).send({
            from: userAccount,
            value: web3.utils.toWei(price, 'ether')
        });
        alert('Model purchased successfully!');
        loadModels(); // Reload models after purchase
    } catch (error) {
        console.error('Error purchasing model:', error);
        alert('Error purchasing model. See console for details.');
    }
}

// Function to prompt for rating
function rateModelPrompt(modelId) {
    const rating = prompt('Rate this model (1-5):');
    if (rating < 1 || rating > 5) {
        alert('Please enter a valid rating between 1 and 5.');
        return;
    }
    rateModel(modelId, rating);
}

// Function to rate a model
async function rateModel(modelId, rating) {
    try {
        await contract.methods.rateModel(modelId, rating).send({ from: userAccount });
        alert('Model rated successfully!');
        loadModels(); // Reload models after rating
    } catch (error) {
        console.error('Error rating model:', error);
        alert('Error rating model. See console for details.');
    }
}

// Function to view model details in a modal
async function viewModelDetails(modelId) {
    try {
        const modelDetails = await contract.methods.getModelDetails(modelId).call();
        const [name, description, price, creator, ratingCount, totalRating] = modelDetails;
        const averageRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(2) : 0;

        const modelInfo = `
            <h3>${name}</h3>
            <p>${description}</p>
            <p><strong>Price:</strong> ${web3.utils.fromWei(price, 'ether')} ETH</p>
            <p><strong>Creator:</strong> ${creator}</p>
            <p><strong>Rating Count:</strong> ${ratingCount}</p>
            <p><strong>Average Rating:</strong> ${averageRating}</p>
        `;
        
        // Create a modal to display model details
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-btn" onclick="closeModal()">&times;</span>
                ${modelInfo}
            </div>
        `;
        document.body.appendChild(modal);
    } catch (error) {
        console.error('Error fetching model details:', error);
        alert('Error fetching model details. See console for details.');
    }
}

// Function to close the modal
function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        document.body.removeChild(modal);
    }
}

// Initialize the application when the window loads
window.onload = init;

// Set up event listeners for form submission
document.getElementById('createModelForm').addEventListener('submit', listModel);
