import { getViaggiatrenoUrl } from "@/api/proxy-helper";
import { ThemedText } from "@/components/themed-text";
import { InfomobilityTrainBlock } from "@/components/train-details/infomobility-train-block";
import { Icon } from "@/components/ui/icon";
import { STATIONS } from "@/constants/stations";
import { getPurchasedTrips } from "@/utils/trips-store";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LOGOS: Record<string, { source: any; ratio: number }> = {
	FRECCIAROSSA: { source: require("@/assets/logos/small/f.png"), ratio: 1.4 },
	FRECCIARGENTO: { source: require("@/assets/logos/small/f.png"), ratio: 1.4 },
	FRECCIABIANCA: { source: require("@/assets/logos/small/f.png"), ratio: 1.4 },
	InterCity: { source: require("@/assets/logos/small/ic.png"), ratio: 0.89 },
	EuroCity: { source: require("@/assets/logos/small/ec.png"), ratio: 1.1 },
	Regionale: { source: require("@/assets/logos/small/r.png"), ratio: 2.03 },
	"Trenitalia TPER": { source: require("@/assets/logos/small/rtper.png"), ratio: 2.13 },
	Autobus: { source: undefined, ratio: 1 },
};

export function RouteInfomobilityContent({
	tripId,
	solutionTrains,
	isTodayOverride,
}: {
	tripId?: string;
	solutionTrains?: any[];
	isTodayOverride?: boolean;
}) {
	const insets = useSafeAreaInsets();
	const [isLoadingInfo, setIsLoadingInfo] = useState(true);
	const [infoTrainsData, setInfoTrainsData] = useState<any[] | null>(null);

	const trip = tripId ? getPurchasedTrips().find((t) => t.id === tripId) : undefined;
	const trainsToFetch = trip ? trip.trains : solutionTrains;

	const dateObj = new Date(trip?.date || new Date());
	const todayObj = new Date();
	const isToday = isTodayOverride !== undefined ? isTodayOverride : (
		dateObj.getDate() === todayObj.getDate() &&
		dateObj.getMonth() === todayObj.getMonth() &&
		dateObj.getFullYear() === todayObj.getFullYear()
	);

	useEffect(() => {
		if (!trainsToFetch || trainsToFetch.length === 0) {
			setIsLoadingInfo(false);
			return;
		}

		let isMounted = true;
		const fetchInfomobilita = async () => {
			setIsLoadingInfo(true);
			const fetchedData = [];

			try {
				for (const train of trainsToFetch) {
					const trainNumber = train.number;
					if (!trainNumber) continue;

					const targetFetchUrl = getViaggiatrenoUrl(
						`/cercaNumeroTrenoTrenoAutocomplete/${trainNumber}`,
					);

					const controller = new AbortController();
					const timeoutId = setTimeout(() => controller.abort(), 5000);

					let autoText = "";
					try {
						const autoResponse = await fetch(targetFetchUrl, {
							signal: controller.signal,
						});
						autoText = await autoResponse.text();
					} catch (err) {
						console.warn("Autocomplete fetch failed or timed out", err);
						continue;
					} finally {
						clearTimeout(timeoutId);
					}

					if (!autoText || autoText.trim() === "") continue;

					const firstLine = autoText.split("\n")[0];
					if (!firstLine || !firstLine.includes("|")) continue;

					const parts = firstLine.split("|");
					if (parts.length < 2) continue;

					const ids = parts[1].trim().split("-");
					if (ids.length < 3) continue;

					const tNum = ids[0];
					const codLocOrig = ids[1];
					const dataPartenza = ids[2];

					const detailsTargetFetchUrl = getViaggiatrenoUrl(
						`/andamentoTreno/${codLocOrig}/${tNum}/${dataPartenza}`,
					);

					const detailsController = new AbortController();
					const detailsTimeoutId = setTimeout(
						() => detailsController.abort(),
						5000,
					);

					let data;
					try {
						const detailsResponse = await fetch(detailsTargetFetchUrl, {
							signal: detailsController.signal,
						});
						data = await detailsResponse.json();
					} catch (err) {
						console.warn("Details fetch failed or timed out", err);
						continue;
					} finally {
						clearTimeout(detailsTimeoutId);
					}

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

					const mappedStations = data.fermate.map((f: any, idx: number) => {
						const events = [];

						if (
							f.arrivo_teorico !== null ||
							f.arrivoReale !== null ||
							f.tipoFermata === "A"
						) {
							const programmedArr = f.arrivo_teorico || f.programmata;
							let realArr = f.arrivoReale || f.effettiva;
							
							if (isToday && !realArr && programmedArr) {
								const delay = f.ritardoArrivo || f.ritardo || globalDelay;
								if (delay > 0) {
									realArr = programmedArr + delay * 60000;
								}
							}

							let timeStr = "--:--";
							let updatedTimeStr;
							let isDelayed = false;
							let isActual = false;
							let isLate = false;

							if (programmedArr) {
								const arrDate = new Date(programmedArr);
								timeStr = `${arrDate.getHours().toString().padStart(2, "0")}:${arrDate.getMinutes().toString().padStart(2, "0")}`;
							}
							
							if (isToday && realArr) {
								const realDate = new Date(realArr);
								const realTimeStr = `${realDate.getHours().toString().padStart(2, "0")}:${realDate.getMinutes().toString().padStart(2, "0")}`;
								isActual = !!(f.arrivoReale || f.effettiva);
								if (timeStr !== "--:--" && realTimeStr !== timeStr) {
									isDelayed = true;
									updatedTimeStr = realTimeStr;
									if (programmedArr && realDate.getTime() > new Date(programmedArr).getTime()) {
										isLate = true;
									}
								}
							}

							events.push({
								label: "Arrivo",
								time: timeStr,
								isActual: isActual,
								isDelayed: isDelayed,
								isLate: isLate,
								updatedTime: updatedTimeStr,
							});
						}

						if (
							f.partenza_teorica !== null ||
							f.partenzaReale !== null ||
							f.tipoFermata === "P"
						) {
							const programmedDep = f.partenza_teorica || f.programmata;
							let realDep = f.partenzaReale || f.effettiva;
							
							if (isToday && !realDep && programmedDep) {
								const delay = f.ritardoPartenza || f.ritardo || globalDelay;
								if (delay > 0) {
									realDep = programmedDep + delay * 60000;
								}
							}

							let timeStr = "--:--";
							let updatedTimeStr;
							let isDelayed = false;
							let isActual = false;
							let isLate = false;

							if (programmedDep) {
								const depDate = new Date(programmedDep);
								timeStr = `${depDate.getHours().toString().padStart(2, "0")}:${depDate.getMinutes().toString().padStart(2, "0")}`;
							}
							
							if (isToday && realDep) {
								const realDate = new Date(realDep);
								const realTimeStr = `${realDate.getHours().toString().padStart(2, "0")}:${realDate.getMinutes().toString().padStart(2, "0")}`;
								isActual = !!(f.partenzaReale || f.effettiva);
								if (timeStr !== "--:--" && realTimeStr !== timeStr) {
									isDelayed = true;
									updatedTimeStr = realTimeStr;
									if (programmedDep && realDate.getTime() > new Date(programmedDep).getTime()) {
										isLate = true;
									}
								}
							}

							events.push({
								label: "Partenza",
								time: timeStr,
								isActual: isActual,
								isDelayed: isDelayed,
								isLate: isLate,
								updatedTime: updatedTimeStr,
							});
						}

						const bin =
							f.binarioEffettivoPartenzaDescrizione ||
							f.binarioProgrammatoPartenzaDescrizione ||
							f.binarioEffettivoArrivoDescrizione ||
							f.binarioProgrammatoArrivoDescrizione ||
							"--";

						const rawName = f.stazione;
						const found = STATIONS.find(
							(s: any) => s.name.toLowerCase() === rawName.toLowerCase(),
						);
						const name = found
							? found.name
							: rawName
									.toLowerCase()
									.split(" ")
									.map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
									.join(" ");

						let orientamento = null;
						if (data.compOrientamento && data.compOrientamento[idx] && data.compOrientamento[idx] !== "--") {
							orientamento = data.compOrientamento[idx];
						} else if (f.orientamento === "A") {
							orientamento = "Executive in testa";
						} else if (f.orientamento === "B") {
							orientamento = "Executive in coda";
						}

						return {
							id: f.id,
							name: name,
							bin: bin,
							events: events,
							orientamento: orientamento,
						};
					});

					if (isToday) {
						let lastActualIndex = -1;
						for (let i = 0; i < mappedStations.length; i++) {
							if (mappedStations[i].events.some((e: any) => e.isActual)) {
								lastActualIndex = i;
							}
						}
						if (lastActualIndex !== -1) {
							mappedStations[lastActualIndex].isCurrent = true;
						} else if (mappedStations.length > 0) {
							mappedStations[0].isCurrent = true;
						}
					}

					fetchedData.push({
						trainInfo: train,
						data: data,
						timeline: mappedStations,
					});
				}

				if (isMounted) {
					setInfoTrainsData(fetchedData);
				}
			} catch (e) {
				console.error(e);
			} finally {
				if (isMounted) {
					setIsLoadingInfo(false);
				}
			}
		};

		fetchInfomobilita();

		return () => {
			isMounted = false;
		};
	}, [trip, trainsToFetch, isToday]);

	if (isLoadingInfo) {
		return (
			<View className="items-center justify-center py-20 min-h-[300px]">
				<ActivityIndicator size="large" color="#004141" />
				<ThemedText className="mt-4 text-[15px] font-google-sans-medium !text-neutral-500">
					Recupero informazioni in tempo reale...
				</ThemedText>
			</View>
		);
	}
	if (!infoTrainsData || infoTrainsData.length === 0) {
		return (
			<View className="items-center justify-center py-20 min-h-[300px]">
				<Icon
					name="search_off"
					size={48}
					className="!text-neutral-300 mb-4"
				/>
				<ThemedText className="text-[16px] font-google-sans-medium !text-neutral-500">
					Nessuna soluzione trovata in tempo reale.
				</ThemedText>
			</View>
		);
	}

	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			className="pt-2"
			contentContainerStyle={{ paddingBottom: 20 }}
		>
			{infoTrainsData.map((trainData, tIdx) => (
				<View
					key={`train-wrap-${tIdx}`}
					className={tIdx < infoTrainsData.length - 1 ? "mb-8" : ""}
				>
					<InfomobilityTrainBlock
						train={trainData}
						LOGOS={LOGOS}
						isToday={isToday}
					/>
				</View>
			))}
		</ScrollView>
	);
}
