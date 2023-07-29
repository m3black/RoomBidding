// Function to fetch data from the GitHub Pages JSON file
async function fetchBidsData() {
    try {
        const response = await fetch('/bids_data.json');
        const bidsData = await response.json();
        return bidsData;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// Function to save data to the GitHub Pages JSON file
async function saveBidsData(bidsData) {
    try {
        const response = await fetch('/bids_data.json', {
            method: 'PUT', // Use the appropriate HTTP method here (PUT, POST, etc.)
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bidsData),
        });
        return response.ok;
    } catch (error) {
        console.error('Error saving data:', error);
        return false;
    }
}

// Initialize the bid data for each bedroom
let bedroom1Bids, bedroom2Bids, bedroom3Bids, bedroom4Bids;

// Run this function on page load to display the existing bids
window.onload = async function () {
    const bidsData = await fetchBidsData();
    if (bidsData) {
        bedroom1Bids = bidsData.bedroom1Bids;
        bedroom2Bids = bidsData.bedroom2Bids;
        bedroom3Bids = bidsData.bedroom3Bids;
        bedroom4Bids = bidsData.bedroom4Bids;
        updateTable("bedroom1", bedroom1Bids);
        updateTable("bedroom2", bedroom2Bids);
        updateTable("bedroom3", bedroom3Bids);
        updateTable("bedroom4", bedroom4Bids);
    } else {
        bedroom1Bids = [];
        bedroom2Bids = [];
        bedroom3Bids = [];
        bedroom4Bids = [];
    }
};

function submitBid(bedroom) {
    var bidInput = document.getElementById(bedroom + "-bid");
    var nameInput = document.getElementById(bedroom + "-name");
    var bid = bidInput.value;
    var name = nameInput.value;

    // Validate the bid input
    if (bid === "" || isNaN(parseFloat(bid))) {
        alert("Please enter a valid bid price.");
        return;
    }

    // Validate the name input
    if (name === "") {
        alert("Please enter your name.");
        return;
    }

    var currentBids;
    var highestBid = 0;

    // Get the current bid data for the respective bedroom
    switch (bedroom) {
        case "bedroom1":
            currentBids = bedroom1Bids;
            break;
        case "bedroom2":
            currentBids = bedroom2Bids;
            break;
        case "bedroom3":
            currentBids = bedroom3Bids;
            break;
        case "bedroom4":
            currentBids = bedroom4Bids;
            break;
        default:
            return;
    }

    // Find the highest bid in the current bid data
    currentBids.forEach(function (bid) {
        if (bid.bid > highestBid) {
            highestBid = bid.bid;
        }
    });

    // Check if the new bid is at least $10 higher than the highest bid
    if (parseFloat(bid) <= highestBid + 10) {
        alert("Please enter a bid that is at least $10 higher than the current highest bid.");
        return;
    }

    // Update the bid data for the respective bedroom
    currentBids.push({ name: name, bid: parseFloat(bid) });
    updateTable(bedroom, currentBids);

    // Clear the input fields after submission
    bidInput.value = "";
    nameInput.value = "";

    // Save the bid data to GitHub Pages JSON file
    saveBidsData({
        bedroom1Bids,
        bedroom2Bids,
        bedroom3Bids,
        bedroom4Bids,
    });
}

function resetBids() {
    // Clear the bid data for each bedroom
    bedroom1Bids = [];
    bedroom2Bids = [];
    bedroom3Bids = [];
    bedroom4Bids = [];

    // Clear the tables
    var tables = document.querySelectorAll("table");
    tables.forEach(function (table) {
        table.innerHTML = "";
    });

    // Save the updated bid data to GitHub Pages JSON file
    saveBidsData({
        bedroom1Bids,
        bedroom2Bids,
        bedroom3Bids,
        bedroom4Bids,
    });
}

function removeBid(bedroom, index) {
    var password = prompt("Enter password to remove bid:");
    if (password === "your_password") {
        var currentBids;

        // Get the current bid data for the respective bedroom
        switch (bedroom) {
            case "bedroom1":
                currentBids = bedroom1Bids;
                break;
            case "bedroom2":
                currentBids = bedroom2Bids;
                break;
            case "bedroom3":
                currentBids = bedroom3Bids;
                break;
            case "bedroom4":
                currentBids = bedroom4Bids;
                break;
            default:
                return;
        }

        // Remove the bid from the current bid data
        currentBids.splice(index, 1);
        updateTable(bedroom, currentBids);

        // Save the updated bid data to GitHub Pages JSON file
        saveBidsData({
            bedroom1Bids,
            bedroom2Bids,
            bedroom3Bids,
            bedroom4Bids,
        });
    } else {
        alert("Incorrect password. Bid removal canceled.");
    }
}


// Your existing updateTable function remains the same.
function updateTable(bedroom, bids) {
    var table = document.getElementById(bedroom + "-table");

    // Clear the table body before updating
    table.innerHTML = "";

    // Sort the bids in descending order based on bid price
    bids.sort(function (a, b) {
        return b.bid - a.bid;
    });

    // Add each bid as a row in the table
    bids.forEach(function (bid, index) {
        var row = document.createElement("tr");
        var nameCell = document.createElement("td");
        var bidCell = document.createElement("td");
        var removeCell = document.createElement("td");
        var removeButton = document.createElement("button");

        nameCell.textContent = bid.name;
        bidCell.textContent = "$" + bid.bid.toFixed(2);

        removeButton.textContent = "Remove";
        removeButton.addEventListener("click", function () {
            removeBid(bedroom, index);
        });

        removeCell.appendChild(removeButton);

        row.appendChild(nameCell);
        row.appendChild(bidCell);
        row.appendChild(removeCell);
        table.appendChild(row);
    });
}