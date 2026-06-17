import { BottomSheet } from "@/components/modals/bottom-sheet";
import { ThemedText } from "@/components/themed-text";
import { TicketBottomActions } from "@/components/ticket-detail/ticket-bottom-actions";
import { TicketCard } from "@/components/ticket-detail/ticket-card";
import { Icon } from "@/components/ui/icon";
import { MainButton } from "@/components/ui/main-button";
import { USER_DATA } from "@/constants/user";
import { getPurchasedTrips } from "@/utils/trips-store";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TicketDetailScreen() {
	const params = useLocalSearchParams();
	const insets = useSafeAreaInsets();
	const [isGestisciOpen, setIsGestisciOpen] = useState(false);
	const [isDettagliOpen, setIsDettagliOpen] = useState(false);

	const tripId = params.tripId as string;
	// Retrieve from global store
	const trip = getPurchasedTrips().find((t) => t.id === tripId);

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
			{/* Gradient Header Background */}
			<View className="absolute left-0 right-0 top-0 h-64">
				<LinearGradient
					colors={["#8a052b", "#f73d3d"]}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 0 }}
					style={{ flex: 1 }}
				/>
			</View>

			{/* Header Nav */}
			<View
				className="flex-row items-center justify-between px-5 pb-4"
				style={{ paddingTop: insets.top + 4 }}
			>
				<Pressable className="p-2">
					<Icon name="ios_share" size={28} color="white" />
				</Pressable>
				<View className="items-center">
					<ThemedText className="text-[15px] font-plus-jakarta-bold !text-white uppercase">
						{USER_DATA.firstName} {USER_DATA.lastName}
					</ThemedText>
					<ThemedText className="text-sm font-plus-jakarta-medium !text-white">
						Adulto
					</ThemedText>
				</View>
				<Pressable className="p-2" onPress={() => router.back()}>
					<Icon name="close" size={28} color="white" />
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
						price={train.price}
						onOpenDettagli={() => setIsDettagliOpen(true)}
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
					<Pressable className="border border-gray-200 rounded-2xl p-4 items-center active:bg-gray-50">
						<ThemedText className="font-plus-jakarta-bold !text-gray-900">
							Smart Refund
						</ThemedText>
					</Pressable>
					<Pressable
						className="border border-gray-200 rounded-2xl p-4 items-center active:bg-gray-50"
						onPress={() => {
							setIsGestisciOpen(false);
							// Give modal time to close before navigating
							setTimeout(() => {
								router.push({
									pathname: "/add-services" as any,
									params: {
										endTime: Date.now() + 10 * 60 * 1000,
										isAddService: "true",
									},
								});
							}, 300);
						}}
					>
						<ThemedText className="font-plus-jakarta-bold !text-gray-900">
							Aggiungi servizi
						</ThemedText>
					</Pressable>
					<Pressable className="border border-gray-200 rounded-2xl p-4 items-center active:bg-gray-50">
						<ThemedText className="font-plus-jakarta-bold !text-gray-900">
							Indennizzo
						</ThemedText>
					</Pressable>
				</View>
			</BottomSheet>

			<BottomSheet
				isVisible={isDettagliOpen}
				onClose={() => setIsDettagliOpen(false)}
				title="Maggiori Dettagli"
			>
				<View className="gap-4 mb-6 mt-2">
					<View className="flex-row justify-between items-center">
						<ThemedText className="font-plus-jakarta-bold !text-gray-900 text-[15px]">
							N. CartaFreccia/X-GO
						</ThemedText>
						<ThemedText className="font-plus-jakarta-medium !text-gray-900 text-[15px]">
							{USER_DATA.loyaltyCode}
						</ThemedText>
					</View>
					<View className="flex-row justify-between items-center">
						<ThemedText className="font-plus-jakarta-bold !text-gray-900 text-[15px]">
							Punti CartaFreccia/X-GO
						</ThemedText>
						<ThemedText className="font-plus-jakarta-medium !text-gray-900 text-[15px]">
							19.70
						</ThemedText>
					</View>
					<View className="flex-row justify-between items-center">
						<ThemedText className="font-plus-jakarta-bold !text-gray-900 text-[15px]">
							CO2 rispetto al viaggio in auto:
						</ThemedText>
						<ThemedText className="font-plus-jakarta-medium !text-gray-900 text-[15px]">
							-24.88 Kg
						</ThemedText>
					</View>
				</View>
				<MainButton
					title="Chiudi"
					className="!h-16"
					onPress={() => setIsDettagliOpen(false)}
				/>
			</BottomSheet>
		</View>
	);
}
