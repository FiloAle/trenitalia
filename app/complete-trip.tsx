import { selectedSolutionCache } from "@/api/search";
import { PassengerSelection } from "@/components/complete-trip/passenger-selection";
import { StickyFooter } from "@/components/select-offer/sticky-footer";
import { ThemedText } from "@/components/themed-text";
import { getGlobalSelectionList, setGlobalSelectionList } from "@/utils/selection-store";
import { Icon } from "@/components/ui/icon";
import { STATIONS } from "@/constants/stations";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LOGOS: Record<string, { source: any; ratio: number }> = {
	Frecciarossa: { source: require("@/assets/logos/small/f.png"), ratio: 1.4 },
	Frecciargento: { source: require("@/assets/logos/small/f.png"), ratio: 1.4 },
	Frecciabianca: { source: require("@/assets/logos/small/f.png"), ratio: 1.4 },
	FrRossa: { source: require("@/assets/logos/small/f.png"), ratio: 1.4 },
	FrArgento: { source: require("@/assets/logos/small/f.png"), ratio: 1.4 },
	FrBianca: { source: require("@/assets/logos/small/f.png"), ratio: 1.4 },

	Intercity: { source: require("@/assets/logos/small/ic.png"), ratio: 0.89 },
	InterCity: { source: require("@/assets/logos/small/ic.png"), ratio: 0.89 },
	IntercityNotte: { source: require("@/assets/logos/small/ic.png"), ratio: 0.89 },
	ICNotte: { source: require("@/assets/logos/small/ic.png"), ratio: 0.89 },
	ICnotte: { source: require("@/assets/logos/small/ic.png"), ratio: 0.89 },
	Ni: { source: require("@/assets/logos/small/ic.png"), ratio: 0.89 },
	Ic: { source: require("@/assets/logos/small/ic.png"), ratio: 0.89 },

	Regionale: { source: require("@/assets/logos/small/r.png"), ratio: 2.03 },
	Regv: { source: require("@/assets/logos/small/r.png"), ratio: 2.03 },
	RegV: { source: require("@/assets/logos/small/r.png"), ratio: 2.03 },
	Rv: { source: require("@/assets/logos/small/r.png"), ratio: 2.03 },
	Reg: { source: require("@/assets/logos/small/r.png"), ratio: 2.03 },
	Re: { source: require("@/assets/logos/small/r.png"), ratio: 2.03 },

	"Reg Tper": { source: require("@/assets/logos/small/rtper.png"), ratio: 2.13 },
	"Regv Tper": { source: require("@/assets/logos/small/rtper.png"), ratio: 2.13 },
	Ttper: { source: require("@/assets/logos/small/rtper.png"), ratio: 2.13 },

	EuroCity: { source: require("@/assets/logos/small/ec.png"), ratio: 1.1 },
	Ec: { source: require("@/assets/logos/small/ec.png"), ratio: 1.1 },
};

