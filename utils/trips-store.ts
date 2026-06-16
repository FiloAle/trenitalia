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
	isSaved?: boolean;
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
	{
		id: "5",
		date: "2026-06-14T18:35:00.000Z",
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
		id: "6",
		date: "2026-07-04T10:15:00.000Z",
		departureTime: "10:15",
		arrivalTime: "14:40",
		duration: "4h 25min",
		price: 89.9,
		offerName: "Base",
		trains: [
			{
				type: "Frecciarossa",
				number: "9510",
				origin: STATIONS[583].name,
				destination: "Bologna Centrale",
				departureTime: "10:15",
				arrivalTime: "11:30",
				pnr: "Z9A1C3",
				cp: "314159",
				coach: "2",
				seat: "8A",
			},
			{
				type: "Regionale",
				number: "4023",
				origin: "Bologna Centrale",
				destination: STATIONS[1178].name,
				departureTime: "11:50",
				arrivalTime: "14:40",
				pnr: "X8Y9Z0",
				coach: "-",
				seat: "-",
			},
		],
	},
];

// Add a dynamic ticket for today
const today = new Date();
const currentHour = today.getHours();
const depHour = (currentHour + 1) % 24;
const arrHour = (currentHour + 3) % 24;
const depTimeStr = `${depHour.toString().padStart(2, '0')}:00`;
const arrTimeStr = `${arrHour.toString().padStart(2, '0')}:00`;

const todayTripDate = new Date();
todayTripDate.setHours(depHour, 0, 0, 0);

purchasedTrips.push({
	id: "today-mock",
	date: todayTripDate.toISOString(),
	departureTime: depTimeStr,
	arrivalTime: arrTimeStr,
	duration: "2h 00min",
	price: 35.5,
	offerName: "Base",
	trains: [
		{
			type: "Frecciarossa",
			number: "9510",
			origin: STATIONS[583].name,
			destination: STATIONS[1178].name,
			departureTime: depTimeStr,
			arrivalTime: arrTimeStr,
			pnr: "TODAY1",
			cp: "123456",
			coach: "9",
			seat: "1A",
		},
	],
});

purchasedTrips.sort((a, b) => {
	const dateA = a.date ? new Date(a.date).getTime() : 0;
	const dateB = b.date ? new Date(b.date).getTime() : 0;
	return dateA - dateB;
});

export const getPurchasedTrips = () => purchasedTrips;

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

export const toggleSavedTrip = (id: string) => {
	const trip = purchasedTrips.find((t) => t.id === id);
	if (trip) {
		trip.isSaved = !trip.isSaved;
	}
};
