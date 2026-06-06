import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, View } from "react-native";
import { USER_DATA } from "@/constants/user";
import { generateAztec, getCachedAztec } from "@/utils/aztec";

interface TicketCardProps {
	dateString: string;
	origin: string;
	destination: string;
	departureTime: string;
	arrivalTime: string;
	pnr: string;
	trainType?: string;
	cp?: string;
	carrozza?: string;
	posto?: string;
	onOpenDettagli: () => void;
}

export function TicketCard({
	dateString,
	origin,
	destination,
	departureTime,
	arrivalTime,
	pnr,
	trainType = "Frecciarossa",
	cp,
	carrozza,
	posto,
	onOpenDettagli,
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
		switch (trainType) {
			case "Regionale":
				return require("../../assets/logos/regionale.png");
			case "Intercity":
				return require("../../assets/logos/intercity.png");
			case "Frecciarossa":
			default:
				return require("../../assets/logos/frecciarossa.png");
		}
	};

	const [aztecImageUri, setAztecImageUri] = useState<string | null>(getCachedAztec(qrValue, 16));

	useEffect(() => {
		// Use scale 16 here as well so it's pre-cached for the full-screen modal!
		generateAztec(qrValue, 16)
			.then((uri) => setAztecImageUri(uri))
			.catch((err) => console.error("Aztec code generation error:", err));
	}, [qrValue]);

	return (
		<View className="mt-1.5 overflow-hidden rounded-lg bg-white border border-gray-200">
			{/* Top row: Train and Date */}
			<View className="flex-row items-center justify-between border-b border-gray-100 px-5 py-3">
				<View className="flex-row items-center">
					<View>
						<Image
							source={getTrainLogo()}
							style={{ width: 100, height: 16 }}
							resizeMode="contain"
						/>
					</View>
					<ThemedText className="ml-2 text-base font-plus-jakarta-medium !text-gray-900">
						8825
					</ThemedText>
				</View>
				<ThemedText className="text-base font-plus-jakarta-bold !text-gray-900">
					{dateString}
				</ThemedText>
			</View>

			{/* Middle section: Route and Times */}
			<View className="px-5 pb-5 pt-3">
				<View className="mb-4">
					{/* Station Names Row */}
					<View className="flex-row justify-between items-center mb-0.5">
						<ThemedText className="flex-1 text-base font-plus-jakarta !text-gray-900">
							{origin}
						</ThemedText>
						<ThemedText className="flex-1 text-right text-base font-plus-jakarta !text-gray-900">
							{destination}
						</ThemedText>
					</View>

					{/* Times and Arrow Row */}
					<View className="flex-row items-center justify-between">
						<ThemedText className="flex-1 text-[26px] font-plus-jakarta-bold !text-gray-900">
							{departureTime}
						</ThemedText>
						
						<View className="px-4">
							<Icon name="arrow_forward" size={24} color="#9ca3af" />
						</View>
						
						<ThemedText className="flex-1 text-right text-[26px] font-plus-jakarta-bold !text-gray-900">
							{arrivalTime}
						</ThemedText>
					</View>
				</View>

				{/* Codes row */}
				<View className="flex-row justify-between mb-6 gap-2">
					<View className="flex-1 rounded-lg bg-gray-100 p-2">
						<View className="flex-row items-center justify-between mb-0.5">
							<ThemedText className="text-sm font-plus-jakarta-medium !text-gray-500">
								PNR
							</ThemedText>
							<Icon name="content_copy" size={14} color="#6b7280" />
						</View>
						<ThemedText className="text-base font-plus-jakarta-bold !text-gray-900">
							{pnr}
						</ThemedText>
					</View>
					{/* Conditionally render CP */}
					{cp && (
						<View className="flex-1 rounded-lg bg-gray-100 p-2">
							<ThemedText className="text-sm font-plus-jakarta-medium !text-gray-500 mb-0.5">
								CP
							</ThemedText>
							<ThemedText className="text-base font-plus-jakarta-bold !text-gray-900">
								{cp}
							</ThemedText>
						</View>
					)}

					{/* Conditionally render Carrozza/Posto (Not for Regionale) */}
					{trainType !== "Regionale" && carrozza && posto && (
						<View className="flex-1 rounded-lg bg-gray-100 p-2">
							<ThemedText className="text-sm font-plus-jakarta-medium !text-gray-500 mb-0.5" numberOfLines={1} adjustsFontSizeToFit>
								CARR.-POSTO
							</ThemedText>
							<View className="flex-row items-center justify-between">
								<ThemedText className="text-base font-plus-jakarta-bold !text-gray-900">
									{carrozza}-{posto}
								</ThemedText>
							</View>
						</View>
					)}
				</View>

				{/* QR Code Block */}
				<Pressable
					className="items-center justify-center py-3"
					onPress={() => router.push({ pathname: "/qr-code" as any, params: { pnr } })}
				>
					{aztecImageUri ? (
						<Image
							source={{ uri: aztecImageUri }}
							style={{ width: 100, height: 100 }}
							resizeMode="contain"
						/>
					) : (
						<ActivityIndicator size="small" color="#005045" />
					)}
				</Pressable>
			</View>

			{/* Ticket Type and Price */}
			<View className="flex-row items-center justify-between border-t border-gray-100 px-5 py-3">
				<View className="flex-row items-center">
					<Icon name="confirmation_number" size={24} color="#000" />
					<ThemedText className="ml-2 text-base font-plus-jakarta-medium !text-gray-900">
						STANDARD / Super Economy
					</ThemedText>
				</View>
				<ThemedText className="text-lg font-plus-jakarta-bold !text-gray-900">
					19,70€
				</ThemedText>
			</View>

			{/* Maggiori Dettagli */}
			<Pressable
				className="border-t border-gray-100 py-4 active:bg-gray-50"
				onPress={onOpenDettagli}
			>
				<ThemedText className="text-center text-[15px] font-plus-jakarta-bold !text-gray-900">
					Maggiori Dettagli
				</ThemedText>
			</Pressable>
		</View>
	);
}
