import { searchJourneys, setSelectedSolutionCache } from "@/api/search";
import { BottomSheet } from "@/components/modals/bottom-sheet";
import { SectionHeader } from "@/components/search/section-header";
import {
  TravelSolution,
  TravelSolutionCard,
} from "@/components/search/travel-solution-card";
import { ThemedText } from "@/components/themed-text";
import { TimelineEventRow } from "@/components/train-details/timeline-event-row";
import { Icon } from "@/components/ui/icon";
import { MainButton } from "@/components/ui/main-button";
import { STATIONS } from "@/constants/stations";
import { TimelineStation } from "@/constants/train-details-mock";
import { getGlobalSelectionList } from "@/utils/selection-store";
import { getTrainStopsCount } from "@/utils/viaggiatreno";
import Constants from "expo-constants";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  InteractionManager,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

// MOCK_SOLUTIONS removed in favor of live API

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DATE_ITEM_WIDTH = 80;

const InfomobilityTrainBlock = ({
  train,
  LOGOS,
  isToday,
}: {
  train: any;
  LOGOS: any;
  isToday: boolean;
}) => {
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(false);

  const normalizedType = train.trainInfo.type.trim().toLowerCase();
  const logoKey = Object.keys(LOGOS).find(
    (k) => k.toLowerCase() === normalizedType,
  );
  const logoSource = logoKey ? LOGOS[logoKey] : undefined;

  const passengerOrigin = train.trainInfo.origin;
  const passengerDest = train.trainInfo.destination;

  const normalizeStationName = (name: string) => {
    return name
      .toLowerCase()
      .replace(/c\.le/g, "centrale")
      .replace(/\/av/g, "")
      .replace(/\(av\)/g, "")
      .replace(/p\. ?ga.*/g, "porta garibaldi")
      .replace(/p\.ta/g, "porta")
      .replace(/ - /g, " ")
      .replace(/-/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const matchStation = (target: string) => {
    const normTarget = normalizeStationName(target);

    let idx = train.timeline.findIndex(
      (s: any) => normalizeStationName(s.name) === normTarget,
    );
    if (idx !== -1) return idx;

    idx = train.timeline.findIndex((s: any) => {
      const normS = normalizeStationName(s.name);
      return normS.includes(normTarget) || normTarget.includes(normS);
    });
    return idx;
  };

  let startIndex = matchStation(passengerOrigin);
  let endIndex = matchStation(passengerDest);

  if (startIndex === -1) startIndex = 0;
  if (endIndex === -1 || endIndex < startIndex)
    endIndex = train.timeline.length - 1;

  const hasPrev = startIndex > 0;
  const hasNext = endIndex < train.timeline.length - 1;

  const visibleStations = train.timeline.filter((_: any, idx: number) => {
    if (showPrev && showNext) return true;
    if (showPrev && !showNext) return idx <= endIndex;
    if (!showPrev && showNext) return idx >= startIndex;
    return idx >= startIndex && idx <= endIndex;
  });

  return (
    <View className="mb-10">
      {/* Train Header */}
      <View className="flex-row items-center justify-between mb-4 border-b border-gray-100 pb-3">
        <View className="flex-row items-center gap-3">
          {logoSource ? (
            <Image
              source={logoSource}
              style={{
                height: 16,
                width:
                  normalizedType.includes("freccia") ||
                  normalizedType === "frrossa"
                    ? 85
                    : 65,
              }}
              resizeMode="contain"
            />
          ) : (
            <View className="bg-gray-100 px-2 py-1 rounded border border-gray-200">
              <ThemedText className="text-[13px] font-google-sans-bold !text-gray-700 capitalize">
                {train.trainInfo.type}
              </ThemedText>
            </View>
          )}
          <ThemedText className="text-[16px] font-google-sans-bold !text-gray-900">
            {train.trainInfo.number}
          </ThemedText>
        </View>

        {/* Status Tag */}
        {isToday && train.data.compRitardo && train.data.compRitardo[0] && (
          <View
            className="rounded-md px-2 py-1 border"
            style={{
              backgroundColor:
                train.data.compRitardo[0] === "in orario" ||
                train.data.compRitardo[0] === "non partito"
                  ? "#f0fdf4"
                  : "#ffe4e6",
              borderColor:
                train.data.compRitardo[0] === "in orario" ||
                train.data.compRitardo[0] === "non partito"
                  ? "#bbf7d0"
                  : "#fecdd3",
            }}
          >
            <ThemedText
              className="text-[12px] font-google-sans-bold"
              style={{
                color:
                  train.data.compRitardo[0] === "in orario" ||
                  train.data.compRitardo[0] === "non partito"
                    ? "#166534"
                    : "#e11d48",
                textTransform:
                  train.data.compRitardo[0] === "in orario" ||
                  train.data.compRitardo[0] === "non partito"
                    ? "capitalize"
                    : "uppercase",
              }}
            >
              {train.data.compRitardo[0] === "in orario" ||
              train.data.compRitardo[0] === "non partito"
                ? train.data.compRitardo[0]
                : `+${train.data.compRitardo[0].replace(/[^0-9]/g, "")} MIN`}
            </ThemedText>
          </View>
        )}
      </View>

      {/* Timeline */}
      <View>
        {hasPrev && (
          <Pressable
            onPress={() => setShowPrev(!showPrev)}
            className="items-center py-3 bg-gray-50 rounded-2xl mb-8"
          >
            <ThemedText className="text-[13px] font-google-sans-bold text-primary-600">
              {showPrev
                ? "Nascondi fermate precedenti"
                : "Mostra fermate precedenti"}
            </ThemedText>
          </Pressable>
        )}

        {visibleStations.map((station: TimelineStation, idx: number) => {
          return (
            <TimelineEventRow
              key={station.id}
              station={station}
              nextStation={
                idx < visibleStations.length - 1
                  ? visibleStations[idx + 1]
                  : undefined
              }
              isFirst={idx === 0}
              isLast={idx === visibleStations.length - 1}
              isTruncatedTop={idx === 0 && hasPrev && !showPrev}
              isTruncatedBottom={
                idx === visibleStations.length - 1 && hasNext && !showNext
              }
            />
          );
        })}

        {hasNext && (
          <Pressable
            onPress={() => setShowNext(!showNext)}
            className="items-center py-3 bg-gray-50 rounded-2xl mt-8"
          >
            <ThemedText className="text-[13px] font-google-sans-bold text-primary-600">
              {showNext
                ? "Nascondi fermate successive"
                : "Mostra fermate successive"}
            </ThemedText>
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default function SearchResultsScreen() {
	const params = useLocalSearchParams();
	const from = (params.from as string) || "";
	const to = (params.to as string) || "";
	const dateStr = params.dateStr as string;
	const passengerText = (params.passengerText as string) || "1 Adulto";

	const route = { from, to };
	const departureDate = dateStr ? new Date(dateStr) : new Date();

	const insets = useSafeAreaInsets();
	const [showFilters, setShowFilters] = useState(false);
	const [activeTravelType, setActiveTravelType] = useState(
		(params.travelType as string) || "Principali Soluzioni",
	);
	const [noChanges, setNoChanges] = useState(params.noChanges === "true");
	const [bike, setBike] = useState(params.bike === "true");

	const [localFrom, setLocalFrom] = useState(route.from);
	const [localTo, setLocalTo] = useState(route.to);
	const [currentSelectedDate, setCurrentSelectedDate] = useState(departureDate);

	const isToday =
		currentSelectedDate.getDate() === new Date().getDate() &&
		currentSelectedDate.getMonth() === new Date().getMonth() &&
		currentSelectedDate.getFullYear() === new Date().getFullYear();
	const [solutions, setSolutions] = useState<TravelSolution[]>([]);

	const globalList = getGlobalSelectionList();
	const extraServicesCost =
		globalList.filter(
			(p) =>
				p.itemType === "service" &&
				(p.type === "Animale" || p.type === "Bicicletta"),
		).length * 5.0;
	const passengerCount = (passengerText || "1 Adulto")
		.split(",")
		.map((p: string) => parseInt(p.trim().split(" ")[0] || "0", 10))
		.reduce((a: number, b: number) => a + b, 0);
	const [isLoading, setIsLoading] = useState(true);
	const [isFetchingMore, setIsFetchingMore] = useState(false);
	const [isFetchingPrevious, setIsFetchingPrevious] = useState(false);
	const [hasFetchedPrevious, setHasFetchedPrevious] = useState(false);
	const allRoutesRef = useRef<any[]>([]);
	const dateScrollRef = useRef<FlatList>(null);

	const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
	const [isLoadingInfo, setIsLoadingInfo] = useState(false);
	const [infoTrainsData, setInfoTrainsData] = useState<
		{ trainInfo: any; timeline: TimelineStation[]; data: any }[] | null
	>(null);

		useEffect(() => {
		if (!solutions || solutions.length === 0) return;

		let mounted = true;

		const calculateRegionalPrices = async () => {
			const targetSols = solutions.filter(sol => {
				if (sol.price <= 0 || sol.trains.length <= 1) return false;
				const isOnlyRegional = sol.trains.every((t: any) =>
					t.type.toLowerCase().includes("regionale") ||
					t.type.toLowerCase().includes("reg")
				);
				if (!isOnlyRegional) return false;
				if (sol.trains[0].calculatedPrice !== undefined) return false;
				return true;
			});

			if (targetSols.length === 0) return;

			// Process sequentially to avoid API limits
			for (const sol of targetSols) {
				if (!mounted) break;
				try {
					const stopsCounts = await Promise.all(
						sol.trains.map((t: any) => getTrainStopsCount(t.number, t.origin, t.destination))
					);
					if (!mounted) break;

					const totalStops: number = stopsCounts.reduce((acc: number, curr) => acc + (curr || 1), 0);

					setSolutions(prev => prev.map(p => {
						if (p.id === sol.id) {
							let remainingPrice = p.price;
							return {
								...p,
								trains: p.trains.map((t: any, idx: number) => {
									if (idx === p.trains.length - 1) {
										return { ...t, calculatedPrice: Number(remainingPrice.toFixed(2)) };
									}
									const exactPrice = (p.price / totalStops) * (stopsCounts[idx] || 1);
									const roundedPrice = Math.round(exactPrice / 0.05) * 0.05;
									remainingPrice -= roundedPrice;
									return {
										...t,
										calculatedPrice: Number(roundedPrice.toFixed(2))
									};
								})
							};
						}
						return p;
					}));
				} catch (e) {
					console.warn(e);
				}
			}
		};

		const timeoutId = setTimeout(() => {
			calculateRegionalPrices();
		}, 1500);

		return () => {
			mounted = false;
			clearTimeout(timeoutId);
		};
	}, [solutions]);

	const handleOpenInfomobilita = async (trains: TravelSolution["trains"]) => {
		setIsInfoModalVisible(true);
		setIsLoadingInfo(true);
		setInfoTrainsData(null);

		const fetchedData = [];

		const hostUri = Constants.expoConfig?.hostUri;
		const proxyBase =
			Platform.OS === "web"
				? hostUri
					? `http://${hostUri}/api/proxy?url=`
					: "/api/proxy?url="
				: "";

		try {
			for (const train of trains) {
				const trainNumber = train.number;
				const autoUrl = `http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno/cercaNumeroTrenoTrenoAutocomplete/${trainNumber}`;

				const controller = new AbortController();
				const timeoutId = setTimeout(() => controller.abort(), 5000);

				const targetFetchUrl = proxyBase
					? `${proxyBase}${encodeURIComponent(autoUrl)}`
					: autoUrl;

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

				const detailsUrl = `http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno/andamentoTreno/${codLocOrig}/${tNum}/${dataPartenza}`;

				const detailsController = new AbortController();
				const detailsTimeoutId = setTimeout(
					() => detailsController.abort(),
					5000,
				);

				const detailsTargetFetchUrl = proxyBase
					? `${proxyBase}${encodeURIComponent(detailsUrl)}`
					: detailsUrl;

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

				const mappedStations = data.fermate.map((f: any) => {
					const events = [];

					if (
						f.arrivo_teorico !== null ||
						f.arrivoReale !== null ||
						f.tipoFermata === "A"
					) {
						const programmedArr = f.arrivo_teorico || f.programmata;
						if (programmedArr) {
							const arrDate = new Date(programmedArr);
							events.push({
								label: "Arrivo Programmato",
								time: `${arrDate.getHours().toString().padStart(2, "0")}:${arrDate.getMinutes().toString().padStart(2, "0")}`,
							});
						}
						const realArr = f.arrivoReale || f.effettiva;
						if (isToday && realArr) {
							const realDate = new Date(realArr);
							events.push({
								label: "Arrivo Effettivo",
								time: `${realDate.getHours().toString().padStart(2, "0")}:${realDate.getMinutes().toString().padStart(2, "0")}`,
								isActual: true,
							});
						}
					}

					if (
						f.partenza_teorica !== null ||
						f.partenzaReale !== null ||
						f.tipoFermata === "P"
					) {
						const programmedDep = f.partenza_teorica || f.programmata;
						if (programmedDep) {
							const depDate = new Date(programmedDep);
							events.push({
								label: "Partenza Programmata",
								time: `${depDate.getHours().toString().padStart(2, "0")}:${depDate.getMinutes().toString().padStart(2, "0")}`,
							});
						}
						const realDep = f.partenzaReale || f.effettiva;
						if (isToday && realDep) {
							const realDate = new Date(realDep);
							events.push({
								label: "Partenza Effettiva",
								time: `${realDate.getHours().toString().padStart(2, "0")}:${realDate.getMinutes().toString().padStart(2, "0")}`,
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

					return {
						id: f.id,
						name: name,
						bin: bin,
						events: events,
					};
				});

				fetchedData.push({
					trainInfo: train,
					data: data,
					timeline: mappedStations,
				});
			}

			setInfoTrainsData(fetchedData);
		} catch (e) {
			console.error(e);
		} finally {
			setIsLoadingInfo(false);
		}
	};

	const mapRoutesToSolutions = useCallback(
		(routes: any[], targetDateStr: string) => {
			const uniqueRoutesMap = new Map();
			for (const r of routes) {
				uniqueRoutesMap.set(r.dx.toString() + r.ns, r);
			}
			const uniqueRoutes = Array.from(uniqueRoutesMap.values());

			// Sort chronologically
			uniqueRoutes.sort((a: any, b: any) => a.dx - b.dx);

			const sameDayRoutes = uniqueRoutes.filter((r: any) => {
				const routeDate = new Date(r.dx * 1000);
				return routeDate.toDateString() === targetDateStr;
			});

			return sameDayRoutes.map((r: any) => {
				const parsedPrice = r.pr ? parseFloat(r.pr.replace(",", ".")) : 0;
				return {
					id: r.dx.toString() + r.ns, // No idx, stable key!
					date: currentSelectedDate.toISOString(),
					trains: r.l.map((leg: any) => ({
						type: leg.ts,
						number: leg.n,
						origin: leg.ds,
						destination: leg.as,
						departureTime: leg.dt,
						arrivalTime: leg.at,
					})),
					departureTime: r.dt,
					arrivalTime: r.at,
					duration: r.dur.replace("'", "min").replace("h", "h "),
					price: isNaN(parsedPrice) ? 0 : parsedPrice,
					offerName: (() => {
						const offerRaw = r.tk?.[0]?.sf || "Ordinaria";

						const formatName = (rawName: string) => {
							let name = rawName.replace(/[- ]*post[oi]\s+a\s+sedere/ig, "").trim();
							if (name === "S.ECONOMY") return "Super Economy";
							if (
								name.toUpperCase() === "FR.DAYS" ||
								name.toUpperCase() === "FRECCIADAYS"
							)
								return "FrecciaDAYS";
							if (name.toUpperCase() === "FRECCIAYOUNG") return "FrecciaYOUNG";
							return name
								.toLowerCase()
								.split(" ")
								.map(
									(word: string) =>
										word.charAt(0).toUpperCase() + word.slice(1),
								)
								.join(" ")
								.trim();
						};

						return formatName(offerRaw);
					})(),
					serviceClass: (() => {
						const classRaw = r.tk?.[0]?.sc || r.tk?.[0]?.c?.[0] || "Standard";
						return classRaw
							.replace(/ PRENOTAZIONE/i, "")
							.replace(/posto a sedere/i, "")
							.trim();
					})(),
					tickets: r.tk || [],
				};
			});
		},
		[currentSelectedDate],
	);

	const handleFetchPrevious = async () => {
		if (hasFetchedPrevious || isFetchingPrevious) return;
		setIsFetchingPrevious(true);

		try {
			const targetDateStr = currentSelectedDate.toDateString();
			let tempDate = new Date(currentSelectedDate);
			tempDate.setHours(0, 0, 0, 0); // Start of the day

			for (let i = 0; i < 6; i++) {
				const res = await searchJourneys(localFrom, localTo, tempDate);

				if (res.data && res.data.routes && res.data.routes.length > 0) {
					allRoutesRef.current = [...allRoutesRef.current, ...res.data.routes];

					const mapped = mapRoutesToSolutions(
						allRoutesRef.current,
						targetDateStr,
					);
					setSolutions(mapped);

					const lastRoute = res.data.routes[res.data.routes.length - 1];
					const lastRouteDate = new Date(lastRoute.dx * 1000);

					// Stop if we reached the selected date time or crossed the day
					if (
						lastRouteDate.toDateString() !== targetDateStr ||
						lastRouteDate >= currentSelectedDate
					) {
						break;
					}

					tempDate = new Date(lastRouteDate.getTime() + 60000);
				} else {
					break;
				}
			}
			setHasFetchedPrevious(true);
		} catch (e) {
			console.error(e);
		} finally {
			setIsFetchingPrevious(false);
		}
	};

	useEffect(() => {
		let isCancelled = false;

		const fetchSolutions = async () => {
			setIsLoading(true);
			setSolutions([]);
			allRoutesRef.current = [];
			setHasFetchedPrevious(false);

			try {
				let currentDateToFetch = new Date(currentSelectedDate);
				const targetDateStr = currentSelectedDate.toDateString();

				const firstResult = await searchJourneys(
					localFrom,
					localTo,
					currentDateToFetch,
				);

				if (isCancelled) return;

				if (
					firstResult.data &&
					firstResult.data.routes &&
					firstResult.data.routes.length > 0
				) {
					allRoutesRef.current = [...firstResult.data.routes];

					const mappedFirst = mapRoutesToSolutions(
						allRoutesRef.current,
						targetDateStr,
					);

					if (mappedFirst.length === 0) {
						if (currentSelectedDate.getHours() >= 18) {
							const nextDay = new Date(currentSelectedDate);
							nextDay.setDate(nextDay.getDate() + 1);
							nextDay.setHours(0, 0, 0, 0);
							setCurrentSelectedDate(nextDay);
							return;
						}
					}

					setSolutions(mappedFirst);

					let lastRoute =
						firstResult.data.routes[firstResult.data.routes.length - 1];
					let lastRouteDate = new Date(lastRoute.dx * 1000);

					if (lastRouteDate.toDateString() !== targetDateStr) {
						setIsLoading(false);
						return;
					}
					currentDateToFetch = new Date(lastRouteDate.getTime() + 60000);

					// Stream remaining solutions in the background
					const fetchRemaining = async () => {
						setIsFetchingMore(true);
						let tempDate = currentDateToFetch;
						for (let i = 0; i < 5; i++) {
							if (isCancelled) break;
							try {
								const res = await searchJourneys(localFrom, localTo, tempDate);
								if (isCancelled) break;

								if (res.data && res.data.routes && res.data.routes.length > 0) {
									allRoutesRef.current = [
										...allRoutesRef.current,
										...res.data.routes,
									];

									const mapped = mapRoutesToSolutions(
										allRoutesRef.current,
										targetDateStr,
									);
									setSolutions(mapped);

									lastRoute = res.data.routes[res.data.routes.length - 1];
									lastRouteDate = new Date(lastRoute.dx * 1000);
									if (lastRouteDate.toDateString() !== targetDateStr) break;
									tempDate = new Date(lastRouteDate.getTime() + 60000);
								} else {
									break;
								}
							} catch (e) {
								console.error(e);
								break;
							}
						}
						if (!isCancelled) {
							setIsFetchingMore(false);
							setIsLoading(false);
						}
					};

					await fetchRemaining();
				} else {
					if (currentSelectedDate.getHours() >= 18) {
						const nextDay = new Date(currentSelectedDate);
						nextDay.setDate(nextDay.getDate() + 1);
						nextDay.setHours(0, 0, 0, 0);
						setCurrentSelectedDate(nextDay);
						return;
					}
					setSolutions([]);
					setIsLoading(false);
				}
			} catch (err: any) {
				console.error(err);
				if (!isCancelled) {
					if (currentSelectedDate.getHours() >= 18) {
						const nextDay = new Date(currentSelectedDate);
						nextDay.setDate(nextDay.getDate() + 1);
						nextDay.setHours(0, 0, 0, 0);
						setCurrentSelectedDate(nextDay);
						return;
					}
					setSolutions([]);
					setIsLoading(false);
				}
			}
		};

		InteractionManager.runAfterInteractions(() => {
			if (!isCancelled) fetchSolutions();
		});

		return () => {
			isCancelled = true;
		};
	}, [localFrom, localTo, currentSelectedDate, mapRoutesToSolutions]);

	// Generate dates from today - 2 to today + 365
	const dates = useMemo(() => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const start = new Date(today);
		start.setDate(today.getDate() - 2);

		return Array.from({ length: 367 }, (_, i) => {
			const d = new Date(start);
			d.setDate(start.getDate() + i);
			return d;
		});
	}, []);

	// Find index of selected date
	const selectedDateIndex = useMemo(() => {
		return dates.findIndex(
			(d) =>
				d.getDate() === currentSelectedDate.getDate() &&
				d.getMonth() === currentSelectedDate.getMonth() &&
				d.getFullYear() === currentSelectedDate.getFullYear(),
		);
	}, [dates, currentSelectedDate]);

	const snapOffsets = useMemo(() => {
		return dates.map((_, i) =>
			Math.max(0, i * DATE_ITEM_WIDTH - SCREEN_WIDTH / 2 + DATE_ITEM_WIDTH / 2),
		);
	}, [dates]);

	const scrollToDate = (index: number, animated = true) => {
		if (dateScrollRef.current && index !== -1) {
			const offset = snapOffsets[index];
			dateScrollRef.current.scrollToOffset({ offset, animated });
		}
	};

	useEffect(() => {
		if (selectedDateIndex !== -1 && dateScrollRef.current) {
			scrollToDate(selectedDateIndex, false);
		}
	}, [selectedDateIndex, snapOffsets]);

	// Formatters
	const formatDisplayDate = (date: Date) => {
		const months = [
			"gen",
			"feb",
			"mar",
			"apr",
			"mag",
			"giu",
			"lug",
			"ago",
			"set",
			"ott",
			"nov",
			"dic",
		];
		const day = date.getDate();
		const month = months[date.getMonth()];
		const hours = date.getHours().toString().padStart(2, "0");
		const minutes = date.getMinutes().toString().padStart(2, "0");
		return `${day} ${month} - ${hours}:${minutes}`;
	};

	const formatDateStrip = (date: Date) => {
		const days = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
		return `${days[date.getDay()]} ${date.getDate()}`;
	};

	const isPast = (d: Date) => {
		const now = new Date();
		now.setHours(0, 0, 0, 0);
		return d < now;
	};

	const handleSwitch = () => {
		const temp = localFrom;
		setLocalFrom(localTo);
		setLocalTo(temp);
	};

	const isFreccia = (type: string) => {
		const t = type.toLowerCase();
		return (
			t.includes("freccia") ||
			t.includes("frrossa") ||
			t.includes("frargento") ||
			t.includes("frbianca") ||
			t === "fr" ||
			t === "fa" ||
			t === "fb" ||
			t.startsWith("fr ") ||
			t.startsWith("fa ") ||
			t.startsWith("fb ")
		);
	};

	const isIntercity = (type: string) => {
		const t = type.toLowerCase();
		return (
			t.includes("intercity") ||
			t.includes("icnotte") ||
			t === "ic" ||
			t === "icn" ||
			t === "ni" ||
			t === "en" ||
			t === "ec" ||
			t.includes("eurocity") ||
			t.includes("euronight") ||
			t.startsWith("ic ") ||
			t.startsWith("icn ") ||
			t.startsWith("ni ") ||
			t.startsWith("en ") ||
			t.startsWith("ec ")
		);
	};

	const isRegionale = (type: string) => {
		const t = type.toLowerCase();
		return (
			t.includes("regionale") ||
			t.includes("tper") ||
			t.includes("regv") ||
			t.includes("reg") ||
			t === "rv" ||
			t === "re" ||
			t === "r" ||
			t.startsWith("rv ") ||
			t.startsWith("re ") ||
			t.startsWith("r ")
		);
	};

	const filteredSolutions = solutions
		.filter((sol) => {
			if (
				activeTravelType === "Principali Soluzioni" ||
				activeTravelType === "Tutte"
			)
				return true;
			if (activeTravelType === "Frecce") {
				return sol.trains.every((t) => isFreccia(t.type));
			}
			if (activeTravelType === "Intercity") {
				return sol.trains.every((t) => isIntercity(t.type));
			}
			if (activeTravelType === "Regionali") {
				return sol.trains.every((t) => isRegionale(t.type));
			}
			return true;
		})
		.filter((sol) => !noChanges || sol.trains.length === 1)
		.filter((sol) => {
			if (!bike) return true;
			return sol.trains.every((t) => {
				const typeStr = t.type.toLowerCase();
				return (
					isRegionale(t.type) ||
					isIntercity(t.type) ||
					typeStr.includes("ec ") ||
					typeStr === "ec" ||
					typeStr.includes("eurocity")
				);
			});
		})
		.filter(
			(solution: TravelSolution) =>
				!solution.trains.some((t) => t.type.toLowerCase().includes("italo")),
		);

	let minPrice = Infinity;
	let minDuration = Infinity;

	const parseDuration = (dur: string) => {
		let total = 0;
		if (dur.includes("h")) {
			const parts = dur.split("h");
			total += parseInt(parts[0].trim()) * 60;
			if (parts[1]) {
				total += parseInt(parts[1].replace("min", "").trim() || "0");
			}
		} else {
			total += parseInt(dur.replace("min", "").trim() || "0");
		}
		return total;
	};

	filteredSolutions.forEach((s) => {
		if (s.price > 0) {
			if (s.price < minPrice) minPrice = s.price;
			if (s.duration) {
				const d = parseDuration(s.duration);
				if (d > 0 && d < minDuration) minDuration = d;
			}
		}
	});

	return (
		<View className="flex-1 bg-white">
			{/* Top Green Header */}
			<View className="bg-primary-600 px-5" style={{ paddingTop: insets.top }}>
				{/* Navigation Row */}
				<View className="flex-row items-center justify-between relative">
					<Pressable onPress={() => router.back()} className="p-2 -ml-2 z-10">
						<Icon name="arrow_back" size={26} className="!text-white" />
					</Pressable>

					<View className="absolute left-0 right-0 top-0 bottom-0 items-center justify-center">
						<ThemedText className="text-[17px] font-google-sans-bold !text-white">
							Andata
						</ThemedText>
					</View>

					<View className="flex-row items-center gap-5 mr-1 z-10">
						<Pressable onPress={() => router.navigate("/")}>
							<Icon name="home" size={26} className="!text-white" />
						</Pressable>
					</View>
				</View>

				{/* Stations Card */}
				<View className="bg-white/10 rounded-2xl px-4 mt-3 flex-row items-center h-[56px]">
					<ThemedText
						numberOfLines={1}
						className="flex-1 text-[14px] font-google-sans-semibold !text-white"
					>
						{localFrom}
					</ThemedText>

					<Pressable
						onPress={handleSwitch}
						className="h-10 w-10 bg-white rounded-full items-center justify-center mx-4"
					>
						<Icon name="swap_horiz" size={24} className="!text-primary-600" />
					</Pressable>

					<ThemedText
						numberOfLines={1}
						className="flex-1 text-[14px] font-google-sans-semibold !text-white"
					>
						{localTo}
					</ThemedText>
				</View>

				{/* Info Row */}
				<View className="flex-row gap-3 mt-3">
					<View className="flex-1 bg-white/10 rounded-2xl p-3.5 h-[56px] justify-center">
						<ThemedText className="text-[12px] font-google-sans-medium !text-white/60 mb-0.5">
							Andata
						</ThemedText>
						<ThemedText className="text-[15px] font-google-sans-bold !text-white">
							{formatDisplayDate(currentSelectedDate)}
						</ThemedText>
					</View>
					<View className="flex-1 bg-white/10 rounded-2xl p-3.5 h-[56px] justify-center">
						<ThemedText className="text-[12px] font-google-sans-medium !text-white/60 mb-0.5">
							Passeggeri
						</ThemedText>
						<ThemedText
							numberOfLines={1}
							className="text-[15px] font-google-sans-bold !text-white"
						>
							{passengerText}
						</ThemedText>
					</View>
				</View>

				{/* Date Selector Strip */}
				<View className="mt-4 -mx-5">
					<FlatList
						ref={dateScrollRef}
						data={dates}
						keyExtractor={(_, index) => index.toString()}
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{ paddingHorizontal: 0 }}
						snapToOffsets={snapOffsets}
						snapToAlignment="center"
						decelerationRate="fast"
						initialNumToRender={10}
						getItemLayout={(_, index) => ({
							length: DATE_ITEM_WIDTH,
							offset: snapOffsets[index],
							index,
						})}
						onLayout={() => {
							if (selectedDateIndex !== -1) {
								scrollToDate(selectedDateIndex, false);
							}
						}}
						renderItem={({ item: date, index: idx }) => {
							const isSelected =
								date.getDate() === currentSelectedDate.getDate() &&
								date.getMonth() === currentSelectedDate.getMonth() &&
								date.getFullYear() === currentSelectedDate.getFullYear();
							const isDisabled = isPast(date);

							return (
								<Pressable
									onPress={() => {
										if (!isDisabled) {
											setCurrentSelectedDate(date);
											scrollToDate(idx);
										}
									}}
									style={{ width: DATE_ITEM_WIDTH }}
									className="items-center"
								>
									<View className="items-center pb-4">
										<ThemedText
											className={`text-[14px] font-google-sans-semibold ${
												isSelected
													? "!text-white"
													: isDisabled
														? "!text-white/20"
														: "!text-white/60"
											}`}
										>
											{formatDateStrip(date)}
										</ThemedText>
										{isSelected && (
											<View className="absolute bottom-0 h-1 w-full bg-white" />
										)}
									</View>
								</Pressable>
							);
						}}
					/>
				</View>
			</View>

			{/* Results List */}
			<ScrollView className="flex-1 bg-gray-50">
				<View className="p-4 gap-4 pb-32">
					{/* Previous Solutions Button */}
					{!hasFetchedPrevious && (
						<Pressable
							onPress={handleFetchPrevious}
							disabled={isFetchingPrevious || isLoading}
							className="h-12 w-full items-center justify-center rounded-2xl border border-gray-200 bg-white mb-1"
						>
							<ThemedText className="text-[15px] font-google-sans-bold !text-gray-800">
								Soluzioni precedenti
							</ThemedText>
						</Pressable>
					)}
					{isFetchingPrevious && (
						<View className="py-6 items-center">
							<ActivityIndicator size="large" color="#004141" />
						</View>
					)}

					{isLoading ? (
						<View className="py-10">
							<ActivityIndicator size="large" color="#004141" />
						</View>
					) : (
						<>
							{filteredSolutions.map((solution) => (
								<TravelSolutionCard
									key={solution.id}
									solution={{
										...solution,
										price:
											solution.price > 0
												? solution.price * passengerCount + extraServicesCost
												: 0,
									}}
									route={route}
									searchDate={currentSelectedDate}
									isCheapest={solution.price > 0 && solution.price === minPrice}
									isFastest={
										solution.price > 0 &&
										!!solution.duration &&
										parseDuration(solution.duration) === minDuration
									}
									onPressInfo={() => handleOpenInfomobilita(solution.trains)}
									onPress={() => {
										if (!solution.price) return;
										setSelectedSolutionCache(solution);
										router.push({
											pathname: "/select-offer",
											params: {
												routeStr: `${route.from} - ${route.to}`,
												dateStr: currentSelectedDate.toISOString(),
												passengerText: passengerText,
												passengerNamesText: params.passengerNamesText,
											},
										});
									}}
								/>
							))}
							{filteredSolutions.length === 0 && !isFetchingMore && (
								<View className="items-center py-10">
									<ThemedText className="text-gray-500 font-google-sans-medium">
										Nessuna soluzione trovata per questa tipologia.
									</ThemedText>
								</View>
							)}
							{isFetchingMore && (
								<View className="py-6 items-center">
									<ActivityIndicator size="large" color="#004141" />
								</View>
							)}
						</>
					)}
				</View>
			</ScrollView>

			{/* Filters Floating Button */}
			<View className="absolute bottom-12 left-1/2 -ml-16">
				<Pressable
					onPress={() => setShowFilters(true)}
					className="h-12 w-32 flex-row items-center justify-center rounded-full bg-red-600"
				>
					<Icon name="tune" size={20} className="!text-white" />
					<ThemedText className="ml-2 text-[15px] font-google-sans-bold !text-white">
						Filtri
					</ThemedText>
				</Pressable>
			</View>

			{/* Filters Bottom Sheet */}
			<BottomSheet
				isVisible={showFilters}
				onClose={() => setShowFilters(false)}
				title="Filtra e ordina"
			>
				<ScrollView className="max-h-[80%] -mx-6">
					<View className="px-6 pb-6 gap-8">
						{/* Section 1: Train Type */}
						<View className="gap-5">
							<SectionHeader title="FILTRA PER TIPOLOGIA TRENO" />
							<View className="gap-2">
								{[
									"Principali Soluzioni",
									"Frecce",
									"Intercity",
									"Regionali",
								].map((type) => (
									<Pressable
										key={type}
										onPress={() => setActiveTravelType(type)}
										className="flex-row items-center justify-between py-3.5"
									>
										<View className="flex-row items-center">
											<ThemedText className="text-[16px] font-google-sans-bold !text-gray-800">
												{type}
											</ThemedText>
											{type === "Principali Soluzioni" && (
												<Icon
													name="info"
													size={16}
													className="ml-2 !text-gray-600"
												/>
											)}
										</View>
										<View
											className={`h-6 w-6 rounded-full border-2 items-center justify-center ${
												activeTravelType === type
													? "border-primary-600"
													: "border-gray-200"
											}`}
										>
											{activeTravelType === type && (
												<View className="h-3 w-3 rounded-full bg-primary-600" />
											)}
										</View>
									</Pressable>
								))}
							</View>
						</View>

						{/* Section 2: Journey Preferences */}
						<View className="gap-5">
							<SectionHeader title="PREFERENZE VIAGGIO" />
							<View className="gap-5">
								<Pressable
									onPress={() => setNoChanges(!noChanges)}
									className="flex-row items-center justify-between py-1"
								>
									<ThemedText className="text-[16px] font-google-sans-bold !text-gray-800">
										Soluzioni senza cambi
									</ThemedText>
									<View
										className={`h-6 w-11 rounded-full p-1 ${
											noChanges
												? "bg-primary-600 items-end"
												: "bg-gray-100 items-start"
										}`}
									>
										<View className="h-4 w-4 rounded-full bg-white" />
									</View>
								</Pressable>
								<Pressable
									onPress={() => setBike(!bike)}
									className="flex-row items-center justify-between py-1"
								>
									<ThemedText className="text-[16px] font-google-sans-bold !text-gray-800">
										Viaggia con la tua bici
									</ThemedText>
									<View
										className={`h-6 w-11 rounded-full p-1 ${
											bike
												? "bg-primary-600 items-end"
												: "bg-gray-100 items-start"
										}`}
									>
										<View className="h-4 w-4 rounded-full bg-white" />
									</View>
								</Pressable>
							</View>
						</View>

						{/* Section 3: Sort */}
						<View className="gap-5">
							<SectionHeader title="ORDINA PER" />
							<View className="gap-2">
								{[
									"Orario di partenza",
									"Orario di arrivo",
									"Durata del viaggio",
									"Prezzo",
								].map((sort) => (
									<Pressable
										key={sort}
										className="flex-row items-center justify-between py-3.5"
									>
										<ThemedText className="text-[16px] font-google-sans-bold !text-gray-800">
											{sort}
										</ThemedText>
										<View
											className={`h-6 w-6 rounded-full border-2 items-center justify-center ${
												sort === "Orario di partenza"
													? "border-primary-600"
													: "border-gray-200"
											}`}
										>
											{sort === "Orario di partenza" && (
												<View className="h-3 w-3 rounded-full bg-primary-600" />
											)}
										</View>
									</Pressable>
								))}
							</View>
						</View>
					</View>
				</ScrollView>

				<View className="flex-row gap-4 mt-6">
					<Pressable className="flex-1 h-14 items-center justify-center rounded-2xl border border-gray-300">
						<ThemedText className="text-[16px] font-google-sans-bold !text-gray-800 uppercase">
							Reset
						</ThemedText>
					</Pressable>
					<MainButton
						title="Conferma"
						onPress={() => setShowFilters(false)}
						className="flex-[1.5]"
					/>
				</View>
			</BottomSheet>

			{/* Infomobilità Percorso Modal */}
			<BottomSheet
				isVisible={isInfoModalVisible}
				onClose={() => setIsInfoModalVisible(false)}
				title="Infomobilità Percorso"
				contentPaddingBottom={-insets.bottom}
			>
				{isLoadingInfo ? (
					<View className="py-20 items-center justify-center">
						<ActivityIndicator size="large" color="#004141" />
						<ThemedText className="mt-4 text-[15px] font-google-sans-medium !text-gray-500">
							Recupero informazioni in tempo reale...
						</ThemedText>
					</View>
				) : infoTrainsData && infoTrainsData.length > 0 ? (
					<ScrollView
						showsVerticalScrollIndicator={false}
						className="mt-2"
						contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
					>
						{infoTrainsData.map((train, tIdx) => {
							return (
								<View
									key={`train-wrap-${tIdx}`}
									className={tIdx < infoTrainsData.length - 1 ? "mb-8" : ""}
								>
									<InfomobilityTrainBlock
										train={train}
										LOGOS={LOGOS}
										isToday={isToday}
									/>
								</View>
							);
						})}
					</ScrollView>
				) : (
					<View className="py-20 items-center justify-center">
						<Icon name="search_off" size={48} className="!text-gray-300 mb-4" />
						<ThemedText className="text-[16px] font-google-sans-medium !text-gray-500">
							Nessuna soluzione trovata in tempo reale.
						</ThemedText>
					</View>
				)}
			</BottomSheet>
		</View>
	);
}
