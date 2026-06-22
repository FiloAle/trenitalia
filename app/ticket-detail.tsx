import { BottomSheet } from "@/components/modals/bottom-sheet";
import { ThemedText } from "@/components/themed-text";
import { TicketBottomActions } from "@/components/ticket-detail/ticket-bottom-actions";
import { TicketCard } from "@/components/ticket-detail/ticket-card";
import { RouteInfomobilityContent } from "@/components/train-details/route-infomobility-content";
import { MainButton } from "@/components/ui/main-button";
import { PageHeader } from "@/components/ui/page-header";
import { USER_DATA } from "@/constants/user";
import { getPurchasedTrips } from "@/utils/trips-store";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TicketDetailScreen() {
	const params = useLocalSearchParams();
	const insets = useSafeAreaInsets();
	const [isGestisciOpen, setIsGestisciOpen] = useState(false);
	const [isDettagliOpen, setIsDettagliOpen] = useState(false);
	const [selectedInfomobilityTripId, setSelectedInfomobilityTripId] = useState<string | null>(null);

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

	const todayObj = new Date();
	const isToday =
		dateObj.getDate() === todayObj.getDate() &&
		dateObj.getMonth() === todayObj.getMonth() &&
		dateObj.getFullYear() === todayObj.getFullYear();

	const displayDate = isToday ? "Oggi" : dateString;

	return (
		<View className="flex-1 bg-white">
			<PageHeader
				title="Biglietto"
				showBackButton={true}
				showShareButton={true}
				onShare={() => {}}
			/>

			<ScrollView
				className="flex-1 px-5 pt-4"
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 220, gap: 16 }}
			>
				{/* Multi-Segment Ticket Cards */}
				{trip.trains.map((train, index) => {
					// Calcola se il treno è già partito confrontando orario di partenza e data
					let isPast = false;
					try {
						const depDate = new Date(trip.date || Date.now());
						const [hours, minutes] = (train.departureTime || "00:00").split(
							":",
						);
						depDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
						isPast = depDate < new Date();
					} catch (e) {
						// Ignora
					}

					return (
						<TicketCard
							key={index}
							dateString={displayDate}
							isPastTrip={isPast}
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
							passengerName={(train as any).passengerName}
							offer={train.selectedOffer || "Super Economy"}
							price={train.price}
							onOpenDettagli={() => setIsDettagliOpen(true)}
							onTopPress={
								isToday
									? () => setSelectedInfomobilityTripId(trip.id)
									: undefined
							}
						/>
					);
				})}
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
					<Pressable className="border border-neutral-200 rounded-2xl p-4 items-center active:bg-neutral-50">
						<ThemedText className="font-google-sans-bold !text-neutral-900">
							Smart Refund
						</ThemedText>
					</Pressable>
					<Pressable
						className="border border-neutral-200 rounded-2xl p-4 items-center active:bg-neutral-50"
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
						<ThemedText className="font-google-sans-bold !text-neutral-900">
							Aggiungi servizi
						</ThemedText>
					</Pressable>
					<Pressable className="border border-neutral-200 rounded-2xl p-4 items-center active:bg-neutral-50">
						<ThemedText className="font-google-sans-bold !text-neutral-900">
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
						<ThemedText className="font-google-sans-bold !text-neutral-900 text-[15px]">
							N. CartaFreccia/X-GO
						</ThemedText>
						<ThemedText className="font-google-sans-medium !text-neutral-900 text-[15px]">
							{USER_DATA.loyaltyCode}
						</ThemedText>
					</View>
					<View className="flex-row justify-between items-center">
						<ThemedText className="font-google-sans-bold !text-neutral-900 text-[15px]">
							Punti CartaFreccia/X-GO
						</ThemedText>
						<ThemedText className="font-google-sans-medium !text-neutral-900 text-[15px]">
							19.70
						</ThemedText>
					</View>
					<View className="flex-row justify-between items-center">
						<ThemedText className="font-google-sans-bold !text-neutral-900 text-[15px]">
							CO2 rispetto al viaggio in auto:
						</ThemedText>
						<ThemedText className="font-google-sans-medium !text-neutral-900 text-[15px]">
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

			{/* Infomobilità Percorso Modal */}
			<BottomSheet
				isVisible={!!selectedInfomobilityTripId}
				onClose={() => setSelectedInfomobilityTripId(null)}
				title="Infomobilità Percorso"
			>
				{selectedInfomobilityTripId && (
					<View className="mt-2 -mx-5 px-5">
						<RouteInfomobilityContent tripId={selectedInfomobilityTripId} />
					</View>
				)}
			</BottomSheet>
		</View>
	);
}
