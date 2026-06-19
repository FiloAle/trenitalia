const payload = {
  departureLocationId: 830008409, // Milano
  arrivalLocationId: 830008217,   // Roma
  departureTime: "2026-06-19T08:00:00.000",
  adults: 1, children: 0,
  criteria: { frecceOnly: false, regionalOnly: false, intercityOnly: true, tourismOnly: false, noChanges: false, order: "DEPARTURE_DATE", offset: 0, limit: 10 },
  advancedSearchRequest: { bestFare: false, bikeFilter: false, forwardDiscountCodes: [] }
};

fetch("https://www.lefrecce.it/Channels.Website.BFF.WEB/website/ticket/solutions", {
  method: 'POST',
  headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Channel': '320', 'User-Agent': 'Mozilla/5.0' },
  body: JSON.stringify(payload)
}).then(res => res.json()).then(data => {
  if (data.solutions) {
    data.solutions.forEach(s => {
      s.solution.nodes.forEach(n => console.log(n.train.trainCategory, "|", n.train.acronym, "|", n.train.denomination));
    });
  } else console.log(data);
}).catch(console.error);