export default function CompleteTripScreen() {
	const insets = useSafeAreaInsets();
	const params = useLocalSearchParams();
	const endTime = Number(params.endTime);
	const price = Number(params.price) || 5.0; // Extra service price might be passed here? Wait, add-services passed basePrice.
	const basePrice = Number(params.basePrice) || 0;
	const serviceId = (params.service as string) || "dog";
	const passengerText = (params.passengerText as string) || "1 Adulto";
	const dateStr = params.dateStr as string;

	const solution = selectedSolutionCache;
	const trains = solution?.trains || [
		{
			type: "Frecciarossa",
			number: "8825",
			origin: STATIONS[0].name,
			destination: STATIONS[4].name,
			departureTime: "18:35",
			arrivalTime: "21:27",
		},
	];

	const origin = trains[0].origin;
	const destination = trains[trains.length - 1].destination;
	const departureTime = solution?.departureTime || trains[0].departureTime;
	const arrivalTime =
		solution?.arrivalTime || trains[trains.length - 1].arrivalTime;

	const displayDate = dateStr ? new Date(dateStr) : new Date();
	const months = [
		"gen",
		"feb",
		"mar",
		"apr",
		"mag",
		"giu",
		"lug",
		"ago",
		"set",
		"ott",
		"nov",
		"dic",
	];
	const dateFormatted = `${displayDate.getDate()} ${months[displayDate.getMonth()]} - ${displayDate.getFullYear()}`;

	const servicesMap: Record<
		string,
		{ title: string; description: string; passengerSelectionText: string }
	> = {
		dog: {
			title: "Viaggia con il tuo cane",
			description:
				"Acquista ora il biglietto per viaggiare insieme al tuo cane.",
			passengerSelectionText:
				"Seleziona i passeggeri che viaggiano con il cane.",
		},
		bike: {
			title: "Viaggia con la tua bici",
			description: "Viaggia portando con te la tua bici",
			passengerSelectionText: "Seleziona i passeggeri che viaggiano con la bici",
		},
		lounge: {
			title: "FRECCIAClub/FRECCIALounge",
			description: "Ogni momento del tuo viaggio per noi è importante.",
			passengerSelectionText:
				"Seleziona i passeggeri per l'accesso a FRECCIAClub/FRECCIALounge.",
		},
		parking: {
			title: "Parcheggio FS Park",
			description:
				"Prenota il tuo parcheggio nelle principali stazioni italiane.",
			passengerSelectionText:
				"Seleziona i passeggeri che usufruiscono del parcheggio.",
		},
	};
	const serviceInfo = servicesMap[serviceId] || servicesMap.dog;

	const [acceptedTerms, setAcceptedTerms] = useState(false);
	const [selectedPassengerIds, setSelectedPassengerIds] = useState<string[]>([]);
	const passengers = getGlobalSelectionList().filter(p => p.itemType === "passenger");
	const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(true);

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
							Completa il viaggio
						</ThemedText>
					</View>
					<View className="flex-1" />
				</View>

			<ScrollView
				className="flex-1"
				contentContainerStyle={{ paddingBottom: 100 }}
			>
				{/* Service Header */}
				<View
					className={`px-5 pt-0 ${isDescriptionExpanded ? "pb-5" : "pb-3"}`}
				>
					<Pressable
						className={`flex-row items-center justify-between ${isDescriptionExpanded ? "mb-2" : ""}`}
						onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
					>
						<View className="flex-row items-center">
							<ThemedText className="text-[15px] font-google-sans-semibold !text-gray-950 mr-2">
								{serviceInfo.title}
							</ThemedText>
							<Icon name="info" size={18} color="#4b5563" />
						</View>
						<Icon
							name={isDescriptionExpanded ? "expand_less" : "expand_more"}
							size={24}
							color="#4b5563"
						/>
					</Pressable>
					{isDescriptionExpanded && (
						<ThemedText className="text-[14px] font-google-sans-medium !text-gray-700 leading-tight">
							{serviceInfo.description}
						</ThemedText>
					)}
				</View>

				{/* Separator */}
				<View className="h-2 w-full bg-[#f3f4f6]" />

				{/* Ticket Context */}
				<View className="bg-white px-5 py-4 ">
					<View className="flex-row items-center flex-wrap gap-x-1.5 gap-y-2 mb-2">
						{(() => {
							let currentWidth = 0;
							const visibleTrains = [];
							let hiddenCount = 0;
							const MAX_WIDTH = 280; // slightly wider than ticket card

							for (let i = 0; i < trains.length; i++) {
								const t = trains[i];
								const normalizedType = t.type.trim().toLowerCase();
								const logoKey = Object.keys(LOGOS).find(
									(k) => k.toLowerCase() === normalizedType,
								);
								const logoData = logoKey ? LOGOS[logoKey] : undefined;
								const w = logoData ? 14 * logoData.ratio : 55;

								if (
									trains.length > 1 &&
									currentWidth + w + (i < trains.length - 1 ? 30 : 0) >
										MAX_WIDTH
								) {
									hiddenCount = trains.length - i;
									break;
								}

								visibleTrains.push(t);
								currentWidth += w + 6;
							}

							return (
								<>
									{visibleTrains.map((t: any, idx: number) => {
										const normalizedType = t.type.trim().toLowerCase();
										const logoKey = Object.keys(LOGOS).find(
											(k) => k.toLowerCase() === normalizedType,
										);
										const logoData = logoKey ? LOGOS[logoKey] : undefined;

										return (
											<View key={idx} className="flex-row items-center">
												{logoData ? (
													<Image
														source={logoData.source}
														style={{
															height: 14,
															width: 14 * logoData.ratio,
															marginTop: -2,
														}}
														contentFit="contain"
													/>
												) : (
													<View className="bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
														<ThemedText className="text-[11px] font-google-sans-bold !text-gray-700 capitalize">
															{t.type}
														</ThemedText>
													</View>
												)}
											</View>
										);
									})}
									{hiddenCount > 0 && (
										<ThemedText className="text-[12px] font-google-sans-bold !text-gray-500">
											+{hiddenCount}
										</ThemedText>
									)}
									{trains.length === 1 && (
										<ThemedText className="text-[12px] font-google-sans-regular !text-gray-800 ml-1">
											{trains[0].number}
										</ThemedText>
									)}
								</>
							);
						})()}
					</View>
					<ThemedText className="text-base font-google-sans-bold !text-gray-950 mb-1">
						{origin} - {destination}
					</ThemedText>
					<View className="flex-row items-center">
						<Icon
							name="calendar_today"
							size={16}
							color="#4b5563"
							className="mr-1"
						/>
						<ThemedText className="text-sm font-google-sans-medium !text-gray-700 mr-3">
							{dateFormatted}, {departureTime} - {arrivalTime}
						</ThemedText>
						<Icon name="person" size={16} color="#4b5563" className="mr-1" />
						<ThemedText className="text-sm font-google-sans-medium !text-gray-700">
							{passengerText}
						</ThemedText>
					</View>
				</View>

				{/* Passenger Selection */}
				<PassengerSelection
						price={price}
						acceptedTerms={acceptedTerms}
						onToggleTerms={() => setAcceptedTerms(!acceptedTerms)}
						passengers={passengers}
						selectedPassengerIds={selectedPassengerIds}
						onTogglePassenger={(id) => {
							setSelectedPassengerIds(prev => 
								prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
							);
						}}
						instructionText={serviceInfo.passengerSelectionText}
					/>
			</ScrollView>

			<StickyFooter
					totalPrice={selectedPassengerIds.length * price}
					basePrice={0}
					buttonTitle="Conferma"
					subtitle={selectedPassengerIds.length === 1 ? "1 Servizio" : `${selectedPassengerIds.length} Servizi`}
					hideSeatSelection={true}
					disabled={selectedPassengerIds.length === 0 || !acceptedTerms}
					onPress={() => {
						const globalList = getGlobalSelectionList();
						const newItems = selectedPassengerIds.map(pid => ({
							id: Math.random().toString(),
							itemType: "service" as const,
							type: (serviceId === "dog" || serviceId === "bike") ? (serviceId === "dog" ? "Animale" : "Bicicletta") : serviceInfo.title,
							name: (serviceId === "dog" || serviceId === "bike") ? (serviceId === "dog" ? "Animale" : "Bicicletta") : serviceInfo.title,
							price: price,
						}));
						setGlobalSelectionList([...globalList, ...newItems]);
						router.dismiss(2);
					}}
				/>
		</View>
	);
}
