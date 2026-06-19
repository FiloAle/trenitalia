const { encode } = require("base-64");

async function test() {
  const from = "Roma Termini";
  const to = "Milano Centrale";
  const date = new Date();
  
  const Y = date.getFullYear().toString();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  const H = date.getHours().toString().padStart(2, '0');
  const i = date.getMinutes().toString().padStart(2, '0');

  const uuid = '12345678-1234-4321-1234-123456789012';
  const extraPartial = '*A1';
  const userPartialWeb = `${uuid}*do*f*it`;
  const payloadWeb = [from, to, Y, m, d, H, i, userPartialWeb, extraPartial].join('|');
  const utf8PayloadWeb = unescape(encodeURIComponent(payloadWeb));
  
  let encodedWeb = encode(utf8PayloadWeb).replace(/=/g, '').split('').reverse().join('');
  encodedWeb += 'W';

  let urlWeb = `https://trenit.app/v1/grx?r=${encodedWeb}`;
  
  console.log("URL:", urlWeb);
  try {
    const res = await fetch(urlWeb, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const data = await res.json();
    console.log("Data length:", data?.data?.routes?.length);
    if (data?.data?.routes?.length > 0) {
      console.log("First route dx:", data.data.routes[0].dx, new Date(data.data.routes[0].dx * 1000));
    } else {
      console.log("Data:", data);
    }
  } catch (e) {
    console.error(e);
  }
}

test();
