import { ThemedText } from "@/components/themed-text";
import { EmptyState } from "@/components/trips/empty-state";
import { TicketItem } from "@/components/trips/ticket-item";
import { Icon } from "@/components/ui/icon";
import { MainButton } from "@/components/ui/main-button";
import {
	deletePurchasedTrip,
	getPurchasedTrips,
	PurchasedTrip,
} from "@/utils/trips-store";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CHIPS = ["Biglietti", "Abbonamenti", "Carnet", "TPL", "Archivio"];

export default function TripsScreen() {
	const insets = useSafeAreaInsets();
	const [activeChip, setActiveChip] = useState("Biglietti");
	const [tickets, setTickets] = useState<PurchasedTrip[]>([]);

	useFocusEffect(
		useCallback(() => {
			setTickets(getPurchasedTrips());
		}, []),
	);

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
			{/* Header Section */}
			<View className="bg-teal-900 pb-6" style={{ paddingTop: insets.top + 4 }}>
				<View className="h-14 flex-row items-center px-6 mb-2">
					<ThemedText className="text-3xl font-plus-jakarta-bold !text-white">
						I miei viaggi
					</ThemedText>
				</View>

				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					className="px-5"
				>
					{CHIPS.map((chip) => (
						<Pressable
							key={chip}
							onPress={() => setActiveChip(chip)}
							className={`mr-3 rounded-full px-5 py-2.5 ${
								activeChip === chip ? "bg-[#1f2937]" : "bg-[#ffffff20]"
							}`}
						>
							<ThemedText
								className={`font-plus-jakarta-semibold ${
									activeChip === chip ? "!text-white" : "!text-white"
								}`}
							>
								{chip}
							</ThemedText>
						</Pressable>
					))}
				</ScrollView>
			</View>

			{/* Content Section */}
			<ScrollView
				className="flex-1 px-5 pt-6"
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ gap: 10, paddingBottom: 100 }}
			>
				{activeChip === "Biglietti" ? (
					<>
						{/* Saved Tickets Row */}
						<Pressable className="flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white p-4">
							<View className="flex-row items-center">
								<Icon name="bookmark" size={24} color="teal-900" />
								<ThemedText className="ml-3 font-plus-jakarta-semibold !text-gray-900">
									Biglietti salvati
								</ThemedText>
							</View>
							<Icon name="chevron_right" size={24} color="#1f2937" />
						</Pressable>

						{/* Tickets List */}
						{tickets.map((ticket) => (
							<TicketItem
								key={ticket.id}
								ticket={ticket}
								onLongPress={() => handleLongPress(ticket.id)}
							/>
						))}
					</>
				) : (
					<EmptyState activeChip={activeChip} />
				)}
			</ScrollView>

			{/* Bottom Button */}
			<View className="absolute bottom-6 left-0 right-0 px-5">
				<MainButton
					title="Recupera biglietto"
					iconName="search"
					onPress={() => {}}
				/>
			</View>
		</View>
	);
}
