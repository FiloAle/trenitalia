import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { MainButton } from "@/components/ui/main-button";
import { TimerBar } from "@/components/ui/timer-bar";
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
					{services.map((service) => {
						const isSelected = selectedService === service.id;

						return (
							<Pressable
								key={service.id}
								onPress={() => setSelectedService(service.id)}
								className={`overflow-hidden rounded-xl bg-white border-2 flex-row ${
									isSelected ? "border-[#005045]" : "border-gray-200"
								}`}
							>
								{/* Placeholder for left image */}
								<View
									className="w-28"
									style={{ backgroundColor: service.imageBg }}
								/>

								<View className="flex-1 p-4">
									<View className="flex-row items-start justify-between">
										<ThemedText className="flex-1 pr-2 text-base font-plus-jakarta-bold !text-gray-950">
											{service.title}
										</ThemedText>
										{!isSelected && (
											<Icon name="favorite_border" size={24} color="#1f2937" />
										)}
									</View>

									<ThemedText className="mt-1 text-sm font-plus-jakarta-medium !text-gray-600">
										{service.description}
									</ThemedText>

									<View className="mt-4 flex-row items-center justify-between">
										{service.priceLabel ? (
											<View className="rounded bg-blue-50 px-2 py-1">
												<ThemedText className="text-xs font-plus-jakarta-bold !text-blue-900">
													{service.priceLabel}
												</ThemedText>
											</View>
										) : (
											<ThemedText className="text-base font-plus-jakarta-bold !text-gray-950">
												{service.price.toFixed(2).replace(".", ",")} €
											</ThemedText>
										)}

										{isSelected ? (
											<View className="flex-row items-center gap-3">
												<View className="rounded bg-[#005045]/20 px-3 py-1">
													<ThemedText className="text-sm font-plus-jakarta-bold !text-[#005045]">
														Aggiunto
													</ThemedText>
												</View>
												<Pressable onPress={() => setSelectedService(null)}>
													<Icon name="delete_outline" size={24} color="#1f2937" />
												</Pressable>
											</View>
										) : (
											<Icon name="add" size={24} color="#1f2937" />
										)}
									</View>
								</View>
							</Pressable>
						);
					})}
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
									pathname: "/complete-trip",
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
