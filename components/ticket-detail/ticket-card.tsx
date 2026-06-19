import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { USER_DATA } from "@/constants/user";
import { generateAztec, getCachedAztec } from "@/utils/aztec";
import Constants, { ExecutionEnvironment } from "expo-constants";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Platform, Pressable, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import Animated, {
	FadeIn,
	FadeOut,
	LinearTransition,
} from "react-native-reanimated";
import Svg, { Line, Path } from "react-native-svg";

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
	passengerName?: string;
	offer?: string;
	price?: number;
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
	trainNumber,
	cp,
	carrozza,
	posto,
	passengerClass = "Standard",
	passengerName,
	offer = "Super Economy",
	price = 19.7,
	onOpenDettagli,
}: TicketCardProps) {
	const calculateDuration = (start: string, end: string) => {
		const [sh, sm] = start.split(":").map(Number);
		const [eh, em] = end.split(":").map(Number);
		if (isNaN(sh) || isNaN(sm) || isNaN(eh) || isNaN(em)) return "";
		let diff = eh * 60 + em - (sh * 60 + sm);
		if (diff < 0) diff += 24 * 60;
		const h = Math.floor(diff / 60);
		const m = diff % 60;
		return `${h > 0 ? `${h}h ` : ""}${m > 0 ? `${m}min` : ""}`.trim();
	};

	const duration = calculateDuration(departureTime, arrivalTime);

	const typeLowerStr = (trainType || "").toLowerCase();
	const isRegionale =
		typeLowerStr.includes("reg") ||
		typeLowerStr.includes("tper") ||
		typeLowerStr === "rv" ||
		typeLowerStr === "re";
	const isFreccia =
		typeLowerStr.includes("freccia") ||
		typeLowerStr.includes("fr") ||
		typeLowerStr === "f";

	const [isExpanded, setIsExpanded] = useState(false);

	const qrValue =
		USER_DATA.firstName +
		"|" +
		USER_DATA.lastName +
		"|" +
		USER_DATA.loyaltyCode +
		"|" +
		pnr;

	const getTrainLogoData = () => {
		const typeLower = trainType.toLowerCase();
		if (typeLower.includes("tper")) {
			return {
				source: require("../../assets/logos/small/rtper.png"),
				ratio: 2.13,
				readable: "Trenitalia TPER",
			};
		}
		if (typeLower.includes("reg") || typeLower === "rv" || typeLower === "re") {
			return {
				source: require("../../assets/logos/small/r.png"),
				ratio: 2.03,
				readable: "Regionale",
			};
		}
		if (
			typeLower.includes("ic") ||
			typeLower.includes("intercity") ||
			typeLower === "ni"
		) {
			return {
				source: require("../../assets/logos/small/ic.png"),
				ratio: 0.89,
				readable: "InterCity",
			};
		}
		if (typeLower === "ec" || typeLower.includes("eurocity")) {
			return {
				source: require("../../assets/logos/small/ec.png"),
				ratio: 1.1,
				readable: "EuroCity",
			};
		}
		// Default to Frecciarossa
		return {
			source: require("../../assets/logos/small/f.png"),
			ratio: 1.4,
			readable: "FRECCIAROSSA",
		};
	};

	const [aztecImageUri, setAztecImageUri] = useState<string | null>(
		getCachedAztec(qrValue, 16),
	);

	useEffect(() => {
		// Use scale 16 here as well so it's pre-cached for the full-screen modal!
		generateAztec(qrValue, 16)
			.then((uri) => setAztecImageUri(uri))
			.catch((err) => console.error("Aztec code generation error:", err));
	}, [qrValue]);

	const logoData = getTrainLogoData();

	const [cardWidth, setCardWidth] = useState(0);
	const [cardLayout, setCardLayout] = useState({ width: 0, height: 0 });
	const [notchY, setNotchY] = useState(0);

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

	return (
		<Animated.View
			className="mt-1.5 relative"
			onLayout={(e) => {
				setCardLayout(e.nativeEvent.layout);
				setCardWidth(e.nativeEvent.layout.width);
			}}
			layout={LinearTransition.duration(200)}
			style={{
				borderRadius: 16,
				borderWidth: 0,
				overflow: "hidden",
			}}
		>
			{!showSvgBg && (
				<View className="absolute inset-0 rounded-2xl border border-gray-200 bg-white" />
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
			{/* Top row: Train and Date */}
			<View className="flex-row items-center justify-between px-5 py-3">
				<View className="flex-row items-center">
					<View>
						<Image
							source={logoData.source}
							style={{ width: 16 * logoData.ratio, height: 16, marginTop: -4 }}
							contentFit="contain"
						/>
					</View>
					<ThemedText className="ml-2 text-base font-google-sans-bold !text-gray-900">
						{logoData.readable}
					</ThemedText>
					<ThemedText className="ml-1 text-base font-google-sans-regular !text-gray-900">
						{trainNumber}
					</ThemedText>
				</View>
				<ThemedText className="text-base font-google-sans-bold !text-gray-900">
					{dateString}
				</ThemedText>
			</View>

			{/* Dashed Separator */}
			<View
				className="relative h-[1px] justify-center"
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

			{/* Middle section: Route and Times */}
			<View className="px-5 pb-5 pt-5">
				<View className="mb-5">
					{/* Station Names Row */}
					<View className="flex-row justify-between items-center mb-0.5">
						<ThemedText className="flex-1 text-base font-google-sans-regular !text-gray-900">
							{origin}
						</ThemedText>
						<ThemedText className="flex-1 text-right text-base font-google-sans-regular !text-gray-900">
							{destination}
						</ThemedText>
					</View>

					{/* Times and Arrow Row */}
					<View className="flex-row items-center justify-between">
						<ThemedText className="flex-1 text-[26px] font-google-sans-bold !text-gray-900">
							{departureTime}
						</ThemedText>

						<View className="px-2 items-center justify-center">
							<View className="flex-row items-center">
								<View className="w-10 items-end justify-center">
									<View className="h-[2px] w-6 bg-gray-300" />
								</View>
								<View className="bg-[#E5F2EE] px-2.5 py-1 rounded-full mx-1">
									<ThemedText
										className="text-[13px] font-google-sans-bold"
										style={{ color: "#006666" }}
									>
										{duration}
									</ThemedText>
								</View>
								<View className="w-10 flex-row items-center justify-start">
									<View className="h-[2px] w-6 bg-gray-300" />
									<Icon
										name="chevron_right"
										size={24}
										className="!text-gray-300 -ml-[13px]"
									/>
								</View>
							</View>
						</View>

						<ThemedText className="flex-1 text-right text-[26px] font-google-sans-bold !text-gray-900">
							{arrivalTime}
						</ThemedText>
					</View>
				</View>

				{/* Full-width Carrozza/Posto/Classe band for trains with assigned seats */}
				{carrozza && posto && (
					<View className="bg-gray-100 flex-row items-center justify-between -mx-5 px-5 py-3 mb-6">
						<View className="flex-1">
							<ThemedText className="text-[14px] font-google-sans-regular !text-gray-600 mb-0.5">
								Carrozza
							</ThemedText>
							<ThemedText className="text-[16px] font-google-sans-bold !text-gray-900">
								{carrozza}
							</ThemedText>
						</View>
						<View className="flex-1">
							<ThemedText className="text-[14px] font-google-sans-regular !text-gray-600 mb-0.5">
								Posto
							</ThemedText>
							<ThemedText className="text-[16px] font-google-sans-bold !text-gray-900">
								{posto.toUpperCase()}
							</ThemedText>
						</View>
						<View className="flex-1 items-end">
							<ThemedText className="text-[14px] font-google-sans-regular !text-gray-600 mb-0.5 text-right">
								Classe
							</ThemedText>
							<ThemedText
								className="text-[16px] font-google-sans-bold !text-gray-900 text-right"
								numberOfLines={1}
								adjustsFontSizeToFit
							>
								{passengerClass
									? passengerClass.replace(" PRENOTAZIONE", "")
									: ""}
							</ThemedText>
						</View>
					</View>
				)}

				<Pressable
					className="items-center justify-center pt-2 pb-3 flex-col gap-2"
					onPress={() =>
						router.push({ pathname: "/qr-code" as any, params: { pnr } })
					}
				>
					<View className="flex-row gap-1 items-center justify-center">
						<Icon
							name="person"
							size={20}
							className="!text-gray-500 -mt-[1px]"
							weight={400}
						/>
						<ThemedText className="text-[18px] font-google-sans-regular !text-gray-500">
							{(passengerName || USER_DATA.firstName + " " + USER_DATA.lastName)
								.toLowerCase()
								.replace(/\b\w/g, (c) => c.toUpperCase())}
						</ThemedText>
					</View>
					{Platform.OS === "web" ||
					Constants.executionEnvironment ===
						ExecutionEnvironment.StoreClient ? (
						<QRCode
							value={qrValue}
							size={160}
							color="black"
							backgroundColor="white"
						/>
					) : aztecImageUri ? (
						<Image
							source={{ uri: aztecImageUri }}
							style={{ width: 160, height: 160 }}
							contentFit="contain"
						/>
					) : (
						<ActivityIndicator size="small" color="#004141" />
					)}
				</Pressable>
			</View>

			{/* Ticket Type (only if not displayed in the band above) */}
			{!(carrozza && posto) && passengerClass && (
				<View className="flex-row items-center border-t border-gray-100 px-5 py-3">
					<Icon name="confirmation_number" size={24} color="#000" />
					<ThemedText className="ml-2 text-base font-google-sans-medium !text-gray-900">
						{passengerClass.toUpperCase().replace(" PRENOTAZIONE", "")}
					</ThemedText>
				</View>
			)}

			{/* Expanded Details Section */}
			<Animated.View
				style={{ overflow: "hidden" }}
				layout={LinearTransition.duration(200)}
			>
				{isExpanded && (
					<Animated.View
						className="px-5 pb-4 w-full"
						entering={FadeIn.duration(200)}
						exiting={FadeOut.duration(200)}
					>
						<View className="flex-row justify-between mb-5 gap-4">
							<View className="flex-1 rounded-2xl bg-gray-100 p-2">
								<View className="flex-row items-center justify-between mb-0.5">
									<ThemedText className="text-sm font-google-sans-medium !text-gray-500">
										PNR
									</ThemedText>
									<Icon name="content_copy" size={14} color="#6b7280" />
								</View>
								<ThemedText className="text-base font-google-sans-bold !text-gray-900">
									{pnr}
								</ThemedText>
							</View>
							{!isRegionale && (
								<View className="flex-1 rounded-2xl bg-gray-100 p-2">
									<View className="flex-row items-center justify-between mb-0.5">
										<ThemedText className="text-sm font-google-sans-medium !text-gray-500">
											CP
										</ThemedText>
										{cp && (
											<Icon name="content_copy" size={14} color="#6b7280" />
										)}
									</View>
									<ThemedText className="text-base font-google-sans-bold !text-gray-900">
										{cp || "-"}
									</ThemedText>
								</View>
							)}
						</View>

						<View className="flex-row justify-between mb-5 gap-4">
							<View className="flex-1 px-2">
								<ThemedText className="text-sm font-google-sans-medium !text-gray-500 mb-0.5">
									Prezzo
								</ThemedText>
								<ThemedText className="text-base font-google-sans-bold !text-gray-900">
									{price.toFixed(2).replace(".", ",")}€
								</ThemedText>
							</View>
							<View className="flex-1 px-2">
								<ThemedText className="text-sm font-google-sans-medium !text-gray-500 mb-0.5">
									Offerta
								</ThemedText>
								<ThemedText className="text-base font-google-sans-bold !text-gray-900">
									{offer}
								</ThemedText>
							</View>
						</View>

						{isFreccia && (
							<View className="flex-row justify-between mb-2 gap-4">
								<View className="flex-1 px-2">
									<ThemedText className="text-sm font-google-sans-medium !text-gray-500 mb-0.5">
										Punti CartaFreccia
									</ThemedText>
									<ThemedText className="text-base font-google-sans-bold !text-gray-900">
										{price.toFixed(2).replace(".", ",")}
									</ThemedText>
								</View>
								<View className="flex-1 px-2">
									<ThemedText className="text-sm font-google-sans-medium !text-gray-500 mb-0.5">
										Numero CartaFreccia
									</ThemedText>
									<ThemedText className="text-base font-google-sans-bold !text-gray-900">
										{USER_DATA.loyaltyCode}
									</ThemedText>
								</View>
							</View>
						)}
					</Animated.View>
				)}
			</Animated.View>

			{/* Maggiori Dettagli Toggle */}
			<Animated.View layout={LinearTransition.duration(200)}>
				<Pressable
					className="items-center justify-center py-4 active:bg-gray-50 border-t border-gray-100"
					onPress={() => setIsExpanded(!isExpanded)}
				>
					<ThemedText
						className="text-center text-[15px] font-google-sans-bold"
						style={{ color: "#006666" }}
					>
						{isExpanded ? "Mostra meno" : "Maggiori Dettagli"}
					</ThemedText>
					{isExpanded && (
						<Icon
							name="keyboard_arrow_up"
							size={24}
							style={{ color: "#006666", marginTop: -2 }}
						/>
					)}
					{!isExpanded && (
						<Icon
							name="keyboard_arrow_down"
							size={24}
							style={{ color: "#006666", marginTop: -2 }}
						/>
					)}
				</Pressable>
			</Animated.View>
		</Animated.View>
	);
}
