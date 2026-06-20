const https = require('https');

function parseInfoFromHtml(html, trainNumber) {
	const trainRegex = new RegExp(
		`<td id="RTreno"[^>]*>\\s*${trainNumber}\\s*<\\/td>([\\s\\S]*?)<\\/tr>`,
		"i"
	);
	const rowMatch = html.match(trainRegex);
	if (!rowMatch) return null;
	const rowHtml = rowMatch[1];

	let delay = null;
	const delayRegex = /<td id="RRitardo"[^>]*>\s*(.*?)\s*<\/td>/i;
	const delayMatch = rowHtml.match(delayRegex);
	if (delayMatch) {
		const val = delayMatch[1].replace(/<[^>]*>?/gm, '').trim();
		if (val && val.length > 0) delay = val;
	}

	return { delay };
}

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
    console.log("Got HTML, length:", html.length);
    
    // Let's find some train numbers in the HTML
    const trainNumbers = [...html.matchAll(/<td id="RTreno"[^>]*>\s*([A-Za-z0-9 ]+?)\s*<\/td>/gi)].map(m => m[1]);
    console.log("Found trains on RFI board:", trainNumbers);

    if (trainNumbers.length > 0) {
        console.log("Parsing delay for first train:", trainNumbers[0]);
        const info = parseInfoFromHtml(html, trainNumbers[0]);
        console.log("Result:", info);

        console.log("Parsing delay using ONLY numbers (stripping prefix):", trainNumbers[0].replace(/[^0-9]/g, ""));
        const infoOnlyNum = parseInfoFromHtml(html, trainNumbers[0].replace(/[^0-9]/g, ""));
        console.log("Result only num:", infoOnlyNum);
    }
}
test();
