import { getTrainInfo } from "@/api/delay";
import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { formatClassName, formatOfferName } from "@/utils/format";
import { STATIONS } from "@/constants/stations";
import { Image } from "expo-image";
import { useEffect, useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import Svg, { Line, Path } from "react-native-svg";

const LOGOS: Record<string, { source: any; ratio: number }> = {
	Frecciarossa: { source: require("@/assets/logos/small/f.png"), ratio: 1.4 },
	Frecciargento: { source: require("@/assets/logos/small/f.png"), ratio: 1.4 },
	Frecciabianca: { source: require("@/assets/logos/small/f.png"), ratio: 1.4 },
	FrRossa: { source: require("@/assets/logos/small/f.png"), ratio: 1.4 },
	FrArgento: { source: require("@/assets/logos/small/f.png"), ratio: 1.4 },
	FrBianca: { source: require("@/assets/logos/small/f.png"), ratio: 1.4 },

	Intercity: { source: require("@/assets/logos/small/ic.png"), ratio: 0.89 },
	InterCity: { source: require("@/assets/logos/small/ic.png"), ratio: 0.89 },
	ICnotte: { source: require("@/assets/logos/small/ic.png"), ratio: 0.89 },
	Ni: { source: require("@/assets/logos/small/ic.png"), ratio: 0.89 },
	Ic: { source: require("@/assets/logos/small/ic.png"), ratio: 0.89 },

	Regionale: { source: require("@/assets/logos/small/r.png"), ratio: 2.03 },
	Regv: { source: require("@/assets/logos/small/r.png"), ratio: 2.03 },
	Rv: { source: require("@/assets/logos/small/r.png"), ratio: 2.03 },
	Reg: { source: require("@/assets/logos/small/r.png"), ratio: 2.03 },
	Re: { source: require("@/assets/logos/small/r.png"), ratio: 2.03 },

	"Reg Tper": {
		source: require("@/assets/logos/small/rtper.png"),
		ratio: 2.13,
	},
	"Regv Tper": {
		source: require("@/assets/logos/small/rtper.png"),
		ratio: 2.13,
	},
	Ttper: { source: require("@/assets/logos/small/rtper.png"), ratio: 2.13 },

	EuroCity: { source: require("@/assets/logos/small/ec.png"), ratio: 1.1 },
	Ec: { source: require("@/assets/logos/small/ec.png"), ratio: 1.1 },
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
		calculatedPrice?: number;
	}[];
	departureTime: string;
	arrivalTime: string;
	duration: string;
	price: number;
	originalPrice?: number;
	offerName: string;
	serviceClass?: string;
	delay?: string;
	tickets?: any[];
	status?: "not_started" | "on_time" | "delayed";
}

interface TravelSolutionCardProps {
	solution: TravelSolution;
	route: { from: string; to: string };
	searchDate?: Date;
	isCheapest?: boolean;
	isFastest?: boolean;
	onPress?: () => void;
	onPressInfo?: () => void;
	isSelectOfferMode?: boolean;
	selectOfferModeProps?: {
		dateStr: string;
		isExpanded: boolean;
		passengerName?: string;
	};
	isPurchasedTrip?: boolean;
	onLongPress?: () => void;
	bulkDelay?: string;
	isInfomobilityMode?: boolean;
}

