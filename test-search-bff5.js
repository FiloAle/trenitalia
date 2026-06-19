const fromId = 830008409; // Milano
const toId = 830008217;   // Roma
const departureTime = "2026-06-19T08:00:00.000";

const payload = {
  departureLocationId: fromId,
  arrivalLocationId: toId,
  departureTime: departureTime,
  adults: 1,
  children: 0,
  criteria: {
    frecceOnly: false,
    regionalOnly: false,
    intercityOnly: false,
    tourismOnly: false,
    noChanges: false,
    order: "DEPARTURE_DATE",
    offset: 0,
    limit: 1
  },
  advancedSearchRequest: { bestFare: false, bikeFilter: false, forwardDiscountCodes: [] }
};

fetch("https://www.lefrecce.it/Channels.Website.BFF.WEB/website/ticket/solutions", {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Channel': '320',
    'User-Agent': 'Mozilla/5.0'
  },
  body: JSON.stringify(payload)
}).then(res => res.json()).then(data => {
  const item = data.solutions[0];
  console.log("Nodes length:", item.solution.nodes.length);
  console.log("Grids length:", item.grids ? item.grids.length : 0);
}).catch(console.error);
