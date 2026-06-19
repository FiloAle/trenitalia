import { selectedSolutionCache } from "@/api/search";
import { ServiceCard } from "@/components/services/service-card";
import { StickyFooter } from "@/components/select-offer/sticky-footer";
import { ThemedText } from "@/components/themed-text";
import { getGlobalSelectionList, setGlobalSelectionList } from "@/utils/selection-store";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "@/components/ui/icon";



export default function AddServicesScreen() {
	const insets = useSafeAreaInsets();
	const params = useLocalSearchParams();
	const endTime = Number(params.endTime);
	const basePrice = Number(params.price) || 0;

	const addedServiceParam = params.addedService as string;

	const [selectedService, setSelectedService] = useState<string | null>(
		addedServiceParam || null,
	);

	React.useEffect(() => {
		if (addedServiceParam) {
			setSelectedService(addedServiceParam);
		}
	}, [addedServiceParam]);


	const handleServiceSelect = (id: string | null) => {
		if (id) {
			const extraPrice = services.find((s) => s.id === id)?.price || 0;
			router.push({
				pathname: "/complete-trip" as any,
				params: { endTime, service: id, price: extraPrice, basePrice },
			});
		} else {
			setSelectedService(null);
		}
	};
		const firstTrain = selectedSolutionCache?.trains?.[0]?.type?.toLowerCase() || "";
		const hasFrecciaFirst = firstTrain.includes("freccia") || firstTrain.includes("fr");
		const hasAnyFreccia = selectedSolutionCache?.trains?.some((t: any) => {
			const tt = t.type?.toLowerCase() || "";
			return tt.includes("freccia") || tt.includes("fr");
		});

		const allServices = [
			{
				id: "dog",
				title: "Viaggia con il tuo cane",
				description:
					"Acquista ora il biglietto per viaggiare insieme al tuo cane.",
				price: 5.0,
				image: require("@/assets/images/dog.webp"),
			},
			{
				id: "bike",
				title: "Viaggia con la tua bici",
				description: "Viaggia portando con te la tua bici",
				subtitle: "Seleziona i passeggeri che viaggiano con la bici",
				price: 5.0,
				image: require("@/assets/images/dog.webp"), // Temp image
			},
			{
				id: "lounge",
				title: "FRECCIAClub/FRECCIALounge",
				description: "Ogni momento del tuo viaggio per noi è importante.",
				price: 30.0,
				image: require("@/assets/images/lounge.webp"),
			},
			{
				id: "parking",
				title: "Parcheggio FS Park",
				description:
					"Prenota il tuo parcheggio nelle principali stazioni italiane.",
				priceLabel: "Prezzo in base all'offerta",
				price: 0,
				image: require("@/assets/images/parking.webp"),
			},
		];

		const services = allServices.filter(s => {
			if (s.id === "lounge") return hasFrecciaFirst;
			if (s.id === "bike") return !hasAnyFreccia;
			return true;
		});


	const selectedPrice =
		services.find((s) => s.id === selectedService)?.price || 0;

	return (
		<View className="flex-1 bg-white">
			{/* Header Modale */}
			<View className="flex-row items-center justify-between px-5 pt-14 pb-4 bg-white ">
				<View className="flex-1 items-start justify-center">
					<Pressable
						onPress={() => router.back()}
						className="p-1 -ml-1"
					>
						<Icon name="close" size={26} className="!text-gray-900" />
					</Pressable>
				</View>
				<View className="flex-[2] items-center justify-center">
					<ThemedText className="text-[18px] font-google-sans-bold !text-gray-950 text-center">
						Servizi aggiuntivi
					</ThemedText>
				</View>
				<View className="flex-1" />
			</View>

			<ScrollView
				className="flex-1 bg-gray-50 px-5 pt-6"
				contentContainerStyle={{ paddingBottom: 100 }}
			>
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
				buttonTitle="Conferma"
				hideSeatSelection={true}
				disabled={false}
				onPress={() => {
					router.back();
				}}
			/>
		</View>
	);
}
