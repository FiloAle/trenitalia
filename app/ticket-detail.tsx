import { BottomSheet } from "@/components/modals/bottom-sheet";
import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { TicketCard } from "@/components/ticket-detail/ticket-card";
import { TicketBottomActions } from "@/components/ticket-detail/ticket-bottom-actions";
import { STATIONS } from "@/constants/stations";
import { USER_DATA } from "@/constants/user";
import { MainButton } from "@/components/ui/main-button";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TicketDetailScreen() {
	const params = useLocalSearchParams();
	const insets = useSafeAreaInsets();
	const [isGestisciOpen, setIsGestisciOpen] = useState(false);
	const [isDettagliOpen, setIsDettagliOpen] = useState(false);

	// Extract data from params with fallbacks matching the screenshot
	const routeStr = (params.route as string) || `${STATIONS[0].name} - ${STATIONS[4].name}`;
	const [origin, destination] = routeStr.split(" - ");
	const timeStr = (params.time as string) || "18:35 - 21:27";
	const [departureTime, arrivalTime] = timeStr.split(" - ");
	
	// Map month to number for the date string (simplified)
	const monthMap: Record<string, string> = {
		"Gen": "01", "Feb": "02", "Mar": "03", "Apr": "04", "Mag": "05", "Giu": "06",
		"Lug": "07", "Ago": "08", "Set": "09", "Ott": "10", "Nov": "11", "Dic": "12"
	};
	const monthNum = monthMap[(params.month as string)] || "05";
	const day = (params.day as string) || "28";
	const dateString = `${day.padStart(2, '0')}/${monthNum}/2026`;

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
				contentContainerStyle={{ paddingBottom: 220 }}
			>
				{/* Main Ticket Card */}
				<TicketCard
					dateString={dateString}
					origin={origin}
					destination={destination}
					departureTime={departureTime}
					arrivalTime={arrivalTime}
					onOpenDettagli={() => setIsDettagliOpen(true)}
				/>
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
					<Pressable className="border border-gray-200 rounded-lg p-4 items-center active:bg-gray-50">
						<ThemedText className="font-plus-jakarta-bold !text-gray-900">Smart Refund</ThemedText>
					</Pressable>
					<Pressable 
						className="border border-gray-200 rounded-lg p-4 items-center active:bg-gray-50"
						onPress={() => {
							setIsGestisciOpen(false);
							// Give modal time to close before navigating
							setTimeout(() => {
								router.push({
									pathname: "/add-services" as any,
									params: { endTime: Date.now() + 10 * 60 * 1000 }
								});
							}, 300);
						}}
					>
						<ThemedText className="font-plus-jakarta-bold !text-gray-900">Aggiungi servizi</ThemedText>
					</Pressable>
					<Pressable className="border border-gray-200 rounded-lg p-4 items-center active:bg-gray-50">
						<ThemedText className="font-plus-jakarta-bold !text-gray-900">Indennizzo</ThemedText>
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
						<ThemedText className="font-plus-jakarta-bold !text-gray-900 text-[15px]">N. CartaFreccia/X-GO</ThemedText>
						<ThemedText className="font-plus-jakarta-medium !text-gray-900 text-[15px]">199933282</ThemedText>
					</View>
					<View className="flex-row justify-between items-center">
						<ThemedText className="font-plus-jakarta-bold !text-gray-900 text-[15px]">Punti CartaFreccia/X-GO</ThemedText>
						<ThemedText className="font-plus-jakarta-medium !text-gray-900 text-[15px]">19.70</ThemedText>
					</View>
					<View className="flex-row justify-between items-center">
						<ThemedText className="font-plus-jakarta-bold !text-gray-900 text-[15px]">CO2 rispetto al viaggio in auto:</ThemedText>
						<ThemedText className="font-plus-jakarta-medium !text-gray-900 text-[15px]">-24.88 Kg</ThemedText>
					</View>
				</View>
				<MainButton title="Chiudi" className="!h-16" onPress={() => setIsDettagliOpen(false)} />
			</BottomSheet>
		</View>
	);
}
