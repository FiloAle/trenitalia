import { BottomSheet } from "@/components/modals/bottom-sheet";
import { ThemedText } from "@/components/themed-text";
import { TicketBottomActions } from "@/components/ticket-detail/ticket-bottom-actions";
import { TicketCard } from "@/components/ticket-detail/ticket-card";
import { Icon } from "@/components/ui/icon";
import { MainButton } from "@/components/ui/main-button";
import { STATIONS } from "@/constants/stations";
import { USER_DATA } from "@/constants/user";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getPurchasedTrips, toggleSavedTrip } from "@/utils/trips-store";

export default function TicketDetailScreen() {
	const params = useLocalSearchParams();
	const insets = useSafeAreaInsets();
	const [isGestisciOpen, setIsGestisciOpen] = useState(false);
	const [forceRender, setForceRender] = useState(0);

	const tripId = params.tripId as string;
	// Retrieve from global store
	const trip = getPurchasedTrips().find(t => t.id === tripId);

	if (!trip) {
		return (
			<View className="flex-1 items-center justify-center bg-white">
				<ThemedText>Biglietto non trovato.</ThemedText>
				<MainButton title="Torna indietro" onPress={() => router.back()} />
			</View>
		);
	}

	const dateObj = new Date(trip.date || new Date());
	const day = dateObj.getDate().toString().padStart(2, "0");
	const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
	const dateString = `${day}/${month}/${dateObj.getFullYear()}`;

	return (
		<View className="flex-1 bg-white">
			{/* Header Nav */}
			<View
				className="flex-row items-center justify-between px-5 pb-4 bg-teal-900"
				style={{ paddingTop: insets.top + 10 }}
			>
				<Pressable className="p-2" onPress={() => router.back()}>
					<Icon name="arrow_back_ios" size={24} color="white" />
				</Pressable>
				<View className="items-center">
					<ThemedText className="text-[18px] font-plus-jakarta-bold !text-white">
						Biglietto
					</ThemedText>
				</View>
				<Pressable className="p-2">
					<Icon name="ios_share" size={24} color="white" />
				</Pressable>
			</View>

			<ScrollView
				className="flex-1 px-5"
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 220, gap: 16 }}
			>
				{/* Multi-Segment Ticket Cards */}
				{trip.trains.map((train, index) => (
					<TicketCard
						key={index}
						dateString={dateString}
						origin={train.origin || ""}
						destination={train.destination || ""}
						departureTime={train.departureTime || ""}
						arrivalTime={train.arrivalTime || ""}
						pnr={train.pnr || ""}
						trainType={train.type || ""}
						trainNumber={train.number || ""}
						cp={train.cp}
						carrozza={train.coach}
						posto={train.seat}
						passengerClass={train.selectedClass || "Standard"}
						offer={train.selectedOffer || "Super Economy"}
						price={train.price ?? trip.price}
					/>
				))}
			</ScrollView>

			{/* Bottom Fixed Actions */}
			<TicketBottomActions onGestisci={() => setIsGestisciOpen(true)} />

			{/* Bottom Sheets */}
			<BottomSheet
				isVisible={isGestisciOpen}
				onClose={() => setIsGestisciOpen(false)}
				title="Gestisci"
			>
				<View className="gap-3">
					<Pressable 
						className={`rounded-lg p-4 items-center active:opacity-80 ${trip.isSaved ? 'bg-red-600' : 'bg-[#005045]'}`}
						onPress={() => {
							toggleSavedTrip(trip.id);
							setForceRender(prev => prev + 1);
							setIsGestisciOpen(false);
						}}
					>
						<ThemedText className="font-plus-jakarta-bold !text-white">
							{trip.isSaved ? "Rimuovi dai salvati" : "Salva biglietto"}
						</ThemedText>
					</Pressable>
					<Pressable className="border border-gray-200 rounded-lg p-4 items-center active:bg-gray-50">
						<ThemedText className="font-plus-jakarta-bold !text-gray-900">
							Smart Refund
						</ThemedText>
					</Pressable>
					<Pressable
						className="border border-gray-200 rounded-lg p-4 items-center active:bg-gray-50"
						onPress={() => {
							setIsGestisciOpen(false);
							setTimeout(() => {
								router.push({
									pathname: "/add-services" as any,
									params: { endTime: Date.now() + 10 * 60 * 1000, isAddService: "true" },
								});
							}, 300);
						}}
					>
						<ThemedText className="font-plus-jakarta-bold !text-gray-900">
							Aggiungi servizi
						</ThemedText>
					</Pressable>
					<Pressable className="border border-gray-200 rounded-lg p-4 items-center active:bg-gray-50">
						<ThemedText className="font-plus-jakarta-bold !text-gray-900">
							Indennizzo
						</ThemedText>
					</Pressable>
				</View>
			</BottomSheet>
		</View>
	);
}
