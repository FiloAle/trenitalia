import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { USER_DATA } from "@/constants/user";
import { generateAztec, getCachedAztec } from "@/utils/aztec";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, View } from "react-native";

interface TicketCardProps {
	dateString: string;
	origin: string;
	destination: string;
	departureTime: string;
	arrivalTime: string;
	pnr: string;
	trainType?: string;
	trainNumber: string;
	cp?: string;
	carrozza?: string;
	posto?: string;
	passengerClass?: string;
	offer?: string;
	price?: number;
	departurePlatform?: string;
	arrivalPlatform?: string;
}

const LOGOS: Record<string, any> = {
	Frecciarossa: require("../../assets/logos/frecciarossa.png"),
	FRRossa: require("../../assets/logos/frecciarossa.png"),
	Intercity: require("../../assets/logos/intercity.png"),
	InterCity: require("../../assets/logos/intercity.png"),
	IntercityNotte: require("../../assets/logos/intercity.png"),
	ICNotte: require("../../assets/logos/intercity.png"),
	Regionale: require("../../assets/logos/regionale.png"),
	Reg: require("../../assets/logos/regionale.png"),
	RegV: require("../../assets/logos/regionale.png"),
	Regv: require("../../assets/logos/regionale.png"),
	"Reg Tper": require("../../assets/logos/tper.png"),
	"Regv Tper": require("../../assets/logos/tper.png"),
};

const TrainVisualization = ({ trainSection }: { trainSection: string | null }) => {
	const isTesta = trainSection === "Testa";
	const isCentro = trainSection === "Centro";
	const isCoda = trainSection === "Coda";

	return (
		<View className="items-center py-2 border-b border-gray-100">
			<View className="flex-row items-end gap-1.5">
				<View className={`h-6 w-12 border-2 rounded-l-xl rounded-r-sm ${isTesta ? "border-[#005045]" : "border-gray-300"}`} />
				<View className={`h-6 w-12 border-2 rounded-sm ${isCentro ? "border-[#005045]" : "border-gray-300"}`} />
				<View className={`h-6 w-12 border-2 rounded-r-xl rounded-l-sm ${isCoda ? "border-[#005045]" : "border-gray-300"} justify-end items-end p-0.5`}>
					<Icon name="person" size={14} color={isCoda ? "#005045" : "#9ca3af"} />
				</View>
			</View>
			{trainSection && (
				<ThemedText className="text-[11px] font-plus-jakarta-bold !text-[#005045] mt-1 uppercase">
					Sali {isTesta ? "in testa" : isCentro ? "al centro" : "in coda"}
				</ThemedText>
			)}
		</View>
	);
};

