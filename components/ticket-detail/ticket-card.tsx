import { getTrainInfo } from "@/api/delay";
import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { USER_DATA } from "@/constants/user";
import { generateAztec, getCachedAztec } from "@/utils/aztec";
import { formatClassName, formatPersonName } from "@/utils/format";
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
import Svg, {
	Circle,
	ClipPath,
	Defs,
	G,
	Line,
	Path,
	Rect,
} from "react-native-svg";

const CoachCenter = ({ color }: { color: string }) => (
	<Svg width="84" height="31" viewBox="0 0 84 31" fill="none">
		<Rect
			width="84"
			height="31"
			rx="6"
			transform="matrix(-1 0 0 1 84 0)"
			fill={color}
		/>
		<Rect
			width="24"
			height="20"
			rx="4"
			transform="matrix(-1 0 0 1 81 3)"
			fill="#F5F5F5"
		/>
		<Rect
			width="24"
			height="20"
			rx="4"
			transform="matrix(-1 0 0 1 54 3)"
			fill="#F5F5F5"
		/>
		<Rect
			width="24"
			height="20"
			rx="4"
			transform="matrix(-1 0 0 1 27 3)"
			fill="#F5F5F5"
		/>
	</Svg>
);

const CoachHead = ({ color }: { color: string }) => (
	<Svg width="84" height="31" viewBox="0 0 84 31" fill="none">
		<Path
			d="M84 18C84 8.05888 75.9411 0 66 0H6C2.68629 0 0 2.68629 0 6V25C0 28.3137 2.68629 31 6 31H78C81.3137 31 84 28.3137 84 25V18Z"
			fill={color}
		/>
		<G clipPath="url(#clip0_698_6719)">
			<Path
				d="M81 19.5217C81 10.397 73.603 3 64.4783 3H61C58.7909 3 57 4.79086 57 7V19C57 21.2091 58.7909 23 61 23H77.5217C79.4427 23 81 21.4427 81 19.5217Z"
				fill="#F5F5F5"
			/>
			<Circle
				cx="3"
				cy="3"
				r="3"
				transform="matrix(-1 0 0 1 67 11)"
				fill={color}
			/>
			<Rect
				width="6"
				height="10"
				rx="3"
				transform="matrix(-1 0 0 1 67 18)"
				fill={color}
			/>
		</G>
		<Rect
			width="24"
			height="20"
			rx="4"
			transform="matrix(-1 0 0 1 54 3)"
			fill="#F5F5F5"
		/>
		<Rect
			width="24"
			height="20"
			rx="4"
			transform="matrix(-1 0 0 1 27 3)"
			fill="#F5F5F5"
		/>
		<Defs>
			<ClipPath id="clip0_698_6719">
				<Path
					d="M81 19.5217C81 10.397 73.603 3 64.4783 3H61C58.7909 3 57 4.79086 57 7V19C57 21.2091 58.7909 23 61 23H77.5217C79.4427 23 81 21.4427 81 19.5217Z"
					fill="white"
				/>
			</ClipPath>
		</Defs>
	</Svg>
);

