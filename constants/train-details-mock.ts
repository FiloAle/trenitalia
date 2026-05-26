export interface TimelineEvent {
	label: string;
	time: string;
	isActual?: boolean;
}

export interface TimelineStation {
	id: string;
	name: string;
	bin: string;
	events: TimelineEvent[];
}

export const TIMELINE_STATIONS: TimelineStation[] = [
	{
		id: "milano",
		name: "Milano Centrale",
		bin: "17",
		events: [
			{ label: "Partenza Programmata", time: "11:35" },
			{ label: "Partenza Effettiva", time: "11:47", isActual: true },
		],
	},
	{
		id: "reggio",
		name: "Reggio Emilia Av",
		bin: "4",
		events: [
			{ label: "Arrivo Programmato", time: "12:18" },
			{ label: "Arrivo Stimato", time: "12:30", isActual: true },
			{ label: "Partenza Programmata", time: "12:20" },
			{ label: "Partenza Stimata", time: "12:32", isActual: true },
		],
	},
	{
		id: "bologna",
		name: "Bologna Centrale",
		bin: "6",
		events: [
			{ label: "Arrivo Programmato", time: "12:42" },
			{ label: "Arrivo Stimato", time: "12:54", isActual: true },
			{ label: "Partenza Programmata", time: "12:45" },
			{ label: "Partenza Stimata", time: "12:57", isActual: true },
		],
	},
	{
		id: "cesena",
		name: "Cesena",
		bin: "2",
		events: [
			{ label: "Arrivo Programmato", time: "13:22" },
			{ label: "Arrivo Stimato", time: "13:34", isActual: true },
		],
	},
];
