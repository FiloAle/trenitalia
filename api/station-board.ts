import { STATIONS } from "@/constants/stations";
import { TrainData } from "@/components/station-board/station-board-train-row";

export async function getStationBoardApi(stationName: string, isArrivals: boolean): Promise<{ trains: TrainData[], lastUpdate: string }> {
	const station = STATIONS.find(
		(s) => s.name.toLowerCase() === stationName.toLowerCase()
	);
	if (!station) return { trains: [], lastUpdate: "" };

	try {
		const response = await fetch(
			`https://iechub.rfi.it/ArriviPartenze/ArrivalsDepartures/Monitor?placeId=${station.id}&arrivals=${isArrivals}`
		);
		const html = await response.text();

		let lastUpdate = "";
		const updateMatch = /aggiornato il\s*<\/span>\s*([0-9/]+)\s*<span[^>]*>\s*alle ore\s*<\/span>\s*([0-9:]+)/i.exec(html);
		if (updateMatch) {
			lastUpdate = `Aggiornato il ${updateMatch[1].trim()} alle ore ${updateMatch[2].trim()}`;
		}

		const trains: TrainData[] = [];
		const rowRegex = /<tr[^>]*name="treno"[^>]*>([\s\S]*?)<\/tr>/gi;
		
		let match;
		while ((match = rowRegex.exec(html)) !== null) {
			const rowHtml = match[1];

			const trainNumMatch = /<td id="RTreno"[^>]*>\s*([^<]*?)\s*<\/td>/i.exec(rowHtml);
			const destMatch = /<td id="RStazione"[^>]*>[\s\S]*?<div>\s*([^<]*?)\s*<\/div>/i.exec(rowHtml);
			const timeMatch = /<td id="ROrario"[^>]*>\s*([^<]*?)\s*<\/td>/i.exec(rowHtml);
			const delayMatch = /<td id="RRitardo"[^>]*>\s*([^<]*?)\s*<\/td>/i.exec(rowHtml);
			const binMatch = /<td id="RBinario"[^>]*>[\s\S]*?<div>\s*([^<]*?)\s*<\/div>/i.exec(rowHtml);
			
			const trainName = trainNumMatch ? trainNumMatch[1].trim() : "";
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
				status = `+ ${delayStr}'`;
			}

			let bin = binMatch ? binMatch[1].trim() : "";
			// Handle cases where Binario is just whitespace or empty
			if (!bin) bin = "-";

			trains.push({
				time,
				destination,
				trainName,
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
