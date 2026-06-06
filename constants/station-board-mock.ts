import { STATIONS } from "@/constants/stations";

const BASE_PARTENZE = [
	{ time: "12:07", trainName: "FR 9623", status: "In orario", bin: "18 AV", binType: "Effettivo", hasMenu: false },
	{ time: "12:10", trainName: "REG 3850", status: "Partito con\n+1 MIN", bin: "8", binType: "Effettivo", hasMenu: true },
	{ time: "12:10", trainName: "REG 3974", status: "Partito con\n+1 MIN", bin: "10", binType: "Effettivo", hasMenu: true },
	{ time: "12:12", trainName: "REG 2499", status: "Partito con\n+3 MIN", bin: "4", binType: "Effettivo", hasMenu: true },
	{ time: "12:16", trainName: "FR 8508", status: "Partito con\n+3 MIN", bin: "17 AV", binType: "Effettivo", hasMenu: false },
	{ time: "12:17", trainName: "REG 17721", status: "Partito con\n+5 MIN", bin: "11-PO", binType: "Effettivo", hasMenu: true },
	{ time: "12:18", trainName: "FR 9806", status: "In orario", bin: "6", binType: "Effettivo", hasMenu: false },
	{ time: "12:25", trainName: "IC 1545", status: "+45 MIN", bin: "4", binType: "Programmato", hasMenu: false },
	{ time: "12:26", trainName: "FR 9624", status: "In orario", bin: "AV", binType: "Effettivo", hasMenu: false },
	{ time: "12:27", trainName: "FR 9607", status: "+17 MIN", bin: "AV", binType: "Effettivo", hasMenu: true },
];

const BASE_ARRIVI = [
	{ time: "12:05", trainName: "FR 9623", status: "In orario", bin: "17 AV", binType: "Effettivo", hasMenu: false },
	{ time: "12:12", trainName: "REG 3850", status: "In arrivo con\n+2 MIN", bin: "9", binType: "Effettivo", hasMenu: true },
	{ time: "12:15", trainName: "FR 9540", status: "In orario", bin: "16 AV", binType: "Effettivo", hasMenu: false },
	{ time: "12:20", trainName: "IC 1545", status: "+5 MIN", bin: "5", binType: "Effettivo", hasMenu: true },
];

// Pick diverse station indices to use as mock destinations
const DESTINATION_INDICES = [1178, 1801, 2322, 583, 241, 1500, 100, 300, 500, 800];

export const getStationBoardTrains = (stationName: string, type: "Partenze" | "Arrivi") => {
	const baseList = type === "Partenze" ? BASE_PARTENZE : BASE_ARRIVI;
	
	return baseList.map((train, index) => {
		// Pick a station from the mock indices
		let destIdx = DESTINATION_INDICES[index % DESTINATION_INDICES.length];
		let destinationName = STATIONS[destIdx].name;
		
		// If the destination matches the current station, shift to the next one
		if (destinationName === stationName) {
			destIdx = DESTINATION_INDICES[(index + 1) % DESTINATION_INDICES.length];
			destinationName = STATIONS[destIdx].name;
		}

		return {
			...train,
			destination: destinationName,
		};
	});
};
