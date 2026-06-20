import { STATIONS } from "@/constants/stations";
import { getViaggiatrenoUrl } from "./proxy-helper";

export interface TrainInfo {
	delay: string | null;
	binario: string | null;
}

function parseInfoFromHtml(html: string, trainNumber: string): TrainInfo | null {
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

	let binario = null;
	const binRegex = /<td id="RBinario"[^>]*>[\s\S]*?<div[^>]*>\s*(.*?)\s*<\/div>/i;
	const binMatch = rowHtml.match(binRegex);
	if (binMatch) {
		const val = binMatch[1].replace(/<[^>]*>?/gm, '').trim();
		if (val && val.length > 0) binario = val;
	}

	return { delay, binario };
}

function parseDelayFromHtml(html: string, trainNumber: string): string | null {
	const info = parseInfoFromHtml(html, trainNumber);
	return info ? info.delay : null;
}

const infoCache = new Map<string, { value: TrainInfo | null, timestamp: number }>();
const delayCache = new Map<string, { value: string | null, timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

export async function getTrainInfo(
	stationName: string,
	trainNumber: string
): Promise<TrainInfo | null> {
	const cacheKey = `${stationName}-${trainNumber}`;
	const cached = infoCache.get(cacheKey);
	if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
		return cached.value;
	}

	// 1. Try Viaggiatreno JSON API first (most reliable, works for trains en route)
	try {
		const autoUrl = getViaggiatrenoUrl(`/cercaNumeroTrenoTrenoAutocomplete/${trainNumber}`);
		const autoResp = await fetch(autoUrl);
		const autoText = await autoResp.text();
		
		if (autoText && autoText.trim() !== "") {
			const lines = autoText.trim().split("\n");
			const firstLine = lines[0].trim();
			const parts = firstLine.split("|");
			
			if (parts.length >= 2) {
				const ids = parts[1].split("-");
				if (ids.length >= 3) {
					const originId = ids[1];
					const timestamp = ids[2];

					const andamentoUrl = getViaggiatrenoUrl(`/andamentoTreno/${originId}/${trainNumber}/${timestamp}`);
					const andamentoResp = await fetch(andamentoUrl);
					const data = await andamentoResp.json();

					let delay = null;
					if (data.compRitardo && data.compRitardo.length > 0) {
						delay = data.compRitardo[0];
					}

					let binario = null;
					if (data.fermate && Array.isArray(data.fermate)) {
						const fermata = data.fermate.find((f: any) => 
							f.stazione.toLowerCase().includes(stationName.toLowerCase()) ||
							stationName.toLowerCase().includes(f.stazione.toLowerCase())
						);
						if (fermata) {
							binario = fermata.binarioEffettivoPartenzaDescrizione || 
									  fermata.binarioProgrammatoPartenzaDescrizione || 
									  fermata.binarioEffettivoArrivoDescrizione || 
									  fermata.binarioProgrammatoArrivoDescrizione || 
									  null;
						}
					}

					if (delay !== null) {
						const info = { delay, binario };
						infoCache.set(cacheKey, { value: info, timestamp: Date.now() });
						return info;
					}
				}
			}
		}
	} catch (e) {
		console.warn("Viaggiatreno API failed, falling back to RFI HTML:", e);
	}

	// 2. Fallback to RFI HTML scraping
	const station = STATIONS.find(
		(s) => s.name.toLowerCase() === stationName.toLowerCase()
	);
	if (!station) return null;

	try {
		let response = await fetch(
			`https://iechub.rfi.it/ArriviPartenze/arrivalsdepartures/Monitor?placeId=${station.id}&arrivals=True`
		);
		let html = await response.text();

		let info = parseInfoFromHtml(html, trainNumber);

		if (info === null) {
			response = await fetch(
				`https://iechub.rfi.it/ArriviPartenze/arrivalsdepartures/Monitor?placeId=${station.id}&arrivals=False`
			);
			html = await response.text();
			info = parseInfoFromHtml(html, trainNumber);
		}

		infoCache.set(cacheKey, { value: info, timestamp: Date.now() });
		return info;
	} catch (e) {
		console.warn("Failed to fetch train info:", e);
		return null;
	}
}

export async function getTrainDelay(
	departureStationName: string,
	trainNumber: string
): Promise<string | null> {
	const info = await getTrainInfo(departureStationName, trainNumber);
	return info ? info.delay : null;
}
