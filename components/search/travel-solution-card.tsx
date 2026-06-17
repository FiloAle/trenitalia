import { getTrainDelay } from "@/api/delay";
import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { useEffect, useState } from "react";
import { Image, Pressable, View } from "react-native";

const LOGOS: Record<string, any> = {
	Frecciarossa: require("@/assets/logos/frecciarossa.png"),
	Intercity: require("@/assets/logos/intercity.png"),
	InterCity: require("@/assets/logos/intercity.png"),
	Regionale: require("@/assets/logos/regionale.png"),
	FrRossa: require("@/assets/logos/frecciarossa.png"),
	ICnotte: require("@/assets/logos/intercity.png"),
	Regv: require("@/assets/logos/regionale.png"),
	Reg: require("@/assets/logos/regionale.png"),
	"Reg Tper": require("@/assets/logos/tper.png"),
	"Regv Tper": require("@/assets/logos/tper.png"),
};

const getAvailableSeats = (trainNumber: string) => {
	let hash = 0;
	for (let i = 0; i < trainNumber.length; i++) {
		hash = trainNumber.charCodeAt(i) + ((hash << 5) - hash);
	}
	return 100 + (Math.abs(hash) % 451);
};

export type TrainType = string;

export interface TravelSolution {
	id: string;
	date?: string;
	trains: {
		type: TrainType;
		number: string;
		origin?: string;
		destination?: string;
		departureTime?: string;
		arrivalTime?: string;
	}[];
	departureTime: string;
	arrivalTime: string;
	duration: string;
	price: number;
	originalPrice?: number;
	offerName: string;
	delay?: string;
	tickets?: any[];
	status?: "not_started" | "on_time" | "delayed";
}

interface TravelSolutionCardProps {
	solution: TravelSolution;
	route: { from: string; to: string };
	searchDate?: Date;
	onPress?: () => void;
	onPressInfo?: () => void;
}

