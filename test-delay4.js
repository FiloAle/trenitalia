const https = require('https');

async function fetchRFI() {
    const url = "https://iechub.rfi.it/ArriviPartenze/arrivalsdepartures/Monitor?placeId=2358&arrivals=False";
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

async function test() {
    const html = await fetchRFI();
    const trainRegex = new RegExp(
		`<td id="RTreno"[^>]*>\\s*8801\\s*<\\/td>([\\s\\S]*?)<\\/tr>`,
		"ig"
	);
    let m = trainRegex.exec(html);
    if(m) {
        console.log(m[2]);
    }
}
test();
