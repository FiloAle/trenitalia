const { encode } = require('base-64');

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

async function search() {
  const date = new Date();
  const Y = date.getFullYear().toString();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  const H = date.getHours().toString().padStart(2, '0');
  const i = date.getMinutes().toString().padStart(2, '0');

  const uuid = generateUUID();
  const userPartial = `${uuid}*do*f*it`;
  const extraPartial = `*A1`;
  const payload = ['Milano Centrale', 'Napoli Centrale', Y, m, d, H, i, userPartial, extraPartial].join('|');
  const utf8Payload = unescape(encodeURIComponent(payload));
  let encoded = encode(utf8Payload).replace(/=/g, '').split('').reverse().join('') + 'W';
  
  const url = `https://trenit.app/v1/grx?r=${encoded}`;
  
  const response = await fetch(url, { headers: { 'Accept': 'application/json' } });
  const data = await response.json();
  
  if (data.data && data.data.routes) {
    const multiLegRoute = data.data.routes.find(r => r.l && r.l.length > 1 && r.tk && r.tk.length > 0);
    if (multiLegRoute) {
       console.log("Found multi-leg route:", multiLegRoute.ns);
       console.log("Legs:", multiLegRoute.l.map(leg => leg.ts + ' ' + leg.n));
       console.log("Tickets:", JSON.stringify(multiLegRoute.tk, null, 2));
    } else {
       console.log("No multi-leg routes with tickets found");
    }
  }
}
search().catch(console.error);
