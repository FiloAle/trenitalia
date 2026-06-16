import { selectedSolutionCache } from "@/api/search";
import { PassengerSelection } from "@/components/complete-trip/passenger-selection";
import { StickyFooter } from "@/components/select-offer/sticky-footer";
import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { STATIONS } from "@/constants/stations";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { setNewlyAddedService } from "./add-services";

const LOGOS: Record<string, any> = {
	Frecciarossa: require("@/assets/logos/frecciarossa.png"),
	FRRossa: require("@/assets/logos/frecciarossa.png"),
	Intercity: require("@/assets/logos/intercity.png"),
	InterCity: require("@/assets/logos/intercity.png"),
	IntercityNotte: require("@/assets/logos/intercity.png"),
	ICNotte: require("@/assets/logos/intercity.png"),
	Regionale: require("@/assets/logos/regionale.png"),
	Reg: require("@/assets/logos/regionale.png"),
	RegV: require("@/assets/logos/regionale.png"),
	Regv: require("@/assets/logos/regionale.png"),
	"Reg Tper": require("@/assets/logos/tper.png"),
	"Regv Tper": require("@/assets/logos/tper.png"),
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
	const [isServiceSelected, setIsServiceSelected] = useState(true);
	const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(true);

	return (
		<View className="flex-1 bg-white">
			{/* Top Bar */}
			<View
				className="bg-white px-5"
				style={{ paddingTop: insets.top + 4, paddingBottom: 12 }}
			>
				<View className="flex-row items-center justify-between relative">
					<View className="w-10" />

					<View className="absolute left-0 right-0 top-0 bottom-0 items-center justify-center pointer-events-none">
						<ThemedText className="text-[17px] font-plus-jakarta-bold !text-gray-950">
							Completa il viaggio
						</ThemedText>
					</View>

					<Pressable onPress={() => router.back()} className="p-2 -mr-2 z-10">
						<Icon name="close" size={26} color="black" />
					</Pressable>
				</View>
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
							<ThemedText className="text-[15px] font-plus-jakarta-semibold !text-gray-950 mr-2">
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
						<ThemedText className="text-[14px] font-plus-jakarta-medium !text-gray-700 leading-tight">
							{serviceInfo.description}
						</ThemedText>
					)}
				</View>

				{/* Separator */}
				<View className="h-2 w-full bg-[#f3f4f6]" />

				{/* Ticket Context */}
				<View className="bg-white px-5 py-4 border-b border-gray-100">
					<View className="flex-row items-center flex-wrap gap-x-1.5 gap-y-2 mb-2">
						{(() => {
							let currentWidth = 0;
							const visibleTrains = [];
							let hiddenCount = 0;
							const MAX_WIDTH = 280; // slightly wider than ticket card

							for (let i = 0; i < trains.length; i++) {
								const t = trains[i];
								const normalizedType = t.type.trim().toLowerCase();
								const w =
									normalizedType.includes("frecciarossa") ||
									normalizedType === "frrossa"
										? 75
										: 55;

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
										const logoSource = logoKey ? LOGOS[logoKey] : undefined;

										return (
											<View key={idx} className="flex-row items-center">
												{logoSource ? (
													<Image
														source={logoSource}
														style={{
															width:
																normalizedType.includes("frecciarossa") ||
																normalizedType === "frrossa"
																	? 75
																	: 55,
															height: 12,
														}}
														resizeMode="contain"
													/>
												) : (
													<View className="bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
														<ThemedText className="text-[11px] font-plus-jakarta-bold !text-gray-700 capitalize">
															{t.type}
														</ThemedText>
													</View>
												)}
											</View>
										);
									})}
									{hiddenCount > 0 && (
										<ThemedText className="text-[12px] font-plus-jakarta-bold !text-gray-500">
											+{hiddenCount}
										</ThemedText>
									)}
									{trains.length === 1 && (
										<ThemedText className="text-sm font-plus-jakarta-bold !text-gray-900 ml-1">
											{trains[0].number}
										</ThemedText>
									)}
								</>
							);
						})()}
					</View>
					<ThemedText className="text-base font-plus-jakarta-bold !text-gray-950 mb-1">
						{origin} - {destination}
					</ThemedText>
					<View className="flex-row items-center">
						<Icon
							name="calendar_today"
							size={16}
							color="#4b5563"
							className="mr-1"
						/>
						<ThemedText className="text-sm font-plus-jakarta-medium !text-gray-700 mr-3">
							{dateFormatted}, {departureTime} - {arrivalTime}
						</ThemedText>
						<Icon name="person" size={16} color="#4b5563" className="mr-1" />
						<ThemedText className="text-sm font-plus-jakarta-medium !text-gray-700">
							{passengerText}
						</ThemedText>
					</View>
				</View>

				{/* Passenger Selection */}
				<PassengerSelection
					price={price}
					acceptedTerms={acceptedTerms}
					onToggleTerms={() => setAcceptedTerms(!acceptedTerms)}
					isServiceSelected={isServiceSelected}
					onToggleService={() => setIsServiceSelected(!isServiceSelected)}
					instructionText={serviceInfo.passengerSelectionText}
				/>
			</ScrollView>

			<StickyFooter
				totalPrice={isServiceSelected ? price : 0}
				basePrice={0}
				buttonTitle="Conferma"
				subtitle={isServiceSelected ? "1 Servizio" : "0 Servizi"}
				hideSeatSelection={true}
				disabled={!isServiceSelected || !acceptedTerms}
				onPress={() => {
					setNewlyAddedService(serviceId);
					router.back();
				}}
			/>
		</View>
	);
}
