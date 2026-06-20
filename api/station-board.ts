import { STATIONS } from "@/constants/stations";
import { TrainData } from "@/components/station-board/station-board-train-row";

import { getGenericUrl } from "./proxy-helper";

export async function getStationBoardApi(stationName: string, isArrivals: boolean): Promise<{ trains: TrainData[], lastUpdate: string }> {
	const station = STATIONS.find(
		(s) => s.name.toLowerCase() === stationName.toLowerCase()
	);
	if (!station) return { trains: [], lastUpdate: "" };

	try {
		const targetUrl = `https://iechub.rfi.it/ArriviPartenze/ArrivalsDepartures/Monitor?placeId=${station.id}&arrivals=${isArrivals}`;
		const response = await fetch(getGenericUrl(targetUrl));
		const html = await response.text();

		let lastUpdate = "";
		const updateMatch = /aggiornato il\s*<\/span>\s*([0-9/]+)\s*<span[^>]*>\s*alle ore\s*<\/span>\s*([0-9:.]+)/i.exec(html);
		if (updateMatch) {
			const dateStr = updateMatch[1].trim();
			const timeStr = updateMatch[2].trim();
			
			const [day, month, year] = dateStr.split('/');
			const [hours, minutes] = timeStr.split(/:|\./);
			
			const updateDate = new Date();
			if (day && month && year) {
				updateDate.setFullYear(parseInt(year, 10));
				updateDate.setMonth(parseInt(month, 10) - 1);
				updateDate.setDate(parseInt(day, 10));
			}
			if (hours && minutes) {
				updateDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
			}
			
			const now = new Date();
			const diffMs = now.getTime() - updateDate.getTime();
			const diffMins = Math.floor(diffMs / 60000);
			
			if (diffMins <= 0) {
				lastUpdate = "Aggiornato ora";
			} else if (diffMins === 1) {
				lastUpdate = "Aggiornato 1 minuto fa";
			} else {
				lastUpdate = `Aggiornato ${diffMins} minuti fa`;
			}
		}

		const trains: TrainData[] = [];
		const rowRegex = /<tr[^>]*name="treno"[^>]*>([\s\S]*?)<\/tr>/gi;
		
		let match;
		while ((match = rowRegex.exec(html)) !== null) {
			const rowHtml = match[1];

			const trainNumMatch = /<td id="RTreno"[^>]*>\s*([^<]*?)\s*<\/td>/i.exec(rowHtml);
			const catMatch = /<td id="RCategoria"[^>]*>[\s\S]*?alt="Categoria\s+([^"]*)"/i.exec(rowHtml);
			const vettoreMatch = /<td id="RVettore"[^>]*>[\s\S]*?alt="([^"]*)"/i.exec(rowHtml);
			const destMatch = /<td id="RStazione"[^>]*>[\s\S]*?<div>\s*([^<]*?)\s*<\/div>/i.exec(rowHtml);
			const timeMatch = /<td id="ROrario"[^>]*>\s*([^<]*?)\s*<\/td>/i.exec(rowHtml);
			const delayMatch = /<td id="RRitardo"[^>]*>\s*([^<]*?)\s*<\/td>/i.exec(rowHtml);
			const binMatch = /<td id="RBinario"[^>]*>[\s\S]*?<div>\s*([^<]*?)\s*<\/div>/i.exec(rowHtml);
			
			const trainNum = trainNumMatch ? trainNumMatch[1].trim() : "";
			const catStr = catMatch ? catMatch[1].trim() : "";
			const vettoreStr = vettoreMatch ? vettoreMatch[1].trim() : "";
			let category = catStr;
			if (vettoreStr && catStr) category = `${vettoreStr} ${catStr}`;
			else if (vettoreStr) category = vettoreStr;

			// Clean up Italo strings
			if (category.toUpperCase().includes("ITALO") || category.toUpperCase().includes("NTV")) {
				category = category.replace(/ALTA\s+VELOCITA(?:&#39;|'|À|A)?/i, "").trim();
			}

			const trainName = trainNum;
			let destination = destMatch ? destMatch[1].trim() : "";
			// Title case for destination
			if (destination) {
				destination = destination.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
			}

			const time = timeMatch ? timeMatch[1].trim() : "";
			
			const delayStr = delayMatch ? delayMatch[1].trim() : "";
			let status = "in orario";
			if (delayStr.toLowerCase() === "cancellato") {
				status = "Cancellato";
			} else if (delayStr && delayStr !== "0") {
				status = `+${delayStr} MIN`;
			}

			let bin = binMatch ? binMatch[1].trim() : "";
			// Handle cases where Binario is just whitespace or empty
			if (!bin) bin = "-";

			trains.push({
				time,
				destination,
				trainName,
				category,
				status,
				bin,
				binType: "",
				hasMenu: true,
			});
		}

		// Filter out empty rows (sometimes RFI adds invisible template rows at the bottom)
		return { trains: trains.filter(t => t.trainName && t.time), lastUpdate };
	} catch (e) {
		console.warn("Failed to fetch station board:", e);
		return { trains: [], lastUpdate: "" };
	}
}
