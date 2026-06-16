export interface RecentTrainSearch {
	trainNumber: string;
	origin: string;
	destination: string;
}

let recentTrains: RecentTrainSearch[] = [
	{
		trainNumber: "8825",
		origin: "Taranto",
		destination: "Milano Centrale"
	}
];

export const getRecentTrains = () => recentTrains;

export const addRecentTrain = (trainNumber: string, origin: string, destination: string) => {
	const filtered = recentTrains.filter(t => t.trainNumber !== trainNumber);
	recentTrains = [
		{ trainNumber, origin, destination },
		...filtered
	].slice(0, 10);
};

export const clearRecentTrains = () => {
	recentTrains = [];
};
