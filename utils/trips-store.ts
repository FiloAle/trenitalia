import { STATIONS } from "@/constants/stations";

export interface PurchasedTrain {
	type: string;
	number: string;
	origin?: string;
	destination?: string;
	departureTime?: string;
	arrivalTime?: string;
	pnr: string;
	cp?: string;
	coach?: string;
	seat?: string;
	selectedClass?: string;
	selectedOffer?: string;
	price?: number;
	passengerName?: string;
}

export interface PurchasedTrip {
	id: string;
	date?: string;
	departureTime: string;
	arrivalTime: string;
	duration: string;
	price: number;
	offerName: string;
	trains: PurchasedTrain[];
}

let purchasedTrips: PurchasedTrip[] = [
	{
		id: "1",
		date: "2026-04-29T18:35:00.000Z",
		departureTime: "18:35",
		arrivalTime: "21:27",
		duration: "2h 52min",
		price: 49.9,
		offerName: "Super Economy",
		trains: [
			{
				type: "Frecciarossa",
				number: "8825",
				origin: STATIONS[1178].name,
				destination: STATIONS[583].name,
				departureTime: "18:35",
				arrivalTime: "21:27",
				pnr: "Y7B9Q2",
				cp: "891801",
				coach: "7",
				seat: "15D",
			},
		],
	},
	{
		id: "2",
		date: "2026-05-03T07:27:00.000Z",
		departureTime: "07:27",
		arrivalTime: "10:10",
		duration: "2h 43min",
		price: 39.9,
		offerName: "Economy",
		trains: [
			{
				type: "Frecciarossa",
				number: "9802",
				origin: STATIONS[583].name,
				destination: STATIONS[1178].name,
				departureTime: "07:27",
				arrivalTime: "10:10",
				pnr: "M4X8P1",
				cp: "901234",
				coach: "5",
				seat: "8B",
			},
		],
	},
	{
		id: "3",
		date: "2026-05-28T18:35:00.000Z",
		departureTime: "18:35",
		arrivalTime: "21:27",
		duration: "2h 52min",
		price: 54.9,
		offerName: "Base",
		trains: [
			{
				type: "Frecciarossa",
				number: "8825",
				origin: STATIONS[1178].name,
				destination: STATIONS[583].name,
				departureTime: "18:35",
				arrivalTime: "21:27",
				pnr: "K9L2W5",
				cp: "723910",
				coach: "3",
				seat: "12A",
			},
		],
	},
	{
		id: "4",
		date: "2026-06-02T08:28:00.000Z",
		departureTime: "08:28",
		arrivalTime: "11:10",
		duration: "2h 42min",
		price: 29.9,
		offerName: "Super Economy",
		trains: [
			{
				type: "Frecciarossa",
				number: "9804",
				origin: STATIONS[583].name,
				destination: STATIONS[1178].name,
				departureTime: "08:28",
				arrivalTime: "11:10",
				pnr: "R3T7Z9",
				cp: "456123",
				coach: "11",
				seat: "2C",
			},
		],
	},
];

purchasedTrips.sort((a, b) => {
	const dateA = a.date ? new Date(a.date).getTime() : 0;
	const dateB = b.date ? new Date(b.date).getTime() : 0;
	return dateA - dateB;
});

export const getPurchasedTrips = () => purchasedTrips;

export let pendingPassengers: string[] = [];
export const setPendingPassengers = (passengers: string[]) => {
	pendingPassengers = passengers;
};

export const addPurchasedTrip = (trip: PurchasedTrip) => {
	purchasedTrips.push(trip);
	purchasedTrips.sort((a, b) => {
		const dateA = a.date ? new Date(a.date).getTime() : 0;
		const dateB = b.date ? new Date(b.date).getTime() : 0;
		return dateA - dateB;
	});
};

export const deletePurchasedTrip = (id: string) => {
	purchasedTrips = purchasedTrips.filter((t) => t.id !== id);
};
