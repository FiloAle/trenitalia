import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { MainButton } from "@/components/ui/main-button";
import { PassengerSelection } from "@/components/complete-trip/passenger-selection";
import { STATIONS } from "@/constants/stations";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CompleteTripScreen() {
	const insets = useSafeAreaInsets();
	const params = useLocalSearchParams();
	const endTime = Number(params.endTime);
	const price = Number(params.price) || 5.0;

	const [acceptedTerms, setAcceptedTerms] = useState(false);

	return (
		<View className="flex-1 bg-white">
			{/* Top Bar */}
			<View
				className="flex-row items-center justify-between px-5 pb-4 border-b border-gray-100"
				style={{ paddingTop: insets.top + 16 }}
			>
				<View className="w-10" />
				<ThemedText className="text-lg font-plus-jakarta-bold !text-gray-950">
					Completa il viaggio
				</ThemedText>
				<Pressable onPress={() => router.back()} className="p-2 -mr-2 w-10 items-end">
					<Icon name="close" size={24} color="black" />
				</Pressable>
			</View>

			<ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
				{/* Service Header */}
				<View className="px-5 py-6">
					<View className="flex-row items-center justify-between mb-2">
						<View className="flex-row items-center">
							<ThemedText className="text-lg font-plus-jakarta-bold !text-gray-950 mr-2">
								Viaggia con il tuo cane
							</ThemedText>
							<Icon name="info" size={18} color="#4b5563" />
						</View>
						<Icon name="expand_less" size={24} color="#4b5563" />
					</View>
					<ThemedText className="text-base font-plus-jakarta-medium !text-gray-700">
						Acquista ora il biglietto per viaggiare insieme al tuo cane
					</ThemedText>
				</View>

				{/* Ticket Context */}
				<View className="bg-[#f3f4f6] px-5 py-4 border-y border-gray-200">
					<View className="flex-row items-center mb-2">
						<Image
							source={require('../assets/logos/frecciarossa.png')}
							style={{ width: 80, height: 12 }}
							resizeMode="contain"
						/>
						<ThemedText className="ml-2 text-sm font-plus-jakarta-bold !text-gray-900">
							8825
						</ThemedText>
					</View>
					<ThemedText className="text-base font-plus-jakarta-bold !text-gray-950 mb-1">
						{STATIONS[0]} - {STATIONS[4]}
					</ThemedText>
					<View className="flex-row items-center">
						<Icon name="calendar_today" size={16} color="#4b5563" className="mr-1" />
						<ThemedText className="text-sm font-plus-jakarta-medium !text-gray-700 mr-3">
							28 Mag, 18:35 - 21:27
						</ThemedText>
						<Icon name="person" size={16} color="#4b5563" className="mr-1" />
						<ThemedText className="text-sm font-plus-jakarta-medium !text-gray-700">
							1 Adulto
						</ThemedText>
					</View>
				</View>

				{/* Passenger Selection */}
				<PassengerSelection
					price={price}
					acceptedTerms={acceptedTerms}
					onToggleTerms={() => setAcceptedTerms(!acceptedTerms)}
				/>
			</ScrollView>

			{/* Bottom Footer */}
			<View className="absolute bottom-0 left-0 right-0 bg-white px-5 py-4 flex-row items-center justify-between shadow-lg border-t border-gray-100" style={{ paddingBottom: insets.bottom + 16 }}>
				<View>
					<ThemedText className="text-xl font-plus-jakarta-bold !text-gray-950">
						{price.toFixed(2).replace(".", ",")} €
					</ThemedText>
					<ThemedText className="text-sm font-plus-jakarta-medium !text-gray-900">
						1 Servizio
					</ThemedText>
				</View>
				<View className="w-1/2">
					<MainButton
						title="Conferma"
						onPress={() => {
							router.push({
								pathname: "/summary" as any,
								params: { endTime, price },
							});
						}}
					/>
				</View>
			</View>
		</View>
	);
}
