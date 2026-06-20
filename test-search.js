const fetch = require('node-fetch');

async function search() {
    const url = "https://www.lefrecce.it/Channels.Website.BFF.WEB/website/ticket/solutions";
    const requestBody = {
        "departureLocationId": 830008349, // Rimini
        "arrivalLocationId": 830008340, // Cattolica
        "departureTime": new Date().toISOString().split('T')[0] + "T08:00:00.000Z",
        "adults": 1,
        "children": 0,
        "criteria": {
            "frecceOnly": false,
            "regionalOnly": false,
            "intercityOnly": false,
            "noChanges": false,
            "order": "DEPARTURE_DATE",
            "limit": 10,
            "offset": 0
        },
        "advancedSearchRequest": {
            "bestFare": false,
            "selectedOfferName": "Ordinaria"
        }
    };

    const resp = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Channel": "320"
        },
        body: JSON.stringify(requestBody)
    });
    
    const data = await resp.json();
    console.log(data);
}
search();
