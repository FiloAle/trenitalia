import { TravelSolutionCard } from "@/components/search/travel-solution-card";
import { ThemedText } from "@/components/themed-text";
import { EmptyState } from "@/components/trips/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { TabSelector } from "@/components/ui/tab-selector";
import {
	deletePurchasedTrip,
	getPurchasedTrips,
	PurchasedTrip,
} from "@/utils/trips-store";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CHIPS = ["Biglietti", "Carnet", "Abbonamenti"];

export default function TripsScreen() {
	const insets = useSafeAreaInsets();
	const [activeChip, setActiveChip] = useState("Biglietti");
	const [tickets, setTickets] = useState<PurchasedTrip[]>([]);

	useFocusEffect(
		useCallback(() => {
			setTickets(getPurchasedTrips());
		}, []),
	);

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const futureTickets = tickets.filter((t) => {
		if (!t.date) return false;
		const tDate = new Date(t.date);
		tDate.setHours(0, 0, 0, 0);
		return tDate.getTime() >= today.getTime();
	});

	const pastTickets = tickets
		.filter((t) => {
			if (!t.date) return false;
			const tDate = new Date(t.date);
			tDate.setHours(0, 0, 0, 0);
			return tDate.getTime() < today.getTime();
		})
		.reverse();

	const nextTicket = futureTickets.length > 0 ? futureTickets[0] : undefined;

	const handleLongPress = (id: string) => {
		Alert.alert(
			"Elimina biglietto",
			"Sei sicuro di voler eliminare questo biglietto?",
			[
				{ text: "Annulla", style: "cancel" },
				{
					text: "Elimina",
					style: "destructive",
					onPress: () => {
						deletePurchasedTrip(id);
						setTickets(getPurchasedTrips());
					},
				},
			],
		);
	};

	return (
		<View className="flex-1 bg-white">
			<PageHeader title="I miei viaggi" showBackButton={false} />

			{nextTicket && (
				<View className="bg-primary-600 px-5 pb-6">
					<ThemedText className="text-[15px] font-google-sans-medium !text-white/90 mb-3">
						Il tuo prossimo viaggio
					</ThemedText>
					<TravelSolutionCard
						isPurchasedTrip
						solution={nextTicket as any}
						route={{
							from: nextTicket.trains[0].origin!,
							to: nextTicket.trains[nextTicket.trains.length - 1].destination!,
						}}
						onPress={() =>
							router.push({
								pathname: "/ticket-detail" as any,
								params: { tripId: nextTicket.id },
							})
						}
						onLongPress={() => handleLongPress(nextTicket.id)}
					/>
				</View>
			)}

			{/* Tab Selector */}
			<View className="px-5 pt-5 bg-white z-50">
				<TabSelector
					tabs={CHIPS}
					activeTab={activeChip}
					onTabChange={setActiveChip}
				/>
			</View>

			{/* Content Section */}
			<ScrollView
				className="flex-1 px-5 pt-10 -mt-5"
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ gap: 10, paddingBottom: 40 }}
			>
				{activeChip === "Biglietti" ? (
					<>
						{futureTickets.length > 0 && (
							<>
								<ThemedText className="text-[18px] font-google-sans-bold !text-primary-500 mb-1 mt-2">
									Biglietti futuri
								</ThemedText>
								{futureTickets.map((ticket) => (
									<TravelSolutionCard
										key={ticket.id}
										isPurchasedTrip
										solution={ticket as any}
										route={{
											from: ticket.trains[0].origin!,
											to: ticket.trains[ticket.trains.length - 1].destination!,
										}}
										onPress={() =>
											router.push({
												pathname: "/ticket-detail" as any,
												params: { tripId: ticket.id },
											})
										}
										onLongPress={() => handleLongPress(ticket.id)}
									/>
								))}
							</>
						)}
						{pastTickets.length > 0 && (
							<>
								<ThemedText className="text-[18px] font-google-sans-bold !text-primary-500 mb-1 mt-6">
									Biglietti passati
								</ThemedText>
								{pastTickets.map((ticket) => (
									<TravelSolutionCard
										key={ticket.id}
										isPurchasedTrip
										solution={ticket as any}
										route={{
											from: ticket.trains[0].origin!,
											to: ticket.trains[ticket.trains.length - 1].destination!,
										}}
										onPress={() =>
											router.push({
												pathname: "/ticket-detail" as any,
												params: { tripId: ticket.id },
											})
										}
										onLongPress={() => handleLongPress(ticket.id)}
									/>
								))}
							</>
						)}
					</>
				) : (
					<EmptyState activeChip={activeChip} />
				)}
			</ScrollView>
		</View>
	);
}