export function TravelSolutionCard({
	solution,
	route,
	searchDate,
	isCheapest,
	isFastest,
	onPress,
	onPressInfo,
	isSelectOfferMode,
	selectOfferModeProps,
	isPurchasedTrip,
	onLongPress,
	bulkDelay,
	isInfomobilityMode,
}: TravelSolutionCardProps) {
	const [liveDelay, setLiveDelay] = useState<string | null | undefined>(
		bulkDelay !== undefined ? bulkDelay : undefined,
	);
	const [cardWidth, setCardWidth] = useState(0);
	const [cardLayout, setCardLayout] = useState({ width: 0, height: 0 });
	const [notchY, setNotchY] = useState(0);
	const [fullOrigin, setFullOrigin] = useState<string | null>(null);
	const [fullDestination, setFullDestination] = useState<string | null>(null);

	const getFormattedStationName = (name: string | null | undefined) => {
		if (!name) return "";
		const cleanName = name.trim().toLowerCase();
		const station = STATIONS.find(s => s.name.toLowerCase() === cleanName);
		if (station) return station.name;
		// Fallback: Title Case
		return name.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
	};

	const isToday = useMemo(() => {
		if (!solution.date) return true; // Default to true if no date provided
		const today = new Date();
		const ticketDate = new Date(solution.date);
		return (
			today.getFullYear() === ticketDate.getFullYear() &&
			today.getMonth() === ticketDate.getMonth() &&
			today.getDate() === ticketDate.getDate()
		);
	}, [solution.date]);

	const addMinutes = (time: string, minutes: number) => {
		if (!time) return time;
		const [hStr, mStr] = time.split(":");
		if (!hStr || !mStr) return time;
		const date = new Date();
		date.setHours(parseInt(hStr, 10));
		date.setMinutes(parseInt(mStr, 10) + minutes);
		return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
	};

	const dashLength = 6;
	const targetGap = 4;
	let computedGap = targetGap;
	const NR = 12;
	const drawWidth = cardWidth > 2 * NR ? cardWidth - 2 * NR : 0;

	if (drawWidth > 0) {
		const n = Math.round((drawWidth + targetGap) / (dashLength + targetGap));
		if (n > 1) {
			computedGap = (drawWidth - n * dashLength) / (n - 1);
		}
	}

	const getPathData = () => {
		if (!cardLayout.width || !cardLayout.height || !notchY) return "";
		const minX = 0.5;
		const minY = 0.5;
		const maxX = cardLayout.width - 0.5;
		const maxY = cardLayout.height - 0.5;
		const NY = notchY;
		const R = 16;
		const NR = 12;

		return `
			M ${minX + R} ${minY}
			L ${maxX - R} ${minY}
			A ${R} ${R} 0 0 1 ${maxX} ${minY + R}
			L ${maxX} ${NY - NR}
			A ${NR} ${NR} 0 0 0 ${maxX} ${NY + NR}
			L ${maxX} ${maxY - R}
			A ${R} ${R} 0 0 1 ${maxX - R} ${maxY}
			L ${minX + R} ${maxY}
			A ${R} ${R} 0 0 1 ${minX} ${maxY - R}
			L ${minX} ${NY + NR}
			A ${NR} ${NR} 0 0 0 ${minX} ${NY - NR}
			L ${minX} ${minY + R}
			A ${R} ${R} 0 0 1 ${minX + R} ${minY}
			Z
		`;
	};

	const showSvgBg = cardLayout.width > 0 && cardLayout.height > 0 && notchY > 0;

	useEffect(() => {
		if (bulkDelay !== undefined) {
			setLiveDelay(bulkDelay);
		}
	}, [bulkDelay]);

	useEffect(() => {
		if ((isPurchasedTrip || isInfomobilityMode) && solution.trains.length > 0) {
			if (!isToday && isPurchasedTrip) {
				return; // Don't fetch or show delay for non-today purchased tickets
			}

			const fetchDelay = async () => {
				const firstTrain = solution.trains[0];
				if (!firstTrain.number || !firstTrain.origin) return;
				const info = await getTrainInfo(firstTrain.origin, firstTrain.number);
				if (info) {
					if (info.delay !== null) setLiveDelay(info.delay);
					if (info.origin) setFullOrigin(info.origin);
					if (info.destination) setFullDestination(info.destination);
				}
			};
			fetchDelay();
		}
	}, [isPurchasedTrip, isInfomobilityMode, solution, isToday]);

	const getReadableType = (type: string) => {
		const normalizedType = type.trim().toLowerCase();
		if (
			normalizedType.includes("frecciarossa") ||
			normalizedType === "frrossa"
		) {
			return "FRECCIAROSSA";
		} else if (
			normalizedType.includes("frecciargento") ||
			normalizedType === "frargento"
		) {
			return "FRECCIARGENTO";
		} else if (
			normalizedType.includes("frecciabianca") ||
			normalizedType === "frbianca"
		) {
			return "FRECCIABIANCA";
		} else if (
			normalizedType.includes("intercity") ||
			normalizedType === "icnotte" ||
			normalizedType === "ic" ||
			normalizedType === "ni"
		) {
			return "InterCity";
		} else if (normalizedType.includes("tper")) {
			return "Trenitalia TPER";
		} else if (
			normalizedType.includes("reg") ||
			normalizedType === "rv" ||
			normalizedType === "re"
		) {
			return "Regionale";
		} else if (normalizedType.includes("eurocity") || normalizedType === "ec") {
			return "EuroCity";
		}
		return type;
	};

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
					const logoData = logoKey ? LOGOS[logoKey] : undefined;

					const isLast = idx === visibleTrains.length - 1;

					return (
						<View key={idx} className="flex-row items-center gap-1.5">
							{logoData ? (
								<Image
									source={logoData.source}
									style={{
										height: 16,
										width: 16 * logoData.ratio,
										marginTop: -4,
									}}
									contentFit="contain"
								/>
							) : (
								<View className="bg-neutral-100 px-2 py-0.5 rounded-full border border-neutral-200">
									<ThemedText className="text-[12px] font-google-sans-bold !text-neutral-700 capitalize">
										{train.type}
									</ThemedText>
								</View>
							)}
							{!isLast && (
								<ThemedText className="text-[20px] font-google-sans-regular !text-neutral-400 -mb-[15px] -mt-[18px]">
									+
								</ThemedText>
							)}
						</View>
					);
				})}
				{extra !== "" && (
					<ThemedText className="text-[12px] font-google-sans-bold !text-neutral-500">
						{extra}
					</ThemedText>
				)}
				{trains.length === 1 && (
					<View className="flex-row items-center">
						{(isSelectOfferMode || isPurchasedTrip) && !isInfomobilityMode && (
							<ThemedText className="text-[12px] font-google-sans-bold !text-neutral-900 ml-2">
								{getReadableType(trains[0].type)}
							</ThemedText>
						)}
						<ThemedText className="text-[14px] font-google-sans-regular !text-neutral-800 ml-1">
							{trains[0].number}
						</ThemedText>
					</View>
				)}
			</View>
		);
	};

	const assignedSeat = useMemo(() => {
		const name = (solution.serviceClass || "").toLowerCase();
		let min = 7,
			max = 11;
		if (name.includes("executive")) {
			min = 1;
			max = 1;
		} else if (name.includes("salottino")) {
			min = 2;
			max = 2;
		} else if (name.includes("business")) {
			min = 3;
			max = 3;
		} else if (name.includes("premium")) {
			min = 4;
			max = 6;
		} else if (name.includes("standard")) {
			min = 7;
			max = 11;
		} else {
			min = 1;
			max = 11;
		} // fallback

		// Simple pseudo-random using ID and class name
		const seedStr = (solution.id || "123") + name;
		const idNum = seedStr
			.split("")
			.reduce((acc, char) => acc + char.charCodeAt(0), 0);

		const coach = (idNum % (max - min + 1)) + min;

		let maxSeatNum = 18;
		let letters = ["A", "B", "C", "D"];

		if (name.includes("executive")) {
			maxSeatNum = 8;
			letters = ["A", "B"];
		}

		const seatNum = (idNum % maxSeatNum) + 1;
		const seatLetter = letters[idNum % letters.length];
		return { coach: coach.toString(), seat: `${seatNum}${seatLetter}` };
	}, [solution.serviceClass, solution.id]);

	return (
		<Pressable
			onPress={onPress}
			onLongPress={onLongPress}
			disabled={!solution.price && !isPurchasedTrip && !isInfomobilityMode}
			className={`relative overflow-hidden`}
			onLayout={(e) => setCardLayout(e.nativeEvent.layout)}
			style={{
				borderRadius: 16,
				borderWidth: 0,
			}}
		>
			{!showSvgBg && (
				<View className="absolute inset-0 rounded-2xl border border-neutral-200 bg-white" />
			)}
			{showSvgBg && (
				<Svg
					width="100%"
					height="100%"
					style={{ position: "absolute", top: 0, left: 0 }}
				>
					<Path
						d={getPathData()}
						fill="white"
						stroke="#e5e7eb"
						strokeWidth={1}
					/>
				</Svg>
			)}
			<View className={`${!(solution.price > 0) && !isInfomobilityMode ? "opacity-40" : ""} p-5 pb-0`}>
				{/* Top Row: Logos & Diretto/Cambi */}
				<View className="flex-row justify-between items-center -mt-1">
					<View className="flex-1">{renderTrainLogos(solution.trains)}</View>
					{/* Right: Diretto / Cambi */}
					<View className="flex-row items-center ml-2">
						<Pressable
							onPress={(e) => {
								if (onPressInfo) {
									e.stopPropagation();
									onPressInfo();
								}
							}}
						>
							<ThemedText
								className={`text-[14px] !text-neutral-800 ${(isSelectOfferMode && selectOfferModeProps?.passengerName) || isPurchasedTrip || isInfomobilityMode ? "font-google-sans-regular" : "font-google-sans-medium"}`}
							>
								{isPurchasedTrip && (solution as any).date
									? (() => {
											const d = new Date((solution as any).date);
											const isToday =
												d.getDate() === new Date().getDate() &&
												d.getMonth() === new Date().getMonth() &&
												d.getFullYear() === new Date().getFullYear();
											if (isToday) return "Oggi";

											const dd = d.getDate().toString().padStart(2, "0");
											const mm = (d.getMonth() + 1).toString().padStart(2, "0");
											return `${dd}/${mm}/${d.getFullYear()}`;
										})()
									: isSelectOfferMode && selectOfferModeProps?.passengerName
										? selectOfferModeProps.passengerName
										: isInfomobilityMode
											? `${getFormattedStationName(fullOrigin || solution.trains[0]?.origin || route.from)} - ${getFormattedStationName(fullDestination || solution.trains[solution.trains.length - 1]?.destination || route.to)}`
											: solution.trains.length === 1
												? "Diretto"
												: `${solution.trains.length - 1} ${
														solution.trains.length - 1 === 1 ? "Cambio" : "Cambi"
													}`}
							</ThemedText>
						</Pressable>
					</View>
				</View>

				{/* Dashed Separator */}
				<View
					className="mt-4 -mx-5 h-[1px] relative justify-center"
					onLayout={(e) => {
						setCardWidth(e.nativeEvent.layout.width);
						setNotchY(e.nativeEvent.layout.y);
					}}
					style={{ zIndex: 10 }}
				>
					{cardWidth > 0 && (
						<Svg height="1" width={cardWidth} className="absolute">
							<Line
								x1={NR}
								y1="0.5"
								x2={cardWidth - NR}
								y2="0.5"
								stroke="#e5e7eb"
								strokeWidth="1"
								strokeDasharray={`${dashLength}, ${computedGap}`}
							/>
						</Svg>
					)}
				</View>

				{/* Middle Row: Times, Stations & Duration */}
				{(() => {
					const getCleanNum = (val: string) =>
						parseInt(val.replace(/[^0-9]/g, ""), 10);
					const delayNum = liveDelay
						? getCleanNum(liveDelay)
						: solution.delay
							? getCleanNum(solution.delay)
							: 0;
					const isNegative = liveDelay
						? liveDelay.includes("-")
						: solution.delay
							? solution.delay.includes("-")
							: false;
					const isPurchasable =
						isPurchasedTrip || (solution.price && solution.price > 0);
					
					// If it's a purchased trip from a past/future day, don't show strike-through delays
					const shouldShowDelayStrikethrough = isPurchasedTrip ? isToday : true;

					const hasDelay =
						isPurchasable &&
						shouldShowDelayStrikethrough &&
						!isNaN(delayNum) &&
						delayNum > 0 &&
						!isNegative &&
						liveDelay !== "in orario" &&
						liveDelay !== "non partito";

					return (
						<View className="flex-row items-start justify-between mt-3 relative">
							<View className="items-start flex-1">
								<ThemedText
									className="text-[13px] font-google-sans-regular !text-neutral-700 mb-0.5"
									numberOfLines={1}
								>
									{route.from}
								</ThemedText>
								{hasDelay ? (
									<View className="items-start">
										<ThemedText className="text-[20px] font-google-sans-medium !text-neutral-700 line-through">
											{solution.departureTime}
										</ThemedText>
										<ThemedText
											className={`text-[20px] font-google-sans-bold !text-rose-500 mt-0.5 ${(isPurchasedTrip || isInfomobilityMode) ? "-mb-5" : ""}`}
										>
											{addMinutes(solution.departureTime, delayNum)}
										</ThemedText>
									</View>
								) : (
									<ThemedText className="text-[20px] font-google-sans-bold !text-neutral-950">
										{solution.departureTime}
									</ThemedText>
								)}
							</View>

							<View
								className={`absolute left-0 right-0 ${hasDelay ? "top-[18px]" : "bottom-0"} -mb-[1px] items-center justify-center pointer-events-none`}
							>
								<View className="flex-row items-center">
									<View className="w-10 items-end justify-center">
										<View className="h-[2px] w-6 bg-neutral-300" />
									</View>
									<View className="bg-neutral-100 px-2.5 py-1 rounded-full mx-1">
										<ThemedText className="text-[13px] font-google-sans-bold !text-neutral-600">
											{isSelectOfferMode && selectOfferModeProps
												? selectOfferModeProps.dateStr
												: solution.duration}
										</ThemedText>
									</View>
									<View className="w-10 flex-row items-center justify-start">
										<View className="h-[2px] w-6 bg-neutral-300" />
										<Icon
											name="chevron_right"
											size={24}
											className="!text-neutral-300 -ml-[13px]"
										/>
									</View>
								</View>
								{(() => {
									if (
										(!isPurchasedTrip && !isInfomobilityMode) &&
										(!solution.price || solution.price <= 0)
									)
										return null;

									const delayVal =
										liveDelay !== undefined && liveDelay !== null
											? liveDelay
											: solution.delay
												? solution.delay
												: null;
									
									if (isPurchasedTrip && !isToday) {
										return null;
									}

									if (!delayVal && delayVal !== "0") return null;

									const cleanedDelay = String(delayVal).replace(/[^0-9]/g, "");
									const dNum = parseInt(cleanedDelay, 10);
									const isNegative = String(delayVal).includes("-");

									if (!isNaN(dNum) && dNum > 0 && !isNegative) {
										return (
											<ThemedText className="text-[12px] font-google-sans-bold !text-rose-500 absolute -bottom-5">
												{`+${dNum} MIN`}
											</ThemedText>
										);
									} else if (
										String(delayVal) === "0" ||
										isNegative ||
										String(delayVal).toLowerCase().trim() === "in orario"
									) {
										return (
											<ThemedText className="text-[12px] font-google-sans-bold !text-primary-500 absolute -bottom-5">
												IN ORARIO
											</ThemedText>
										);
									} else if (String(delayVal).toLowerCase().trim() === "non partito") {
										const [hours, minutes] = solution.departureTime
											.split(":")
											.map(Number);
										const departureDate = searchDate
											? new Date(searchDate)
											: solution.date
												? new Date(solution.date)
												: new Date();
										departureDate.setHours(hours, minutes, 0, 0);

										const now = new Date();
										const diffMinutes =
											(departureDate.getTime() - now.getTime()) / (1000 * 60);

										if ((!isPurchasedTrip && !isInfomobilityMode) && diffMinutes > 15) {
											return null;
										}

										return (
											<ThemedText className="text-[12px] font-google-sans-bold !text-neutral-500 absolute -bottom-5">
												NON PARTITO
											</ThemedText>
										);
									}

									// Fallback di sicurezza: se la stringa non matcha nulla ma esiste, la stampiamo così com'è in rosso
									return (
										<ThemedText className="text-[12px] font-google-sans-bold !text-rose-500 absolute -bottom-5 uppercase">
											{String(delayVal).includes("MIN")
												? String(delayVal)
												: `+${cleanedDelay || delayVal} MIN`}
										</ThemedText>
									);
								})()}
							</View>

							<View className="items-end flex-1">
								<ThemedText
									className="text-[13px] font-google-sans-regular !text-neutral-700 text-right mb-0.5"
									numberOfLines={1}
								>
									{route.to}
								</ThemedText>
								{hasDelay ? (
									<View className="items-end">
										<ThemedText className="text-[20px] font-google-sans-medium !text-neutral-700 line-through">
											{solution.arrivalTime}
										</ThemedText>
										<ThemedText
											className={`text-[20px] font-google-sans-bold !text-rose-500 mt-0.5 ${(isPurchasedTrip || isInfomobilityMode) ? "-mb-5" : ""}`}
										>
											{addMinutes(solution.arrivalTime, delayNum)}
										</ThemedText>
									</View>
								) : (
									<ThemedText className="text-[20px] font-google-sans-bold !text-neutral-950">
										{solution.arrivalTime}
									</ThemedText>
								)}
							</View>
						</View>
					);
				})()}

				{(() => {
					if (!isSelectOfferMode) return null;

					const isRegionale = solution.trains.some((t) => {
						const type = t.type.toLowerCase();
						return (
							type.includes("reg") ||
							type.includes("rv") ||
							type.includes("re") ||
							type.includes("tper")
						);
					});

					let isModificabile = true;
					let isRimborsabile = true;

					if (isRegionale) {
						isModificabile = true;
						isRimborsabile = false;
					} else {
						const offerLower = solution.offerName?.toLowerCase() || "";
						const isSuperEconomyOrYoungSenior =
							offerLower.includes("young") ||
							offerLower.includes("senior") ||
							offerLower.includes("super economy");
						const isEconomy =
							offerLower.includes("economy") && !offerLower.includes("super");
						const isBase = offerLower.includes("base");

						if (isSuperEconomyOrYoungSenior) {
							isModificabile = false;
							isRimborsabile = false;
						} else if (isEconomy) {
							isModificabile = true;
							isRimborsabile = false;
						} else if (isBase) {
							isModificabile = true;
							isRimborsabile = true;
						}
					}

					return (
						<View className="flex-row items-center justify-between mt-6 mb-1 -mx-5 px-5">
							<View className="flex-row items-center gap-3">
								<View className="flex-row items-center gap-1">
									<Icon
										name={isModificabile ? "check" : "close"}
										size={14}
										className={
											isModificabile ? "!text-primary-500" : "!text-rose-600"
										}
										weight={600}
									/>
									<ThemedText className="text-[12px] font-google-sans-regular !text-neutral-700 mt-0.5">
										Modificabile
									</ThemedText>
								</View>
								<View className="flex-row items-center gap-1">
									<Icon
										name={isRimborsabile ? "check" : "close"}
										size={14}
										className={
											isRimborsabile ? "!text-primary-500" : "!text-rose-600"
										}
										weight={600}
									/>
									<ThemedText className="text-[12px] font-google-sans-regular !text-neutral-700 mt-0.5">
										Rimborsabile
									</ThemedText>
								</View>
							</View>

							{!isRegionale && (
								<View className="flex-row items-center gap-2">
									<View className="flex-row items-center gap-2">
										<View className="flex-row items-center gap-0.5">
											<Icon
												name="directions_railway"
												size={16}
												className="!text-neutral-700"
											/>
											<ThemedText className="text-[12px] font-google-sans-regular !text-neutral-700 mt-0.5">
												{assignedSeat.coach}
											</ThemedText>
										</View>
										<View className="flex-row items-center gap-0.5">
											<Icon
												name="flight_class"
												size={16}
												className="!text-neutral-700"
											/>
											<ThemedText className="text-[12px] font-google-sans-regular !text-neutral-700 mt-0.5">
												{assignedSeat.seat}
											</ThemedText>
										</View>
									</View>
									<View className="h-7 w-7 rounded-[8px] bg-[#F0F7F7] border border-[#DCEBEB] items-center justify-center ml-1">
										<Icon
											name="edit_square"
											size={14}
											className="!text-primary-500"
										/>
									</View>
								</View>
							)}
						</View>
					);
				})()}

				{isPurchasedTrip || isInfomobilityMode ? (
					<View
						className={`mb-4 ${(() => {
							const delayVal = liveDelay || solution.delay;
							if (!delayVal) return "";
							const dNum = parseInt(delayVal, 10);
							const hasDelay = !isNaN(dNum) && dNum > 0;
							return !hasDelay ? "mt-5" : "";
						})()}`}
					/>
				) : isSelectOfferMode ? (
					<View className="bg-primary-500 flex-row justify-between items-center py-2.5 -mx-5 px-5 rounded-b-[15px] mt-4">
						<View className="flex-row items-center gap-1">
							<ThemedText className="!text-white font-google-sans-bold text-[15px]">
								{formatClassName(solution.serviceClass || "")}
							</ThemedText>
							<View className="flex-row items-center">
								<ThemedText className="!text-white/80 font-google-sans-regular text-[15px]">
									{formatOfferName(solution.offerName ?? "")}
								</ThemedText>
								<Icon
									name="info"
									size={16}
									weight={300}
									className="!text-white/80 -my-4 ml-1"
								/>
							</View>
						</View>
						<View className="flex-row items-center gap-1">
							<ThemedText className="!text-white font-google-sans-bold text-[16px]">
								€ {solution.price.toFixed(2).replace(".", ",")}
							</ThemedText>
							<Icon
								name={
									selectOfferModeProps?.isExpanded
										? "expand_less"
										: "expand_more"
								}
								size={20}
								className="!text-white"
							/>
						</View>
					</View>
				) : (
					<>
						{/* Default Bottom Row: Badges & Class/Price */}
						<View className="mt-4 -mb-2">
							{/* Badges (Top Right) */}
							<View className="flex-row justify-end items-center gap-1.5 mb-1">
								{/* Badges removed from here and moved under the duration chip */}
							</View>

							{/* Class/Offer & Price (Bottom) */}
							{solution.price > 0 ? (
								<View className="flex-row justify-between items-end">
									{/* Class & Offer */}
									<View className="flex-1">
										<View className="flex-row items-end flex-wrap mb-[3px]">
											{solution.serviceClass && (
												<ThemedText className="text-[12px] font-google-sans-bold !text-neutral-950 mr-1">
													{formatClassName(solution.serviceClass)}
												</ThemedText>
											)}
											<ThemedText className="text-[12px] font-google-sans-regular !text-neutral-700">
												{solution.offerName}
											</ThemedText>
										</View>
									</View>

									{/* Price Block */}
									<View className="items-end ml-2">
										<View className="flex-row items-end">
											{solution.originalPrice && (
												<ThemedText className="text-[13px] font-google-sans-medium !text-neutral-400 line-through mr-1.5 mb-[2px]">
													{solution.originalPrice.toFixed(2).replace(".", ",")}{" "}
													€
												</ThemedText>
											)}
											<>
												<ThemedText className="text-[13px] font-google-sans-regular !text-neutral-900 mr-1 mb-[3px]">
													da
												</ThemedText>
												<ThemedText className="text-[22px] font-google-sans-bold !text-primary-500 leading-[26px]">
													{solution.price.toFixed(2).replace(".", ",")}€
												</ThemedText>
											</>
										</View>
									</View>
								</View>
							) : (
								<View className="flex-row justify-end items-center -mr-1 mb-[3px]">
									<View className="flex-row items-center px-3 py-1.5 rounded-lg border border-black">
										<Icon
											name="block"
											size={14}
											className="!text-black mr-1.5"
										/>
										<ThemedText className="text-[13px] font-google-sans-medium !text-black -mb-[1px]">
											Non acquistabile
										</ThemedText>
									</View>
								</View>
							)}
						</View>

						<View className="mb-5" />

						{/* Highlight Banner */}
						{(isCheapest || isFastest) && (
							<View
								className={`${isFastest ? "bg-primary-500/10" : "bg-primary-500"} flex-row justify-center items-center py-2.5 -mx-5 px-5 rounded-b-[15px]`}
							>
								<ThemedText
									className={`${isFastest ? "!text-primary-500" : "!text-white"} font-google-sans-bold text-[15px]`}
								>
									{isCheapest && isFastest
										? "Più economico e più veloce"
										: isCheapest
											? "Più economico"
											: "Più veloce"}
								</ThemedText>
							</View>
						)}
					</>
				)}
			</View>
		</Pressable>
	);
}
