import { getStationBoardApi } from "@/api/station-board";
import { FollowTrainModal } from "@/components/modals/follow-train-modal";
import { TopDownModal } from "@/components/modals/top-down-modal";
import { ThemedText } from "@/components/themed-text";
import { TimelineEventRow } from "@/components/train-details/timeline-event-row";
import { Icon } from "@/components/ui/icon";
import { PageHeader } from "@/components/ui/page-header";
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
	idOrigine: string;
	idDestinazione: string;
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
	const [stationBoardCategory, setStationBoardCategory] = useState<
		string | null
	>(null);

	useEffect(() => {
		let isMounted = true;

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

				const lines = autoText.split("\n").filter((l) => l.trim().length > 0);
				lines.sort((a, b) => {
					const aIsAltro =
						a.toLowerCase().includes("trenord") ||
						a.toLowerCase().includes("italo");
					const bIsAltro =
						b.toLowerCase().includes("trenord") ||
						b.toLowerCase().includes("italo");
					if (aIsAltro && !bIsAltro) return 1;
					if (!aIsAltro && bIsAltro) return -1;
					return 0;
				});
				const firstLine = lines[0];
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

				// Fetch category from station board
				if (data.stazioneUltimoRilevamento) {
					const currentStation = formatStationName(
						data.stazioneUltimoRilevamento,
					);
					const isArrival =
						data.stazioneUltimoRilevamento.toLowerCase() ===
						data.destinazione.toLowerCase();

					try {
						const boardData = await getStationBoardApi(
							currentStation,
							isArrival,
						);
						let foundTrain = boardData.trains.find(
							(t) => t.trainName === trainNumber.replace(/\D/g, ""),
						);

						if (!foundTrain && !isArrival) {
							const boardDataArr = await getStationBoardApi(
								currentStation,
								true,
							);
							foundTrain = boardDataArr.trains.find(
								(t) => t.trainName === trainNumber.replace(/\D/g, ""),
							);
						}

						if (foundTrain && foundTrain.category) {
							if (isMounted) setStationBoardCategory(foundTrain.category);
						}
					} catch (e) {
						console.warn("Failed to fetch station board for category", e);
					}
				}

				// 3. Map to Timeline format
				let globalDelay = 0;
				if (data.compRitardo && data.compRitardo.length > 0) {
					const comp = data.compRitardo[0].toLowerCase();
					if (comp.includes("ritardo")) {
						const match = comp.match(/\d+/);
						if (match) {
							globalDelay = parseInt(match[0], 10);
						}
					}
				}

				const mappedStations: TimelineStation[] = data.fermate.map((f) => {
					const events: TimelineEvent[] = [];

					// Arrival
					if (
						f.arrivo_teorico !== null ||
						f.arrivoReale !== null ||
						f.tipoFermata === "A"
					) {
						const scheduledTs = f.arrivo_teorico || f.programmata;
						let actualTs = f.arrivoReale || f.effettiva;
						if (!actualTs && scheduledTs) {
							const delay = f.ritardoArrivo || f.ritardo || globalDelay;
							if (delay > 0) {
								actualTs = scheduledTs + delay * 60000;
							}
						}
						const scheduledStr = formatTime(scheduledTs);
						const actualStr = actualTs ? formatTime(actualTs) : null;
						const isDelayed =
							actualTs &&
							scheduledTs &&
							actualTs > scheduledTs &&
							actualStr !== scheduledStr;

						events.push({
							label: "Arrivo",
							time: scheduledStr,
							updatedTime: isDelayed ? actualStr! : undefined,
							isDelayed: !!isDelayed,
							isActual: !!(f.arrivoReale || f.effettiva),
						});
					}

					// Departure
					if (
						f.partenza_teorica !== null ||
						f.partenzaReale !== null ||
						f.tipoFermata === "P"
					) {
						const scheduledTs = f.partenza_teorica || f.programmata;
						let actualTs = f.partenzaReale || f.effettiva;
						if (!actualTs && scheduledTs) {
							const delay = f.ritardoPartenza || f.ritardo || globalDelay;
							if (delay > 0) {
								actualTs = scheduledTs + delay * 60000;
							}
						}
						const scheduledStr = formatTime(scheduledTs);
						const actualStr = actualTs ? formatTime(actualTs) : null;
						const isDelayed =
							actualTs &&
							scheduledTs &&
							actualTs > scheduledTs &&
							actualStr !== scheduledStr;

						events.push({
							label: "Partenza",
							time: scheduledStr,
							updatedTime: isDelayed ? actualStr! : undefined,
							isDelayed: !!isDelayed,
							isActual: !!(f.partenzaReale || f.effettiva),
						});
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
						isCurrent: false,
					};
				});

				let currentIdx = 0;
				for (let i = mappedStations.length - 1; i >= 0; i--) {
					if (mappedStations[i].events.some((e) => e.isActual)) {
						currentIdx = i;
						break;
					}
				}
				if (mappedStations.length > 0) {
					mappedStations[currentIdx].isCurrent = true;
				}

				setTimeline(mappedStations);
			} catch (err: any) {
				Alert.alert("Errore", `Dettaglio: ${err.message}`, [
					{ text: "OK", onPress: () => router.back() },
				]);
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		}

		fetchTrainDetails();

		return () => {
			isMounted = false;
		};
	}, [trainNumber]);

	if (loading || !trainData) {
		return (
			<View className="flex-1 bg-white items-center justify-center">
				<ActivityIndicator size="large" color="#004141" />
				<ThemedText className="mt-4 text-neutral-500 font-google-sans-medium">
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

	const getTrainLogoData = () => {
		if (!trainData) return null;

		const trainPrefix = trainData.compNumeroTreno.split(" ")[0];
		const typeLower = (
			stationBoardCategory ||
			trainData.categoriaDescrizione ||
			trainPrefix ||
			""
		).toLowerCase();

		let isTper = typeLower.includes("tper");

		// Viaggiatreno does not specify the TPER carrier for regional trains,
		// so we infer it from the train's origin/destination region (S05 = Emilia-Romagna)
		if (!isTper && (typeLower.includes("reg") || typeLower === "rv")) {
			if (
				trainData.idOrigine?.startsWith("S05") ||
				trainData.idDestinazione?.startsWith("S05")
			) {
				isTper = true;
			}
		}

		if (isTper) {
			return {
				source: require("@/assets/logos/small/rtper.png"),
				ratio: 2.13,
				readable: "Trenitalia TPER",
			};
		}
		if (typeLower.includes("reg") || typeLower === "rv" || typeLower === "re") {
			return {
				source: require("@/assets/logos/small/r.png"),
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
				source: require("@/assets/logos/small/ic.png"),
				ratio: 0.89,
				readable: "InterCity",
			};
		}
		if (typeLower === "ec" || typeLower.includes("eurocity")) {
			return {
				source: require("@/assets/logos/small/ec.png"),
				ratio: 1.1,
				readable: "EuroCity",
			};
		}
		// Default to Frecciarossa
		return {
			source: require("@/assets/logos/small/f.png"),
			ratio: 1.4,
			readable: "FRECCIAROSSA",
		};
	};

	const logoData = getTrainLogoData();

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

	const delayBgColor = isDelay ? "bg-rose-200" : "bg-rose-50/20"; // If no delay, subtle white
	const delayTextColor = isDelay ? "!text-rose-800" : "!text-white";

	let lastUpdateText = "";
	if (
		trainData.compOraUltimoRilevamento &&
		trainData.compOraUltimoRilevamento !== "--"
	) {
		const [hoursStr, minutesStr] =
			trainData.compOraUltimoRilevamento.split(":");
		if (hoursStr && minutesStr) {
			const updateDate = new Date();
			updateDate.setHours(
				parseInt(hoursStr, 10),
				parseInt(minutesStr, 10),
				0,
				0,
			);
			const now = new Date();
			let diffMs = now.getTime() - updateDate.getTime();
			// Handle crossing midnight
			if (diffMs < -43200000) {
				diffMs += 86400000;
			}
			const diffMins = Math.floor(diffMs / 60000);

			if (diffMins <= 0) {
				lastUpdateText = "Aggiornato ora";
			} else if (diffMins === 1) {
				lastUpdateText = "Aggiornato 1 minuto fa";
			} else {
				lastUpdateText = `Aggiornato ${diffMins} minuti fa`;
			}
		}
	}
	if (!lastUpdateText) {
		lastUpdateText = "Nessun rilevamento";
	}

	let formattedDate = trainData.dataPartenzaTrenoAsDate || "Oggi";
	if (formattedDate.includes("-")) {
		formattedDate = formattedDate.split("-").reverse().join("/");
	}

	const trainPrefixStr = trainData.compNumeroTreno
		? trainData.compNumeroTreno.split(" ")[0]
		: "";
	const typeLowerStr = (
		stationBoardCategory ||
		trainData.categoriaDescrizione ||
		trainPrefixStr ||
		""
	).toLowerCase();
	const tp = trainPrefix.toLowerCase();

	const isFreccia =
		typeLowerStr.includes("freccia") ||
		typeLowerStr.startsWith("fr") ||
		typeLowerStr.startsWith("fa") ||
		typeLowerStr.startsWith("fb") ||
		tp.includes("freccia") ||
		tp.startsWith("fr") ||
		tp.startsWith("fa") ||
		tp.startsWith("fb");

	return (
		<View className="flex-1 bg-white">
			{/* Header */}
			<PageHeader title="N. Treno" />

			{/* Train Info Panel */}
			<View className="bg-primary-600 px-5 pb-6 pt-2">
				<View className="flex-row items-center justify-between mb-1.5">
					<View className="flex-row items-center flex-1 pr-2">
						{logoData && (
							<Image
								source={logoData.source}
								style={{
									height: 16,
									width: 16 * logoData.ratio,
									marginRight: 6,
									marginTop: -3,
									tintColor: "white",
								}}
								resizeMode="contain"
							/>
						)}
						<ThemedText className="text-[18px] font-google-sans-bold !text-white flex-shrink">
							{logoData?.readable || "TRENO"}{" "}
							<ThemedText className="text-[18px] font-google-sans-regular !text-white">
								{trainNumOnly}
							</ThemedText>
						</ThemedText>
					</View>
					<View className="flex-row items-center">
						<Icon name="bookmark_border" size={20} className="!text-white mr-3" />
						<Pressable onPress={() => setIsFollowModalVisible(true)}>
							<Icon name="notifications_none" size={20} className="!text-white" />
						</Pressable>
					</View>
				</View>

				{/* Full Route */}
				<View className="flex-row items-center">
					<ThemedText className="text-[16px] font-google-sans-regular !text-white">
						{formatStationName(trainData.origine)}
					</ThemedText>
					<Icon
						name="arrow_right_alt"
						size={20}
						weight={300}
						color="white"
						className="mx-1 mt-0.5"
					/>
					<ThemedText
						className="text-[16px] font-google-sans-regular !text-white flex-shrink"
						numberOfLines={1}
					>
						{formatStationName(trainData.destinazione)}
					</ThemedText>
				</View>

				{/* Last Update & Delay */}
				<View className="flex-row items-center justify-between mt-6">
					<ThemedText className="text-[13px] font-google-sans-regular !text-white/80">
						{lastUpdateText}
					</ThemedText>

					{delayText && (
						<View className={`px-2.5 py-1 rounded-full ${delayBgColor}`}>
							<ThemedText
								className={`text-[13px] font-google-sans-bold ${delayTextColor}`}
							>
								{delayText}
							</ThemedText>
						</View>
					)}
				</View>
			</View>

			<ScrollView className="flex-1 px-5 pt-4 pb-20">
				{/* Timeline */}
				<View className="pl-4">
					{timeline.map((station, index) => (
						<TimelineEventRow
							key={station.id}
							station={station}
							nextStation={timeline[index + 1]}
							isFirst={index === 0}
							isLast={index === timeline.length - 1}
							isFreccia={isFreccia}
							isClickableStation={true}
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
