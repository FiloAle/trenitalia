import { FollowTrainModal } from "@/components/modals/follow-train-modal";
import { TopDownModal } from "@/components/modals/top-down-modal";
import { ThemedText } from "@/components/themed-text";
import { TimelineEventRow } from "@/components/train-details/timeline-event-row";
import { Icon } from "@/components/ui/icon";
import { STATIONS } from "@/constants/stations";
import { TimelineEvent, TimelineStation } from "@/constants/train-details-mock";
import { addRecentTrain } from "@/utils/recent-trains-store";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Image,
	Pressable,
	ScrollView,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ViaggiaTrenoFermata {
	stazione: string;
	id: string;
	programmata: number | null;
	effettiva: number | null;
	partenza_teorica: number | null;
	arrivo_teorico: number | null;
	partenzaReale: number | null;
	arrivoReale: number | null;
	ritardo: number;
	ritardoPartenza: number;
	ritardoArrivo: number;
	binarioProgrammatoArrivoDescrizione: string | null;
	binarioEffettivoArrivoDescrizione: string | null;
	binarioProgrammatoPartenzaDescrizione: string | null;
	binarioEffettivoPartenzaDescrizione: string | null;
	tipoFermata: string;
}

interface ViaggiaTrenoResponse {
	fermate: ViaggiaTrenoFermata[];
	compRitardo: string[];
	compNumeroTreno: string;
	categoriaDescrizione: string;
	dataPartenzaTrenoAsDate: string;
	stazioneUltimoRilevamento: string;
	compOraUltimoRilevamento: string;
	origine: string;
	destinazione: string;
}

function formatTime(timestamp: number | null) {
	if (!timestamp) return "--:--";
	const date = new Date(timestamp);
	return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
}

function formatStationName(rawName: string) {
	const found = STATIONS.find(
		(s) => s.name.toLowerCase() === rawName.toLowerCase(),
	);
	if (found) return found.name;
	return rawName
		.toLowerCase()
		.split(" ")
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(" ");
}

import Constants from "expo-constants";

