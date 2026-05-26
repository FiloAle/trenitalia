import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { MainButton } from "@/components/ui/main-button";
import { TimerBar } from "@/components/ui/timer-bar";
import { ServiceCard } from "@/components/services/service-card";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AddServicesScreen() {
	const insets = useSafeAreaInsets();
	const params = useLocalSearchParams();
	const endTime = Number(params.endTime);

	const [selectedService, setSelectedService] = useState<string | null>(null);

	const services = [
		{
			id: "dog",
			title: "Viaggia con il tuo cane",
			description: "Acquista ora il biglietto per viaggiare insieme al tuo cane",
			price: 5.0,
			imageBg: "#e5e7eb", // placeholder for image
		},
		{
			id: "lounge",
			title: "FRECCIAClub/FRECCIALounge",
			description: "Ogni momento del tuo viaggio per noi è importante",
			price: 30.0,
			imageBg: "#fee2e2", // placeholder for image
		},
		{
			id: "parking",
			title: "Parcheggio FS Park",
			description: "Prenota il tuo parcheggio nelle principali stazioni italiane.",
			priceLabel: "Prezzo in base all'offerta",
			price: 0,
			imageBg: "#e0e7ff", // placeholder for image
		},
	];

	const selectedPrice = services.find((s) => s.id === selectedService)?.price || 0;

	return (
		<View className="flex-1 bg-[#f3f4f6]">
			{/* Top Bar */}
			<View
				className="bg-[#005045] flex-row items-center justify-between px-5 pb-4"
				style={{ paddingTop: insets.top + 16 }}
			>
				<Pressable onPress={() => router.back()} className="p-2 -ml-2">
					<Icon name="arrow_back" size={24} color="white" />
				</Pressable>
				<ThemedText className="text-lg font-plus-jakarta-bold !text-white">
					Completa il viaggio
				</ThemedText>
				<View className="flex-row items-center">
					<Pressable className="p-2 mr-2">
						<Icon name="home" size={24} color="white" />
					</Pressable>
					<Pressable className="p-2 -mr-2">
						<Icon name="shopping_cart" size={24} color="white" />
					</Pressable>
				</View>
			</View>

			<TimerBar endTime={endTime} />

			<ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 100 }}>
				<ThemedText className="mt-6 mb-4 text-xl font-plus-jakarta-bold !text-gray-950">
					Aggiungi servizi al tuo viaggio
				</ThemedText>

				<View className="gap-4">
					{services.map((service) => (
						<ServiceCard
							key={service.id}
							service={service}
							isSelected={selectedService === service.id}
							onSelect={setSelectedService}
						/>
					))}
				</View>
			</ScrollView>

			{/* Bottom Footer */}
			<View className="absolute bottom-0 left-0 right-0 bg-white px-5 py-4 flex-row items-center justify-between shadow-lg" style={{ paddingBottom: insets.bottom + 16 }}>
				<View>
					<ThemedText className="text-xl font-plus-jakarta-bold !text-gray-950">
						{selectedPrice.toFixed(2).replace(".", ",")} €
					</ThemedText>
					<ThemedText className="text-sm font-plus-jakarta-medium !text-[#8a052b]">
						Vedi carrello
					</ThemedText>
				</View>
				<View className="w-1/2">
					<MainButton
						title="Continua"
						onPress={() => {
							if (selectedService) {
								router.push({
									pathname: "/complete-trip" as any,
									params: { endTime, service: selectedService, price: selectedPrice },
								});
							}
						}}
						disabled={!selectedService}
					/>
				</View>
			</View>
		</View>
	);
}
