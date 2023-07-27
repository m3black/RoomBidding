<script>
    // Store the bid data for each bedroom
    var bedroom1Bids = [];
    var bedroom2Bids = [];
    var bedroom3Bids = [];
    var bedroom4Bids = [];

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

        // Update the bid data for the respective bedroom
        switch (bedroom) {
            case "bedroom1":
                bedroom1Bids.push({ name: name, bid: parseFloat(bid) });
                updateChart("bedroom1", bedroom1Bids);
                break;
            case "bedroom2":
                bedroom2Bids.push({ name: name, bid: parseFloat(bid) });
                updateChart("bedroom2", bedroom2Bids);
                break;
            case "bedroom3":
                bedroom3Bids.push({ name: name, bid: parseFloat(bid) });
                updateChart("bedroom3", bedroom3Bids);
                break;
            case "bedroom4":
                bedroom4Bids.push({ name: name, bid: parseFloat(bid) });
                updateChart("bedroom4", bedroom4Bids);
                break;
            default:
                return;
        }

        // Clear the input fields after submission
        bidInput.value = "";
        nameInput.value = "";
    }

    // Update the chart for a specific bedroom
    function updateChart(bedroom, bids) {
        var chartDiv = document.getElementById(bedroom + "-chart");

        // Clear the chart before updating
        chartDiv.innerHTML = "";

        // Sort the bids in descending order based on bid price
        bids.sort(function (a, b) {
            return b.bid - a.bid;
        });

        // Display the bids in the chart
        bids.forEach(function (bid) {
            var bidEntry = document.createElement("div");
            bidEntry.textContent = bid.name + ": $" + bid.bid.toFixed(2);
            chartDiv.appendChild(bidEntry);
        });

        // Determine the highest bid and display the winner
        if (bids.length > 0) {
            var highestBid = bids[0];
            var winnerLabel = document.createElement("div");
            winnerLabel.textContent = "Winner: " + highestBid.name + " ($" + highestBid.bid.toFixed(2) + ")";
            chartDiv.appendChild(winnerLabel);
        }
    }
</script>