export default function TrainDetailsScreen() {
	const insets = useSafeAreaInsets();
	const params = useLocalSearchParams();
	const trainNumber = params.trainNumber as string;

	const [isFollowModalVisible, setIsFollowModalVisible] = useState(false);
	const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

	const [loading, setLoading] = useState(true);
	const [trainData, setTrainData] = useState<ViaggiaTrenoResponse | null>(null);
	const [timeline, setTimeline] = useState<TimelineStation[]>([]);

	useEffect(() => {
		if (!trainNumber) {
			Alert.alert("Errore", "Nessun numero di treno specificato", [
				{ text: "OK", onPress: () => router.back() },
			]);
			return;
		}

		async function fetchTrainDetails() {
			try {
				setLoading(true);

				// Costruiamo l'URL del proxy locale per bypassare ATS su iOS (Expo Go)
				const hostUri = Constants.expoConfig?.hostUri;
				const proxyBase = hostUri
					? `http://${hostUri}/api/proxy?url=`
					: "/api/proxy?url=";

				// 1. Autocomplete for code and date
				const autoUrl = `http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno/cercaNumeroTrenoTrenoAutocomplete/${trainNumber}`;
				const autoResponse = await fetch(
					`${proxyBase}${encodeURIComponent(autoUrl)}`,
				);
				const autoText = await autoResponse.text();

				if (!autoText || autoText.trim() === "") {
					Alert.alert(
						"Treno non trovato",
						"Il treno inserito non è stato trovato o non circola oggi.",
						[{ text: "OK", onPress: () => router.back() }],
					);
					return;
				}

				const firstLine = autoText.split("\n")[0];
				if (!firstLine || !firstLine.includes("|")) {
					Alert.alert(
						"Treno non trovato",
						"Il treno inserito non è stato trovato o non circola oggi.",
						[{ text: "OK", onPress: () => router.back() }],
					);
					return;
				}

				const parts = firstLine.split("|");
				if (parts.length < 2) throw new Error("Invalid API response format");

				const ids = parts[1].trim().split("-");
				if (ids.length < 3) throw new Error("Invalid ID format");

				const tNum = ids[0];
				const codLocOrig = ids[1];
				const dataPartenza = ids[2];

				// 2. Fetch full details
				const detailsUrl = `http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno/andamentoTreno/${codLocOrig}/${tNum}/${dataPartenza}`;
				const detailsResponse = await fetch(
					`${proxyBase}${encodeURIComponent(detailsUrl)}`,
				);
				const data: ViaggiaTrenoResponse = await detailsResponse.json();

				setTrainData(data);
				addRecentTrain(
					trainNumber,
					formatStationName(data.origine),
					formatStationName(data.destinazione),
				);

				// 3. Map to Timeline format
				const mappedStations: TimelineStation[] = data.fermate.map((f) => {
					const events: TimelineEvent[] = [];

					// Arrival
					if (
						f.arrivo_teorico !== null ||
						f.arrivoReale !== null ||
						f.tipoFermata === "A"
					) {
						events.push({
							label: "Arrivo Programmato",
							time: formatTime(f.arrivo_teorico || f.programmata),
						});
						if (f.arrivoReale || f.effettiva) {
							events.push({
								label: "Arrivo Effettivo",
								time: formatTime(f.arrivoReale || f.effettiva),
								isActual: true,
							});
						}
					}

					// Departure
					if (
						f.partenza_teorica !== null ||
						f.partenzaReale !== null ||
						f.tipoFermata === "P"
					) {
						events.push({
							label: "Partenza Programmata",
							time: formatTime(f.partenza_teorica || f.programmata),
						});
						if (f.partenzaReale || f.effettiva) {
							events.push({
								label: "Partenza Effettiva",
								time: formatTime(f.partenzaReale || f.effettiva),
								isActual: true,
							});
						}
					}

					const bin =
						f.binarioEffettivoPartenzaDescrizione ||
						f.binarioProgrammatoPartenzaDescrizione ||
						f.binarioEffettivoArrivoDescrizione ||
						f.binarioProgrammatoArrivoDescrizione ||
						"--";

					return {
						id: f.id,
						name: formatStationName(f.stazione),
						bin: bin,
						events: events,
					};
				});

				setTimeline(mappedStations);
			} catch (err: any) {
				Alert.alert("Errore", `Dettaglio: ${err.message}`, [
					{ text: "OK", onPress: () => router.back() },
				]);
			} finally {
				setLoading(false);
			}
		}

		fetchTrainDetails();
	}, [trainNumber]);

	if (loading || !trainData) {
		return (
			<View className="flex-1 bg-white items-center justify-center">
				<ActivityIndicator size="large" color="#005045" />
				<ThemedText className="mt-4 text-gray-500 font-plus-jakarta-medium">
					Ricerca informazioni treno...
				</ThemedText>
			</View>
		);
	}

	let trainPrefix = "";
	let trainNumOnly = trainNumber;
	if (trainData.compNumeroTreno) {
		const parts = trainData.compNumeroTreno.trim().split(" ");
		if (parts.length > 1) {
			trainPrefix = parts[0].toUpperCase();
			trainNumOnly = parts[1];
		} else {
			trainNumOnly = parts[0];
		}
	}

	let logoSource = null;
	if (trainPrefix === "FR") {
		logoSource = require("../assets/logos/frecciarossa.png");
	} else if (trainPrefix === "REG" || trainPrefix === "RV") {
		logoSource = require("../assets/logos/regionale.png");
	} else if (trainPrefix === "IC" || trainPrefix === "ICN") {
		logoSource = require("../assets/logos/intercity.png");
	}

	let delayText =
		trainData.compRitardo && trainData.compRitardo.length > 0
			? trainData.compRitardo[0]
			: "";
	const isDelay = delayText.toLowerCase().includes("ritardo");

	if (isDelay) {
		const match = delayText.match(/\d+/);
		if (match) {
			delayText = `+${match[0]} MIN`;
		} else {
			delayText = delayText.toUpperCase();
		}
	} else if (delayText) {
		delayText = delayText.charAt(0).toUpperCase() + delayText.slice(1);
	}

	const delayBgColor = isDelay
		? "bg-red-50 border-red-200"
		: "bg-[#005045]/10 border-[#005045]/20";
	const delayTextColor = isDelay ? "!text-red-500" : "!text-[#005045]";

	const lastDetection =
		trainData.stazioneUltimoRilevamento !== "--"
			? formatStationName(trainData.stazioneUltimoRilevamento)
			: "Nessun rilevamento";
	const lastDetectionTime =
		trainData.compOraUltimoRilevamento !== "--"
			? ` - ${trainData.compOraUltimoRilevamento}`
			: "";

	let formattedDate = trainData.dataPartenzaTrenoAsDate || "Oggi";
	if (formattedDate.includes("-")) {
		formattedDate = formattedDate.split("-").reverse().join("/");
	}

	return (
		<View className="flex-1 bg-white">
			{/* Top Bar */}
			<View
				className="flex-row items-center justify-between px-5 pt-1 pb-2 bg-white"
				style={{ paddingTop: insets.top + 16 }}
			>
				<View className="w-10" />
				<ThemedText className="flex-1 text-center text-[15px] font-plus-jakarta-bold !text-gray-950">
					Infomobilità
				</ThemedText>
				<Pressable onPress={() => router.back()} className="p-2 -mr-2">
					<Icon
						name="close"
						size={28}
						className="!text-gray-800"
						weight={300}
					/>
				</Pressable>
			</View>

			<ScrollView className="flex-1 px-5 pt-4 pb-20">
				{/* Header Info */}
				<View className="flex-row items-center justify-between mb-6">
					<View>
						<View className="flex-row items-center mb-1">
							{logoSource ? (
								<Image
									source={logoSource}
									style={{ width: 80, height: 12 }}
									resizeMode="contain"
								/>
							) : (
								<ThemedText className="text-sm font-plus-jakarta-bold !text-gray-900 mr-1">
									{trainPrefix}
								</ThemedText>
							)}
							<ThemedText className="ml-2 text-sm font-plus-jakarta-bold !text-gray-900">
								{trainNumOnly}
							</ThemedText>
						</View>
						<View className="flex-row items-center mt-1">
							<Icon
								name="calendar_today"
								size={14}
								color="#4b5563"
								className="mr-1"
							/>
							<ThemedText className="text-sm font-plus-jakarta-medium !text-gray-700">
								{formattedDate}
							</ThemedText>
						</View>
					</View>

					<Pressable
						className="bg-[#f3f4f6] flex-row items-center px-4 py-2 rounded-2xl"
						onPress={() => setIsFollowModalVisible(true)}
					>
						<Icon
							name="notifications_none"
							size={20}
							color="#005045"
							className="mr-2"
						/>
						<ThemedText className="font-plus-jakarta-bold !text-[#005045]">
							Attiva notifiche
						</ThemedText>
					</Pressable>
				</View>

				{/* Delay Card */}
				<View className="border border-gray-200 rounded-2xl p-4 mb-8">
					<View className="flex-row items-center justify-between">
						<View className="flex-1 mr-4">
							<ThemedText
								className={`font-plus-jakarta-bold !text-gray-950 ${lastDetection !== "Nessun rilevamento" ? "mb-1" : ""}`}
							>
								{lastDetection}
							</ThemedText>
							{lastDetection !== "Nessun rilevamento" && (
								<ThemedText className="text-xs font-plus-jakarta-medium !text-gray-500">
									Ultimo rilevamento: {formattedDate}
									{lastDetectionTime}
								</ThemedText>
							)}
						</View>
						<View className="flex-row items-center">
							<View className={`px-2 py-1 rounded border ${delayBgColor}`}>
								<ThemedText
									className={`text-sm font-plus-jakarta-bold ${delayTextColor}`}
								>
									{delayText}
								</ThemedText>
							</View>
						</View>
					</View>
				</View>

				{/* Timeline */}
				<View className="pl-4">
					{timeline.map((station, index) => (
						<TimelineEventRow
							key={station.id}
							station={station}
							nextStation={timeline[index + 1]}
							isFirst={index === 0}
							isLast={index === timeline.length - 1}
						/>
					))}
				</View>
			</ScrollView>

			<FollowTrainModal
				isVisible={isFollowModalVisible}
				onClose={() => setIsFollowModalVisible(false)}
				onConfirm={() => {
					setIsFollowModalVisible(false);
					setTimeout(() => setIsSuccessModalVisible(true), 400);
				}}
				stations={timeline.map((s) => s.name)}
			/>

			<TopDownModal
				isVisible={isSuccessModalVisible}
				title="Notifica registrata"
				description="Adesso riceverai le informazioni in tempo reale del treno seguito"
				iconName="check"
				buttons={[
					{
						label: "OK",
						onPress: () => {
							setIsSuccessModalVisible(false);
							router.navigate({
								pathname: "/(tabs)/info",
								params: { followed: "true" },
							});
						},
					},
				]}
			/>
		</View>
	);
}
