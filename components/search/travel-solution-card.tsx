import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import React from "react";
import { Image, Pressable, View } from "react-native";

const LOGOS = {
	Frecciarossa: require("@/assets/logos/frecciarossa.png"),
	Intercity: require("@/assets/logos/intercity.png"),
	Regionale: require("@/assets/logos/regionale.png"),
};

export type TrainType = "Frecciarossa" | "Intercity" | "Regionale";

export interface TravelSolution {
	id: string;
	trains: { type: TrainType; number: string }[];
	departureTime: string;
	arrivalTime: string;
	duration: string;
	price: number;
	originalPrice?: number;
	offerName: string;
	delay?: string;
	status?: "not_started" | "on_time" | "delayed";
}

interface TravelSolutionCardProps {
	solution: TravelSolution;
	route: { from: string; to: string };
	onPress?: () => void;
}

export function TravelSolutionCard({
	solution,
	route,
	onPress,
}: TravelSolutionCardProps) {
	const renderTrainLogos = (trains: TravelSolution["trains"]) => {
		const visibleTrains = trains.slice(0, 2);
		const extra = trains.length > 2 ? `+${trains.length - 2}` : "";

		return (
			<View className="flex-row items-center gap-1.5">
				{visibleTrains.map((train, idx) => (
					<Image
						key={idx}
						source={LOGOS[train.type]}
						style={{ height: 14, width: train.type === "Frecciarossa" ? 75 : 55 }}
						resizeMode="contain"
					/>
				))}
				{extra && (
					<ThemedText className="text-[12px] font-plus-jakarta-bold !text-gray-500">
						{extra}
					</ThemedText>
				)}
				{trains.length === 1 && (
					<ThemedText className="text-[14px] font-plus-jakarta-bold !text-gray-800 ml-1">
						{trains[0].number}
					</ThemedText>
				)}
			</View>
		);
	};

	return (
		<Pressable
			onPress={onPress}
			className="rounded-lg bg-white p-5 border border-gray-100 mb-4"
		>
			{/* Top Row: Logos & Price */}
			<View className="flex-row justify-between items-start">
				<View className="flex-1">{renderTrainLogos(solution.trains)}</View>
				<View className="items-end">
					<View className="flex-row items-baseline">
						<ThemedText className="text-[13px] font-plus-jakarta-bold !text-gray-900 mr-1.5">
							da
						</ThemedText>
						<ThemedText className="text-[20px] font-plus-jakarta-bold !text-gray-950">
							{solution.price.toFixed(2).replace(".", ",")} €
						</ThemedText>
					</View>
					{solution.originalPrice && (
						<ThemedText className="text-[12px] font-plus-jakarta-medium !text-gray-400 line-through">
							{solution.originalPrice.toFixed(2).replace(".", ",")} €
						</ThemedText>
					)}
				</View>
			</View>

			{/* Middle Row: Times & Offer */}
			<View className="flex-row justify-between items-center mt-1">
				<ThemedText className="text-[22px] font-plus-jakarta-bold !text-gray-950">
					{solution.departureTime} - {solution.arrivalTime}
				</ThemedText>
				<View className="flex-row items-center">
					<ThemedText className="text-[14px] font-plus-jakarta-bold !text-gray-500 mr-1">
						{solution.offerName}
					</ThemedText>
					<Icon name="info" size={16} className="!text-gray-400" />
				</View>
			</View>

			{/* Route Text */}
			<ThemedText className="text-[15px] font-plus-jakarta-medium !text-gray-600 mt-1">
				{route.from} - {route.to}
			</ThemedText>

			{/* Bottom Row: Duration & Status */}
			<View className="flex-row justify-between items-center mt-5">
				<View className="flex-row items-center">
					<ThemedText className="text-[14px] font-plus-jakarta-medium !text-gray-500">
						{solution.duration} •{" "}
					</ThemedText>
					<Pressable>
						<ThemedText className="text-[14px] font-plus-jakarta-bold !text-gray-800 underline">
							{solution.trains.length === 1
								? "Diretto"
								: `${solution.trains.length - 1} Cambio`}
						</ThemedText>
					</Pressable>
					<Icon name="info" size={16} className="ml-1.5 !text-gray-400" />
					<Icon name="eco" size={18} className="ml-2 !text-teal-700" />
				</View>

				{solution.delay && (
					<View className="rounded-md bg-pink-50 px-2 py-1 border border-pink-100">
						<ThemedText className="text-[13px] font-plus-jakarta-bold !text-red-500">
							{solution.delay}
						</ThemedText>
					</View>
				)}
				{solution.status === "not_started" && (
					<View className="rounded-md bg-teal-50 px-2 py-1 border border-teal-100">
						<ThemedText className="text-[13px] font-plus-jakarta-bold !text-teal-700">
							Non partito
						</ThemedText>
					</View>
				)}
			</View>

			{/* Conditional Info Cards */}
			{solution.trains.some((t) => t.type === "Intercity") && (
				<View className="mt-5 flex-row items-start gap-3 rounded-lg bg-gray-50 p-4 border border-gray-100">
					<Icon name="info" size={20} className="!text-gray-800" />
					<ThemedText className="flex-1 text-[13px] font-plus-jakarta-medium !text-gray-800 !leading-tight">
						Area Family presente in carrozza 3 su Intercity{" "}
						{solution.trains.find((t) => t.type === "Intercity")?.number}
					</ThemedText>
				</View>
			)}
			{solution.trains.some((t) => t.type === "Regionale") && (
				<View className="mt-5 flex-row items-start gap-3 rounded-lg bg-gray-50 p-4 border border-gray-100">
					<Icon name="train" size={20} className="!text-gray-800" />
					<ThemedText className="flex-1 text-[13px] font-plus-jakarta-medium !text-gray-800 !leading-tight">
						[Regionale{" "}
						{solution.trains.find((t) => t.type === "Regionale")?.number}] 450
						posti acquistabili
					</ThemedText>
				</View>
			)}
		</Pressable>
	);
}