export function TravelSolutionCard({
	solution,
	route,
	searchDate,
	onPress,
	onPressInfo,
}: TravelSolutionCardProps) {
	const [liveDelay, setLiveDelay] = useState<string | null>(null);

	useEffect(() => {
		async function fetchDelay() {
			if (!searchDate) return;

			const isToday =
				searchDate.getDate() === new Date().getDate() &&
				searchDate.getMonth() === new Date().getMonth() &&
				searchDate.getFullYear() === new Date().getFullYear();

			// "per ogni treno diretto che mostriamo nelle ricerche PER OGGI... mostriamo il ritardo"
			if (isToday && solution.trains.length === 1) {
				const delay = await getTrainDelay(
					route.from,
					solution.trains[0].number,
				);
				setLiveDelay(delay);
			}
		}
		fetchDelay();
	}, [searchDate, route.from, solution.trains]);

	const renderTrainLogos = (trains: TravelSolution["trains"]) => {
		let currentWidth = 0;
		const visibleTrains = [];
		let hiddenCount = 0;
		const MAX_WIDTH = 200; // heuristic max width for logos area

		for (let i = 0; i < trains.length; i++) {
			const t = trains[i];
			const normalizedType = t.type.trim().toLowerCase();
			const w =
				normalizedType.includes("frecciarossa") || normalizedType === "frrossa"
					? 75
					: 55;

			// If adding this logo + potential '+X' badge exceeds max width, hide the rest
			if (
				trains.length > 1 &&
				currentWidth + w + (i < trains.length - 1 ? 30 : 0) > MAX_WIDTH
			) {
				hiddenCount = trains.length - i;
				break;
			}

			visibleTrains.push(t);
			currentWidth += w + 6; // + gap
		}

		const extra = hiddenCount > 0 ? `+${hiddenCount}` : "";

		return (
			<View className="flex-row items-center gap-1.5 flex-wrap">
				{visibleTrains.map((train, idx) => {
					const normalizedType = train.type.trim().toLowerCase();
					const logoKey = Object.keys(LOGOS).find(
						(k) => k.toLowerCase() === normalizedType,
					);
					const logoSource = logoKey ? LOGOS[logoKey] : undefined;

					return logoSource ? (
						<Image
							key={idx}
							source={logoSource}
							style={{
								height: 14,
								width:
									normalizedType.includes("frecciarossa") ||
									normalizedType === "frrossa"
										? 75
										: 55,
							}}
							resizeMode="contain"
						/>
					) : (
						<View
							key={idx}
							className="bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200"
						>
							<ThemedText className="text-[12px] font-plus-jakarta-bold !text-gray-700 capitalize">
								{train.type}
							</ThemedText>
						</View>
					);
				})}
				{extra !== "" && (
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
			disabled={!solution.price}
			className="rounded-2xl bg-white p-5 border border-gray-100"
		>
			{/* Top Row: Logos & Price */}
			<View className="flex-row justify-between items-start">
				<View className="flex-1">{renderTrainLogos(solution.trains)}</View>
				<View className="items-end">
					<View className="flex-row items-baseline">
						{solution.price > 0 ? (
							<>
								<ThemedText className="text-[13px] font-plus-jakarta !text-gray-900 mr-1">
									da
								</ThemedText>
								<ThemedText className="text-[17px] font-plus-jakarta-bold !text-gray-950">
									{solution.price.toFixed(2).replace(".", ",")} €
								</ThemedText>
							</>
						) : (
							<ThemedText className="text-[15px] font-plus-jakarta-medium !text-gray-500">
								Non acquistabile
							</ThemedText>
						)}
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
				<ThemedText className="text-[18px] font-plus-jakarta-bold !text-gray-950">
					{solution.departureTime} - {solution.arrivalTime}
				</ThemedText>
				<View className="flex-row items-center">
					{solution.price > 0 && (
						<>
							<ThemedText className="text-[13px] font-plus-jakarta !text-gray-500 mr-1">
								{solution.offerName}
							</ThemedText>
							<Icon name="info" size={16} className="!text-gray-400" />
						</>
					)}
				</View>
			</View>

			{/* Route Text & Delay */}
			<View className="flex-row items-center justify-between mt-1">
				<ThemedText className="text-[13px] font-plus-jakarta-medium !text-gray-600">
					{route.from} - {route.to}
				</ThemedText>

				{liveDelay && (
					<View
						className="rounded-md px-2 py-1"
						style={{ backgroundColor: "#ffe4e6" }}
					>
						<ThemedText
							className="text-xs font-plus-jakarta-bold"
							style={{ color: "#c1152c" }}
						>
							+{liveDelay} MIN
						</ThemedText>
					</View>
				)}
			</View>

			{/* Bottom Row: Duration & Status */}
			<View className="flex-row justify-between items-center mt-5">
				<View className="flex-row items-center">
					<ThemedText className="text-[14px] font-plus-jakarta-medium !text-gray-500">
						{solution.duration} •{" "}
					</ThemedText>
					<Pressable
						onPress={(e) => {
							if (onPressInfo) {
								e.stopPropagation();
								onPressInfo();
							}
						}}
					>
						<ThemedText className="text-[14px] font-plus-jakarta-bold !text-gray-800 underline">
							{solution.trains.length === 1
								? "Diretto"
								: `${solution.trains.length - 1} ${
										solution.trains.length - 1 === 1 ? "Cambio" : "Cambi"
									}`}
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
			{solution.price > 0 &&
				solution.trains.some(
					(t) =>
						t.type === "Intercity" ||
						t.type === "ICnotte" ||
						t.type === "InterCity",
				) && (
					<View className="mt-5 flex-row items-center gap-3 rounded-2xl bg-gray-50 p-4 border border-gray-100">
						<Icon name="info" size={20} className="!text-gray-800" />
						<ThemedText className="flex-1 text-[13px] font-plus-jakarta-medium !text-gray-800 !leading-tight">
							Area Family presente in carrozza 3 su Intercity{" "}
							{
								solution.trains.find(
									(t) =>
										t.type === "Intercity" ||
										t.type === "ICnotte" ||
										t.type === "InterCity",
								)?.number
							}
						</ThemedText>
					</View>
				)}
			{solution.price > 0 &&
				solution.trains
					.filter((t) => t.type.toLowerCase().includes("reg"))
					.map((regTrain, idx) => (
						<View
							key={idx}
							className="mt-5 flex-row items-center gap-3 rounded-2xl bg-gray-50 p-4 border border-gray-100"
						>
							<Icon name="train" size={20} className="!text-gray-800" />
							<ThemedText className="flex-1 text-[13px] font-plus-jakarta-medium !text-gray-800 !leading-tight">
								[
								{regTrain.type.toLowerCase().includes("regv")
									? "Regionale Veloce"
									: "Regionale"}{" "}
								{regTrain.number}] {getAvailableSeats(regTrain.number)} posti
								acquistabili
							</ThemedText>
						</View>
					))}
		</Pressable>
	);
}