const CoachRear = ({ color }: { color: string }) => (
	<Svg width="84" height="31" viewBox="0 0 84 31" fill="none">
		<Path
			d="M0 18C0 8.05888 8.05888 0 18 0H78C81.3137 0 84 2.68629 84 6V25C84 28.3137 81.3137 31 78 31H6C2.68629 31 0 28.3137 0 25V18Z"
			fill={color}
		/>
		<Path
			d="M3 19.5217C3 10.397 10.397 3 19.5217 3H23C25.2091 3 27 4.79086 27 7V19C27 21.2091 25.2091 23 23 23H6.47826C4.55727 23 3 21.4427 3 19.5217Z"
			fill="#F5F5F5"
		/>
		<Rect x="30" y="3" width="24" height="20" rx="4" fill="#F5F5F5" />
		<Rect x="57" y="3" width="24" height="20" rx="4" fill="#F5F5F5" />
	</Svg>
);

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
	isPastTrip?: boolean;
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
	isPastTrip,
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

	const coachNum = parseInt(carrozza || "1", 10) || 1;
	let boardPos = "centro";
	if (coachNum <= 3) boardPos = "testa";
	else if (coachNum >= 9) boardPos = "coda";

	const headColor = boardPos === "testa" ? "#006666" : "#A3A3A3";
	const centerColor = boardPos === "centro" ? "#006666" : "#A3A3A3";
	const rearColor = boardPos === "coda" ? "#006666" : "#A3A3A3";

	const [isExpanded, setIsExpanded] = useState(false);
	const [binPartenza, setBinPartenza] = useState<string | null>(null);
	const [binArrivo, setBinArrivo] = useState<string | null>(null);
	const [ticketDelay, setTicketDelay] = useState<string | null>(null);

	const addMinutes = (time: string, minutes: number) => {
		if (!time) return time;
		const [hStr, mStr] = time.split(":");
		if (!hStr || !mStr) return time;
		const date = new Date();
		date.setHours(parseInt(hStr, 10));
		date.setMinutes(parseInt(mStr, 10) + minutes);
		return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
	};

	useEffect(() => {
		if (dateString === "Oggi" && trainNumber) {
			const num = trainNumber.replace(/\D/g, "");
			if (!num) return;

			const fetchInfo = async () => {
				const num = trainNumber.replace(/\D/g, "");
				if (!num) return;

				const depInfo = await getTrainInfo(origin, num);
				if (depInfo) {
					if (depInfo.binario) setBinPartenza(depInfo.binario);

					const delayStr = depInfo.delay;
					if (delayStr !== null) {
						const match = delayStr.match(/\d+/);
						if (match) {
							setTicketDelay(match[0]);
						} else if (
							delayStr.trim().toLowerCase() === "in orario" ||
							delayStr.trim().toLowerCase() === "non partito"
						) {
							setTicketDelay(
								delayStr.trim().toLowerCase() === "in orario"
									? "0"
									: "non partito",
							);
						}
					}
				}

				const arrInfo = await getTrainInfo(destination, num);
				if (arrInfo && arrInfo.binario) {
					setBinArrivo(arrInfo.binario);
				}
			};

			fetchInfo();
		}
	}, [dateString, trainNumber, origin, destination]);

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
					<ThemedText className="ml-2 text-base font-google-sans-bold !text-neutral-900">
						{logoData.readable}
					</ThemedText>
					<ThemedText className="ml-1 text-base font-google-sans-regular !text-neutral-900">
						{trainNumber}
					</ThemedText>
				</View>
				<ThemedText className="text-base font-google-sans-regular !text-neutral-900">
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
					<View className="flex-row justify-between items-center mb-0.5 gap-4">
						<ThemedText
							className="flex-1 text-base font-google-sans-regular !text-neutral-900"
							numberOfLines={1}
						>
							{origin}
						</ThemedText>
						<ThemedText
							className="flex-1 text-right text-base font-google-sans-regular !text-neutral-900"
							numberOfLines={1}
						>
							{destination}
						</ThemedText>
					</View>

					{/* Times and Arrow Row */}
					<View className="flex-row items-start justify-between">
						{(() => {
							const getCleanNum = (val: string) =>
								parseInt(val.replace(/[^0-9]/g, ""), 10);
							const delayNum = ticketDelay ? getCleanNum(ticketDelay) : 0;
							const isNegative = ticketDelay
								? ticketDelay.includes("-")
								: false;
							const hasDelay = !isNaN(delayNum) && delayNum > 0 && !isNegative;

							return hasDelay ? (
								<View className="items-start flex-1">
									<ThemedText className="text-[26px] font-google-sans-medium !text-neutral-700 line-through">
										{departureTime}
									</ThemedText>
									<ThemedText className="text-[26px] font-google-sans-bold !text-rose-500 mt-0.5">
										{addMinutes(departureTime, delayNum)}
									</ThemedText>
								</View>
							) : (
								<ThemedText className="flex-1 text-[26px] font-google-sans-bold !text-neutral-900">
									{departureTime}
								</ThemedText>
							);
						})()}

						<View className="px-2 items-center justify-center relative mt-1">
							<View className="flex-row items-center">
								<View className="w-10 items-end justify-center">
									<View className="h-[2px] w-6 bg-neutral-300" />
								</View>
								<View className="bg-neutral-100 px-2.5 py-1 rounded-full mx-1">
									<ThemedText className="text-[13px] font-google-sans-bold !text-neutral-600">
										{duration}
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
							{dateString === "Oggi" &&
								(() => {
									if (!ticketDelay) return null;

									const cleanedDelay = ticketDelay.replace(/[^0-9]/g, "");
									const dNum = parseInt(cleanedDelay, 10);
									const isNegative = ticketDelay.includes("-");

									if (!isNaN(dNum) && dNum > 0 && !isNegative) {
										return (
											<ThemedText className="text-[12px] font-google-sans-bold !text-rose-500 absolute -bottom-5">
												{`+${dNum} MIN`}
											</ThemedText>
										);
									} else if (
										ticketDelay === "0" ||
										isNegative ||
										ticketDelay.toLowerCase().trim() === "in orario"
									) {
										return (
											<ThemedText className="text-[12px] font-google-sans-bold !text-primary-500 absolute -bottom-5">
												IN ORARIO
											</ThemedText>
										);
									} else if (
										ticketDelay.toLowerCase().trim() === "non partito"
									) {
										return (
											<ThemedText className="text-[12px] font-google-sans-bold !text-neutral-500 absolute -bottom-5">
												NON PARTITO
											</ThemedText>
										);
									}

									return (
										<ThemedText className="text-[12px] font-google-sans-bold !text-rose-500 absolute -bottom-5 uppercase">
											{ticketDelay.includes("MIN")
												? ticketDelay
												: `+${cleanedDelay || ticketDelay} MIN`}
										</ThemedText>
									);
								})()}
						</View>

						{(() => {
							const getCleanNum = (val: string) =>
								parseInt(val.replace(/[^0-9]/g, ""), 10);
							const delayNum = ticketDelay ? getCleanNum(ticketDelay) : 0;
							const isNegative = ticketDelay
								? ticketDelay.includes("-")
								: false;
							const hasDelay = !isNaN(delayNum) && delayNum > 0 && !isNegative;

							return hasDelay ? (
								<View className="items-end flex-1">
									<ThemedText className="text-[26px] font-google-sans-medium !text-neutral-700 line-through">
										{arrivalTime}
									</ThemedText>
									<ThemedText className="text-[26px] font-google-sans-bold !text-rose-500 mt-0.5">
										{addMinutes(arrivalTime, delayNum)}
									</ThemedText>
								</View>
							) : (
								<ThemedText className="flex-1 text-right text-[26px] font-google-sans-bold !text-neutral-900">
									{arrivalTime}
								</ThemedText>
							);
						})()}
					</View>

					{dateString === "Oggi" && (
						<View className="mt-8 -mb-2 flex-row justify-between items-center">
							<ThemedText className="text-[16px] font-google-sans-bold !text-primary-500">
								BIN {binPartenza || "--"}
							</ThemedText>
							<ThemedText className="text-[16px] font-google-sans-bold !text-neutral-300">
								BIN {binArrivo || "--"}
							</ThemedText>
						</View>
					)}
				</View>

				{/* Full-width Carrozza/Posto/Classe band */}
				{(carrozza || posto || passengerClass) && (
					<View className="bg-neutral-100 flex-col -mx-5 px-5 py-3 mb-6">
						{!isRegionale && dateString === "Oggi" && (
							<View className="flex-row justify-center gap-1 mb-10 mt-2 relative">
								<View className="items-center relative w-[84px]">
									<CoachRear color={rearColor} />
									{boardPos === "coda" && (
										<ThemedText className="text-[12px] font-google-sans-bold absolute -bottom-5 !text-primary-500">
											Sali in coda
										</ThemedText>
									)}
								</View>
								<View className="items-center relative w-[84px]">
									<CoachCenter color={centerColor} />
									{boardPos === "centro" && (
										<ThemedText className="text-[12px] font-google-sans-bold absolute -bottom-5 !text-primary-500 whitespace-nowrap">
											Sali al centro
										</ThemedText>
									)}
								</View>
								<View className="items-center relative w-[84px]">
									<CoachHead color={headColor} />
									{boardPos === "testa" && (
										<ThemedText className="text-[12px] font-google-sans-bold absolute -bottom-5 !text-primary-500 whitespace-nowrap">
											Sali in testa
										</ThemedText>
									)}
								</View>
							</View>
						)}
						<View className="flex-row items-center justify-between">
							{carrozza && posto ? (
								<>
									<View className="flex-1 max-w-[25%]">
										<ThemedText className="text-[14px] font-google-sans-regular !text-neutral-600 mb-0.5">
											Carrozza
										</ThemedText>
										<ThemedText className="text-[16px] font-google-sans-bold !text-neutral-900">
											{carrozza}
										</ThemedText>
									</View>
									<View className="flex-1 max-w-[25%]">
										<ThemedText className="text-[14px] font-google-sans-regular !text-neutral-600 mb-0.5">
											Posto
										</ThemedText>
										<ThemedText className="text-[16px] font-google-sans-bold !text-neutral-900">
											{posto.toUpperCase()}
										</ThemedText>
									</View>
									<View className="flex-1 items-end">
										<ThemedText className="text-[14px] font-google-sans-regular !text-neutral-600 mb-0.5 text-right">
											Classe
										</ThemedText>
										<ThemedText
											className="text-[16px] font-google-sans-bold !text-neutral-900 text-right"
											numberOfLines={1}
										>
											{formatClassName(passengerClass || "")}
										</ThemedText>
									</View>
								</>
							) : (
								<View className="flex-1 items-end">
									<ThemedText className="text-[14px] font-google-sans-regular !text-neutral-600 mb-0.5 text-right">
										Classe
									</ThemedText>
									<ThemedText
										className="text-[16px] font-google-sans-bold !text-neutral-900 text-right"
										numberOfLines={1}
										adjustsFontSizeToFit
									>
										{formatClassName(passengerClass || "")}
									</ThemedText>
								</View>
							)}
						</View>
					</View>
				)}

				<Pressable
					className={`items-center justify-center pt-2 ${dateString === "Oggi" ? "pb-3 gap-2" : "hidden"} flex-col`}
					onPress={() =>
						router.push({ pathname: "/qr-code" as any, params: { pnr } })
					}
				>
					<View className="flex-row gap-1 items-center justify-center">
						<Icon
							name="person"
							size={20}
							className="!text-neutral-500 -mt-[1px]"
							weight={400}
						/>
						<ThemedText className="text-[18px] font-google-sans-regular !text-neutral-500">
							{formatPersonName(
								passengerName || USER_DATA.firstName + " " + USER_DATA.lastName,
							)}
						</ThemedText>
					</View>
					{dateString === "Oggi" &&
						(Platform.OS === "web" ||
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
						))}
				</Pressable>
			</View>

			{/* Expanded Details Section */}
			<Animated.View
				style={{ overflow: "hidden" }}
				layout={LinearTransition.duration(200)}
			>
				{isExpanded && (
					<Animated.View
						className="px-5 pt-2 pb-2 w-full"
						entering={FadeIn.duration(200)}
						exiting={FadeOut.duration(200)}
					>
						<View className="flex-row justify-between mb-5 gap-4">
							<View className="flex-1 rounded-2xl bg-neutral-100 p-2">
								<View className="flex-row items-center justify-between mb-0.5">
									<ThemedText className="text-sm font-google-sans-medium !text-neutral-500">
										PNR
									</ThemedText>
									<Icon name="content_copy" size={14} color="#6b7280" />
								</View>
								<ThemedText className="text-base font-google-sans-bold !text-neutral-900">
									{pnr}
								</ThemedText>
							</View>
							{!isRegionale && (
								<View className="flex-1 rounded-2xl bg-neutral-100 p-2">
									<View className="flex-row items-center justify-between mb-0.5">
										<ThemedText className="text-sm font-google-sans-medium !text-neutral-500">
											CP
										</ThemedText>
										{cp && (
											<Icon name="content_copy" size={14} color="#6b7280" />
										)}
									</View>
									<ThemedText className="text-base font-google-sans-bold !text-neutral-900">
										{cp || "-"}
									</ThemedText>
								</View>
							)}
						</View>

						<View className="flex-row justify-between mb-5 gap-4">
							<View className="flex-1 px-2">
								<ThemedText className="text-sm font-google-sans-medium !text-neutral-500 mb-0.5">
									Prezzo
								</ThemedText>
								<ThemedText className="text-base font-google-sans-bold !text-neutral-900">
									{price.toFixed(2).replace(".", ",")}€
								</ThemedText>
							</View>
							<View className="flex-1 px-2">
								<ThemedText className="text-sm font-google-sans-medium !text-neutral-500 mb-0.5">
									Offerta
								</ThemedText>
								<ThemedText className="text-base font-google-sans-bold !text-neutral-900">
									{offer}
								</ThemedText>
							</View>
						</View>

						{isFreccia && (
							<View className="flex-row justify-between mb-2 gap-4">
								<View className="flex-1 px-2">
									<ThemedText className="text-sm font-google-sans-medium !text-neutral-500 mb-0.5">
										Punti CartaFreccia
									</ThemedText>
									<ThemedText className="text-base font-google-sans-bold !text-neutral-900">
										{price.toFixed(2).replace(".", ",")}
									</ThemedText>
								</View>
								<View className="flex-1 px-2">
									<ThemedText className="text-sm font-google-sans-medium !text-neutral-500 mb-0.5">
										Numero CartaFreccia
									</ThemedText>
									<ThemedText className="text-base font-google-sans-bold !text-neutral-900">
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
					className={`items-center justify-center pb-4 active:bg-neutral-50 ${dateString === "Oggi" || isExpanded ? "pt-2" : "-mt-4"}`}
					onPress={() => setIsExpanded(!isExpanded)}
				>
					<ThemedText
						className="text-center text-[15px] font-google-sans-bold"
						style={{ color: "#006666" }}
					>
						{isExpanded ? "Mostra meno" : "Mostra dettagli"}
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
