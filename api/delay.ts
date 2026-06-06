import { STATIONS } from "@/constants/stations";

function parseDelayFromHtml(html: string, trainNumber: string): string | null {
	const regex = new RegExp(
		`<td id="RTreno"[^>]*>\\s*${trainNumber}\\s*<\\/td>[\\s\\S]*?<td id="RRitardo"[^>]*>\\s*(.*?)\\s*<\\/td>`,
		"i"
	);
	const match = html.match(regex);
	if (match) {
		const val = match[1].trim();
		if (val && val.length > 0) {
			return val;
		}
	}
	return null;
}

export async function getTrainDelay(
	departureStationName: string,
	trainNumber: string
): Promise<string | null> {
	// Trova l'ID della stazione
	const station = STATIONS.find(
		(s) => s.name.toLowerCase() === departureStationName.toLowerCase()
	);
	if (!station) return null;

	try {
		// 1. Prova prima con gli Arrivi
		let response = await fetch(
			`https://iechub.rfi.it/ArriviPartenze/arrivalsdepartures/Monitor?placeId=${station.id}&arrivals=True`
		);
		let html = await response.text();

		let delay = parseDelayFromHtml(html, trainNumber);

		// 2. Se non lo trova, prova con le Partenze (se il treno ha origine qui non è in Arrivi)
		if (delay === null) {
			response = await fetch(
				`https://iechub.rfi.it/ArriviPartenze/arrivalsdepartures/Monitor?placeId=${station.id}&arrivals=False`
			);
			html = await response.text();
			delay = parseDelayFromHtml(html, trainNumber);
		}

		return delay;
	} catch (e) {
		console.warn("Failed to fetch train delay:", e);
		return null;
	}
}