export function TicketCard({
	dateString,
	origin,
	destination,
	departureTime,
	arrivalTime,
	pnr,
	trainType = "Frecciarossa",
	trainNumber,
	cp,
	carrozza,
	posto,
	passengerClass = "Standard",
	offer = "Super Economy",
	price,
	departurePlatform = "17",
	arrivalPlatform = "5",
}: TicketCardProps) {
	const qrValue =
		USER_DATA.firstName +
		"|" +
		USER_DATA.lastName +
		"|" +
		USER_DATA.loyaltyCode +
		"|" +
		pnr;

	const getTrainLogo = () => {
		const normalizedType = trainType.trim().toLowerCase();
		const logoKey = Object.keys(LOGOS).find(
			(k) => k.toLowerCase() === normalizedType,
		);
		return logoKey ? LOGOS[logoKey] : LOGOS["Frecciarossa"];
	};

	const getLogoWidth = () => {
		const normalizedType = trainType.trim().toLowerCase();
		return normalizedType.includes("frecciarossa") || normalizedType === "frrossa"
			? 90
			: 55;
	};

	const [aztecImageUri, setAztecImageUri] = useState<string | null>(
		getCachedAztec(qrValue, 16),
	);
	const [isExpanded, setIsExpanded] = useState(false);

	useEffect(() => {
		// Use scale 16 here as well so it's pre-cached for the full-screen modal!
		generateAztec(qrValue, 16)
			.then((uri) => setAztecImageUri(uri))
			.catch((err) => console.error("Aztec code generation error:", err));
	}, [qrValue]);

	const checkIsToday = () => {
		const [d, m, y] = dateString.split('/');
		if (!d || !m || !y) return false;
		const ticketDate = new Date(Number(y), Number(m) - 1, Number(d));
		const today = new Date();
		return ticketDate.toDateString() === today.toDateString();
	};

	const isToday = checkIsToday();

	const getTrainSection = (carrozzaStr?: string) => {
		if (!carrozzaStr) return null;
		const num = parseInt(carrozzaStr, 10);
		if (isNaN(num)) return null;
		if (num >= 1 && num <= 4) return "Testa";
		if (num >= 5 && num <= 8) return "Centro";
		if (num >= 9 && num <= 11) return "Coda";
		return null;
	};

	const trainSection = getTrainSection(carrozza);

	return (
		<View className="mt-1.5 overflow-hidden rounded-xl bg-white border border-gray-200">
			{/* Top row: Train and Date/Delay */}
			<View className="flex-row items-center justify-between border-b border-gray-100 px-4 py-4">
				<Pressable className="flex-row items-center active:opacity-60" onPress={() => router.push("/train-details")}>
					<View>
						<Image
							source={getTrainLogo()}
							style={{ width: getLogoWidth(), height: 16 }}
							resizeMode="contain"
						/>
					</View>
					<ThemedText className="ml-2 text-base font-plus-jakarta-bold !text-gray-900">
						{trainNumber}
					</ThemedText>
				</Pressable>
				{isToday ? (
					<Pressable className="flex-row items-center gap-1.5 active:opacity-60" onPress={() => router.push("/train-details")}>
						<View className="bg-red-50 px-2 py-1 rounded border border-red-200">
							<ThemedText className="text-sm font-plus-jakarta-bold !text-red-500">
								+12 MIN
							</ThemedText>
						</View>
					</Pressable>
				) : (
					<ThemedText className="text-base font-plus-jakarta-bold !text-gray-900">
						{dateString}
					</ThemedText>
				)}
			</View>

			{/* Middle section: Route and Times */}
			<View className="px-4 py-4 border-b border-gray-100">
				<View className="flex-row justify-between mb-1">
					<ThemedText className="flex-1 text-[15px] font-plus-jakarta !text-gray-900">
						{origin}
					</ThemedText>
					<ThemedText className="flex-1 text-right text-[15px] font-plus-jakarta !text-gray-900">
						{destination}
					</ThemedText>
				</View>

				<View className="flex-row items-center justify-between">
					<View>
						<ThemedText className="text-[26px] font-plus-jakarta-bold !text-gray-900">
							{departureTime}
						</ThemedText>
						{isToday && (
							<ThemedText className="text-[13px] font-plus-jakarta-bold !text-[#005045] uppercase mt-0.5">
								BIN {departurePlatform}
							</ThemedText>
						)}
					</View>

					<Icon name="arrow-forward" size={24} color="#6b7280" />

					<View className="items-end">
						<ThemedText className="text-[26px] font-plus-jakarta-bold !text-gray-900">
							{arrivalTime}
						</ThemedText>
						{isToday && (
							<ThemedText className="text-[13px] font-plus-jakarta-bold text-gray-500 uppercase mt-0.5">
								BIN {arrivalPlatform}
							</ThemedText>
						)}
					</View>
				</View>
			</View>

			{/* Passenger */}
			<View className="px-4 pt-4 pb-2">
				<View className="flex-row items-center">
					<Icon name="person-outline" size={20} color="#6b7280" />
					<ThemedText className="ml-2 font-plus-jakarta-bold text-[15px] !text-gray-900">
						{USER_DATA.firstName} {USER_DATA.lastName}
					</ThemedText>
				</View>
			</View>

			{/* Train visualization centered */}
			{isToday && <TrainVisualization trainSection={trainSection} />}

			{/* Classe, Carrozza, Posto and QR */}
			<View className="flex-row px-4 pt-3 pb-4">
				<View className="flex-1 justify-between py-1 gap-4">
					<View>
						<ThemedText className="text-[13px] font-plus-jakarta !text-gray-500">
							Classe
						</ThemedText>
						<ThemedText className="text-[16px] font-plus-jakarta-bold !text-gray-900 mt-0.5">
							{passengerClass}
						</ThemedText>
					</View>
					<View>
						<ThemedText className="text-[13px] font-plus-jakarta !text-gray-500">
							Carrozza
						</ThemedText>
						<ThemedText className="text-[16px] font-plus-jakarta-bold !text-gray-900 mt-0.5">
							{carrozza || "-"}
						</ThemedText>
					</View>
					<View>
						<ThemedText className="text-[13px] font-plus-jakarta !text-gray-500">
							Posto
						</ThemedText>
						<ThemedText className="text-[16px] font-plus-jakarta-bold !text-gray-900 mt-0.5">
							{posto || "-"}
						</ThemedText>
					</View>
				</View>
				<Pressable
					className="items-center justify-center pl-4"
					onPress={() => router.push({ pathname: "/qr-code" as any, params: { pnr } })}
				>
					{aztecImageUri ? (
						<Image
							source={{ uri: aztecImageUri }}
							style={{ width: 140, height: 140 }}
							resizeMode="contain"
						/>
					) : (
						<View style={{ width: 140, height: 140 }} className="items-center justify-center">
							<ActivityIndicator size="small" color="#005045" />
						</View>
					)}
				</Pressable>
			</View>

			{/* Expanded Details */}
			{isExpanded && (
				<View className="px-4 py-5 border-t border-gray-100 gap-4 bg-white">
					<View className="flex-row justify-between items-center">
						<ThemedText className="font-plus-jakarta text-[15px] !text-gray-600">
							PNR
						</ThemedText>
						<ThemedText className="font-plus-jakarta-bold text-[15px] !text-gray-900">
							{pnr}
						</ThemedText>
					</View>
					{cp && (
						<View className="flex-row justify-between items-center">
							<ThemedText className="font-plus-jakarta text-[15px] !text-gray-600">
								CP
							</ThemedText>
							<ThemedText className="font-plus-jakarta-bold text-[15px] !text-gray-900">
								{cp}
							</ThemedText>
						</View>
					)}
					<View className="flex-row justify-between items-center">
						<ThemedText className="font-plus-jakarta text-[15px] !text-gray-600">
							Offerta
						</ThemedText>
						<ThemedText className="font-plus-jakarta-bold text-[15px] !text-gray-900">
							{offer}
						</ThemedText>
					</View>
					{price !== undefined && (
						<View className="flex-row justify-between items-center">
							<ThemedText className="font-plus-jakarta text-[15px] !text-gray-600">
								Prezzo
							</ThemedText>
							<ThemedText className="font-plus-jakarta-bold text-[15px] !text-gray-900">
								{price.toFixed(2).replace(".", ",")}€
							</ThemedText>
						</View>
					)}
					<View className="flex-row justify-between items-center">
						<ThemedText className="font-plus-jakarta text-[15px] !text-gray-600">
							Punti CartaFreccia
						</ThemedText>
						<ThemedText className="font-plus-jakarta-bold text-[15px] !text-gray-900">
							{price !== undefined ? price.toFixed(2).replace(".", ",") : "19,70"}
						</ThemedText>
					</View>
					<View className="flex-row justify-between items-center">
						<ThemedText className="font-plus-jakarta text-[15px] !text-gray-600">
							CO2 risparmiata
						</ThemedText>
						<ThemedText className="font-plus-jakarta-bold text-[15px] !text-gray-900">
							-24.88 Kg
						</ThemedText>
					</View>
				</View>
			)}

			{/* Maggiori Dettagli */}
			<Pressable
				className="flex-row justify-center items-center border-t border-gray-100 py-4 active:bg-gray-50"
				onPress={() => setIsExpanded(!isExpanded)}
			>
				<ThemedText className="text-center text-[15px] font-plus-jakarta-bold !text-gray-900 mr-1">
					{isExpanded ? "Mostra meno" : "Maggiori dettagli"}
				</ThemedText>
				<Icon name={isExpanded ? "expand-less" : "expand-more"} size={22} color="#1f2937" />
			</Pressable>
		</View>
	);
}

