import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { MainButton } from "@/components/ui/main-button";
import { TimerBar } from "@/components/ui/timer-bar";
import { ServiceCard } from "@/components/services/service-card";
import { router, useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CheckoutHeader } from "@/components/checkout-header";
import { StickyFooter } from "@/components/select-offer/sticky-footer";

export let newlyAddedService: string | null = null;
export function setNewlyAddedService(val: string | null) {
	newlyAddedService = val;
}

export default function AddServicesScreen() {
	const insets = useSafeAreaInsets();
	const params = useLocalSearchParams();
	const endTime = Number(params.endTime);
	const basePrice = Number(params.price) || 0;

	const addedServiceParam = params.addedService as string;

	const [selectedService, setSelectedService] = useState<string | null>(addedServiceParam || null);

	React.useEffect(() => {
		if (addedServiceParam) {
			setSelectedService(addedServiceParam);
		}
	}, [addedServiceParam]);

	useFocusEffect(
		useCallback(() => {
			if (newlyAddedService) {
				setSelectedService(newlyAddedService);
				newlyAddedService = null;
			}
		}, [])
	);

	const handleServiceSelect = (id: string | null) => {
		if (id) {
			const extraPrice = services.find(s => s.id === id)?.price || 0;
			router.push({
				pathname: "/complete-trip" as any,
				params: { endTime, service: id, price: extraPrice, basePrice },
			});
		} else {
			setSelectedService(null);
		}
	};

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
		<View className="flex-1 bg-white">
			<CheckoutHeader title="Completa il viaggio" />

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
							onSelect={handleServiceSelect}
						/>
					))}
				</View>
			</ScrollView>

			<StickyFooter
				totalPrice={basePrice + selectedPrice}
				basePrice={basePrice}
				buttonTitle="Continua"
				hideSeatSelection={true}
				disabled={false}
				onPress={() => {
					router.push({
						pathname: "/payment" as any,
						params: { endTime, price: basePrice + selectedPrice, isAddService: params.isAddService },
					});
				}}
			/>
		</View>
	);
}
