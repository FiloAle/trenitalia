const fromId = 830008409; // Milano
const toId = 830005043;   // Cervia
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
    limit: 5
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
  data.solutions.forEach(s => {
     console.log("Status:", s.solution.status, "Message:", s.solution.messages ? s.solution.messages.map(m => m.description).join(" ") : "none");
     console.log("Price:", s.solution.price ? s.solution.price.amount : "null");
  });
}).catch(console.error);
