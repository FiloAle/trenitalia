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
		`<td id="RTreno"[^>]*>\\s*([0-9A-Za-z ]+)\\s*<\\/td>([\\s\\S]*?)<\\/tr>`,
		"ig"
	);
    let m;
    while((m = trainRegex.exec(html)) !== null) {
        const trainNumber = m[1];
        const rowHtml = m[2];
        let delay = null;
        const delayRegex = /<td id="RRitardo"[^>]*>\s*(.*?)\s*<\/td>/i;
        const delayMatch = rowHtml.match(delayRegex);
        if (delayMatch) {
            const val = delayMatch[1].replace(/<[^>]*>?/gm, '').trim();
            if (val && val.length > 0) delay = val;
        }
        console.log("Train:", trainNumber, "Delay:", delay);
    }
}
test();
