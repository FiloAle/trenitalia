import { BottomSheet } from "@/components/modals/bottom-sheet";
import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { MainButton } from "@/components/ui/main-button";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, ScrollView, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TicketDetailScreen() {
	const params = useLocalSearchParams();
	const insets = useSafeAreaInsets();
	const [isGestisciOpen, setIsGestisciOpen] = useState(false);
	const [isDettagliOpen, setIsDettagliOpen] = useState(false);

	// Extract data from params with fallbacks matching the screenshot
	const routeStr = (params.route as string) || "Milano Centrale - Cesena";
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
		<View className="flex-1 bg-[#f3f4f6]">
			{/* Gradient Header Background */}
			<LinearGradient
				colors={["#8a052b", "#f73d3d"]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				className="absolute left-0 right-0 top-0 h-64"
			/>

			{/* Header Nav */}
			<View
				className="flex-row items-center justify-between px-5 pb-4"
				style={{ paddingTop: insets.top + 16 }}
			>
				<Pressable className="p-2">
					<Icon name="ios_share" size={28} color="white" />
				</Pressable>
				<View className="items-center">
					<ThemedText className="text-lg font-plus-jakarta-bold !text-white">
						Mario Rossi
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
				<View className="mt-4 overflow-hidden rounded-xl bg-white shadow-sm">
					{/* Top row: Train and Date */}
					<View className="flex-row items-center justify-between border-b border-gray-100 p-5">
						<View className="flex-row items-center">
							<View>
								<Image 
									source={require("../assets/logos/frecciarossa.png")} 
									style={{ width: 100, height: 16 }} 
									resizeMode="contain"
								/>
							</View>
							<ThemedText className="ml-2 text-sm font-plus-jakarta-bold !text-gray-900">
								8825
							</ThemedText>
						</View>
						<ThemedText className="text-sm font-plus-jakarta-bold !text-gray-900">
							{dateString}
						</ThemedText>
					</View>

					{/* Middle section: Route and Times */}
					<View className="p-5">
						<View className="flex-row items-center justify-between mb-4">
							<View className="flex-1">
								<ThemedText className="text-sm font-plus-jakarta-medium !text-gray-900">
									{origin}
								</ThemedText>
								<ThemedText className="text-3xl font-plus-jakarta-bold !text-gray-900 mt-1">
									{departureTime}
								</ThemedText>
							</View>

							<View className="px-4">
								<Icon name="arrow_forward" size={24} color="#9ca3af" />
							</View>

							<View className="flex-1 items-end">
								<ThemedText className="text-sm font-plus-jakarta-medium !text-gray-900">
									{destination}
								</ThemedText>
								<ThemedText className="text-3xl font-plus-jakarta-bold !text-gray-900 mt-1">
									{arrivalTime}
								</ThemedText>
							</View>
						</View>

						{/* Codes row */}
						<View className="flex-row justify-between mb-6 gap-2">
							<View className="flex-1 rounded-lg bg-gray-100 p-3">
								<View className="flex-row items-center justify-between mb-1">
									<ThemedText className="text-xs font-plus-jakarta-medium !text-gray-500">
										PNR
									</ThemedText>
									<Icon name="content_copy" size={12} color="#6b7280" />
								</View>
								<ThemedText className="text-sm font-plus-jakarta-bold !text-gray-900">
									F34VNN
								</ThemedText>
							</View>
							<View className="flex-1 rounded-lg bg-gray-100 p-3">
								<ThemedText className="text-xs font-plus-jakarta-medium !text-gray-500 mb-1">
									CP
								</ThemedText>
								<ThemedText className="text-sm font-plus-jakarta-bold !text-gray-900">
									891801
								</ThemedText>
							</View>
							<View className="flex-1 rounded-lg bg-gray-100 p-3">
								<ThemedText className="text-xs font-plus-jakarta-medium !text-gray-500 mb-1">
									CARR.-POSTO
								</ThemedText>
								<ThemedText className="text-sm font-plus-jakarta-bold !text-gray-900">
									7-15D
								</ThemedText>
							</View>
						</View>

						{/* QR Code Block */}
						<Pressable 
							className="items-center justify-center py-0"
							onPress={() => router.push({ pathname: "/qr-code", params: { pnr: "F34VNN" } })}
						>
							<QRCode
								value="F34VNN"
								size={100}
								color="black"
								backgroundColor="white"
							/>
						</Pressable>
					</View>

					{/* Ticket Type and Price */}
					<View className="flex-row items-center justify-between border-t border-gray-100 p-5">
						<View className="flex-row items-center">
							<Icon name="confirmation_number" size={24} color="#000" />
							<ThemedText className="ml-2 text-sm font-plus-jakarta-medium !text-gray-900">
								STANDARD / Super Economy
							</ThemedText>
						</View>
						<ThemedText className="text-sm font-plus-jakarta-bold !text-gray-900">
							19,70€
						</ThemedText>
					</View>

					{/* Maggiori Dettagli */}
					<Pressable 
						className="border-t border-gray-100 py-4 active:bg-gray-50"
						onPress={() => setIsDettagliOpen(true)}
					>
						<ThemedText className="text-center text-[15px] font-plus-jakarta-bold !text-gray-900">
							Maggiori Dettagli
						</ThemedText>
					</Pressable>
				</View>
			</ScrollView>

			{/* Bottom Fixed Actions */}
			<View className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-4">
				<Pressable className="mb-3 !h-16 flex-row items-center justify-center rounded-xl bg-[#1c1c1e] active:opacity-80 shadow-md">
					{/* Wallet Icon approximation using SVG or generic Icon */}
					<Icon name="wallet" size={24} color="white" className="mr-2" />
					<ThemedText className="text-[20px] font-plus-jakarta-bold !text-white">
						Aggiungi a Wallet
					</ThemedText>
				</Pressable>
				
				<MainButton 
					title="Gestisci" 
					className="!h-16" 
					onPress={() => setIsGestisciOpen(true)} 
				/>
			</View>

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
									pathname: "/add-services",
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
