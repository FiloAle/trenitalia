import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { MainButton } from "@/components/ui/main-button";
import { TimerBar } from "@/components/ui/timer-bar";
import { STATIONS } from "@/constants/stations";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SummaryScreen() {
	const insets = useSafeAreaInsets();
	const params = useLocalSearchParams();
	const endTime = Number(params.endTime);
	const addedPrice = Number(params.price) || 5.0;

	return (
		<View className="flex-1 bg-white">
			{/* Top Bar */}
			<View
				className="bg-[#005045] flex-row items-center justify-between px-5 pb-4"
				style={{ paddingTop: insets.top + 16 }}
			>
				<Pressable onPress={() => router.back()} className="p-2 -ml-2">
					<Icon name="arrow_back" size={24} color="white" />
				</Pressable>
				<ThemedText className="text-lg font-plus-jakarta-bold !text-white">
					Riepilogo
				</ThemedText>
				<Pressable className="p-2 -mr-2" onPress={() => router.navigate("/(tabs)/trips")}>
					<Icon name="home" size={24} color="white" />
				</Pressable>
			</View>

			<TimerBar endTime={endTime} />

			<ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
				<View className="px-5 py-6">
					{/* Nuovo viaggio header */}
					<View className="flex-row items-center justify-between mb-2">
						<View className="rounded bg-[#005045]/10 px-2 py-1">
							<ThemedText className="text-sm font-plus-jakarta-bold !text-[#005045]">
								Nuovo viaggio
							</ThemedText>
						</View>
						<ThemedText className="text-lg font-plus-jakarta-bold !text-gray-950">
							24,70 €
						</ThemedText>
					</View>

					<ThemedText className="text-base font-plus-jakarta-bold !text-gray-950 mb-1">
						{STATIONS[0].name} - {STATIONS[4].name}
					</ThemedText>

					{/* Andata / Ritorno Switch */}
					<View className="flex-row rounded-full bg-[#f3f4f6] p-1 mb-6">
						<View className="flex-1 rounded-full bg-white items-center py-2 shadow-sm">
							<ThemedText className="text-[15px] font-plus-jakarta-bold !text-gray-950">
								Andata
							</ThemedText>
							<ThemedText className="text-sm font-plus-jakarta-medium !text-gray-600">
								24,70 €
							</ThemedText>
						</View>
						<View className="flex-1 items-center py-2">
							<ThemedText className="text-[15px] font-plus-jakarta-medium !text-gray-600">
								Ritorno
							</ThemedText>
							<ThemedText className="text-sm font-plus-jakarta-medium !text-gray-600">
								19,00 €
							</ThemedText>
						</View>
					</View>

					{/* Biglietto Singolo Info */}
					<View className="mb-6">
						<View className="flex-row items-center mb-4">
							<ThemedText className="text-[15px] font-plus-jakarta-medium !text-gray-600 mr-1">
								Biglietto Singolo
							</ThemedText>
							<Icon name="info" size={16} color="#9ca3af" />
						</View>

						<View className="flex-row items-center justify-between">
							<View>
								<View className="flex-row items-center mb-1">
									<Image
										source={require('../assets/logos/frecciarossa.png')}
										style={{ width: 80, height: 12 }}
										resizeMode="contain"
									/>
									<ThemedText className="ml-2 text-sm font-plus-jakarta-bold !text-gray-900">
										8825
									</ThemedText>
								</View>
								<ThemedText className="text-[13px] font-plus-jakarta-bold !text-gray-950">
									{STATIONS[0].name} - {STATIONS[4].name}
								</ThemedText>
								<View className="flex-row items-center">
									<Icon name="calendar_today" size={14} color="#4b5563" className="mr-1" />
									<ThemedText className="text-sm font-plus-jakarta-medium !text-gray-700">
										28 Mag, 18:35 - 21:27
									</ThemedText>
								</View>
							</View>
							<Icon name="expand_more" size={24} color="#1f2937" />
						</View>
					</View>
				</View>

				{/* Breakdown Items */}
				<View className="border-t border-gray-100 px-5 py-5 flex-row items-center justify-between">
					<ThemedText className="text-[16px] font-plus-jakarta-bold !text-gray-950">
						Altri servizi
					</ThemedText>
					<View className="flex-row items-center">
						<ThemedText className="text-[16px] font-plus-jakarta-bold !text-gray-950 mr-2">
							{addedPrice.toFixed(2).replace(".", ",")} €
						</ThemedText>
						<Icon name="expand_more" size={24} color="#1f2937" />
					</View>
				</View>

				<View className="border-t border-b border-gray-100 bg-[#f9fafb] px-5 py-5 flex-row items-center justify-between">
					<View className="flex-row items-center">
						<ThemedText className="text-[16px] font-plus-jakarta-medium !text-gray-950 mr-1">
							Viaggio da modificare
						</ThemedText>
						<Icon name="info" size={16} color="#9ca3af" />
					</View>
					<ThemedText className="text-[16px] font-plus-jakarta-bold !text-gray-950">
						38,70 €
					</ThemedText>
				</View>

				<View className="px-5 py-5 flex-row items-center justify-between">
					<ThemedText className="text-[16px] font-plus-jakarta-bold !text-gray-950">
						Differenza da pagare
					</ThemedText>
					<ThemedText className="text-[16px] font-plus-jakarta-bold !text-gray-950">
						{addedPrice.toFixed(2).replace(".", ",")} €
					</ThemedText>
				</View>
			</ScrollView>

			{/* Bottom Footer */}
			<View className="absolute bottom-0 left-0 right-0 bg-white px-5 py-4 flex-row items-center justify-between shadow-lg border-t border-gray-100" style={{ paddingBottom: insets.bottom + 16 }}>
				<View>
					<ThemedText className="text-xl font-plus-jakarta-bold !text-gray-950">
						{addedPrice.toFixed(2).replace(".", ",")} €
					</ThemedText>
					<ThemedText className="text-sm font-plus-jakarta-medium !text-gray-900">
						1 Viaggio
					</ThemedText>
				</View>
				<View className="w-[55%]">
					<MainButton
						title="Conferma modifica"
						onPress={() => {
							// After confirming, we could go back to the home or show a success modal.
							// For this mock, returning to the detail screen is fine.
							router.replace("/(tabs)/trips");
						}}
					/>
				</View>
			</View>
		</View>
	);
}
