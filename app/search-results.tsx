import { getBulkStationDelays } from "@/api/delay";
import { searchJourneys, setSelectedSolutionCache } from "@/api/search";
import { BottomSheet } from "@/components/modals/bottom-sheet";
import { CalendarPanel } from "@/components/search/calendar-panel";
import { PassengersPanel } from "@/components/search/passengers-panel";
import {
	TravelSolution,
	TravelSolutionCard,
} from "@/components/search/travel-solution-card";
import { ThemedText } from "@/components/themed-text";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { MainButton } from "@/components/ui/main-button";
import { PageHeader } from "@/components/ui/page-header";
import { formatClassName, formatOfferName } from "@/utils/format";
import {
	SelectionItem,
	getGlobalSelectionList,
	setGlobalSelectionList,
} from "@/utils/selection-store";
import { getTrainStopsCount } from "@/utils/viaggiatreno";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	ActivityIndicator,
	Dimensions,
	FlatList,
	InteractionManager,
	Platform,
	Pressable,
	ScrollView,
	Switch,
	View,
} from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { RouteInfomobilityContent } from "@/components/train-details/route-infomobility-content";

const sortOptions = [
	"Orario di partenza",
	"Orario di arrivo",
	"Durata",
	"Prezzo",
];

// MOCK_SOLUTIONS removed in favor of live API

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DATE_ITEM_WIDTH = 80;

export default function SearchResultsScreen() {
	const params = useLocalSearchParams();
	const from = (params.from as string) || "";
	const to = (params.to as string) || "";
	const dateStr = params.dateStr as string;
	const passengerText = (params.passengerText as string) || "1 Adulto";

	const departureDate = dateStr ? new Date(dateStr) : new Date();

	const [showCalendar, setShowCalendar] = useState(false);
	const [showPassengersSheet, setShowPassengersSheet] = useState(false);
	const [activeCalendarTab, setActiveCalendarTab] = useState<
		"andata" | "ritorno"
	>("andata");
	const [hasReturn, setHasReturn] = useState(false);
	const [returnDate, setReturnDate] = useState(() => {
		const d = new Date(departureDate);
		d.setHours(d.getHours() + 1);
		return d;
	});
	const [passengersList, setPassengersList] = useState<SelectionItem[]>(() =>
		getGlobalSelectionList(),
	);

	useEffect(() => {
		setGlobalSelectionList(passengersList);
	}, [passengersList]);

	const insets = useSafeAreaInsets();
	const [showFilters, setShowFilters] = useState(false);
	const [activeTravelType, setActiveTravelType] = useState(
		(params.travelType as string) || "Principali Soluzioni",
	);
	const [noChanges, setNoChanges] = useState(params.noChanges === "true");
	const [bike, setBike] = useState(params.bike === "true");
	const [sortOrder, setSortOrder] = useState(
		(params.sortOrder as string) || "Orario di partenza",
	);
	const [pendingSortOrder, setPendingSortOrder] =
		useState("Orario di partenza");

	const [showTravelType, setShowTravelType] = useState(false);
	const travelTypeChevronRotation = useSharedValue(0);
	useEffect(() => {
		travelTypeChevronRotation.value = withTiming(showTravelType ? -180 : 0, {
			duration: 250,
		});
	}, [showTravelType]);

	const travelTypeChevronAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ rotate: `${travelTypeChevronRotation.value}deg` }],
		};
	});

	const [localFrom, setLocalFrom] = useState(from);
	const [localTo, setLocalTo] = useState(to);
	const [currentSelectedDate, setCurrentSelectedDate] = useState(departureDate);

	const route = { from: localFrom, to: localTo };

	const isToday =
		currentSelectedDate.getDate() === new Date().getDate() &&
		currentSelectedDate.getMonth() === new Date().getMonth() &&
		currentSelectedDate.getFullYear() === new Date().getFullYear();
	const [solutions, setSolutions] = useState<TravelSolution[]>([]);

	const animalCount = passengersList.filter(
		(item) => item.itemType === "service" && item.type === "Animale",
	).length;
	const bikeCount = passengersList.filter(
		(item) => item.itemType === "service" && item.type === "Bicicletta",
	).length;
	const hasBothServices = animalCount > 0 && bikeCount > 0;
	const extraServicesCost =
		passengersList.filter(
			(p) =>
				p.itemType === "service" &&
				(p.type === "Animale" || p.type === "Bicicletta"),
		).length * 5.0;
	const passengerCount = passengersList.filter(
		(p) => p.itemType === "passenger",
	).length;

	const adults = passengersList.filter((p) => p.type === "Adulto").length;
	const youths = passengersList.filter((p) => p.type === "Ragazzo").length;
	const children = passengersList.filter((p) => p.type === "Bambino").length;

	const dynamicPassengerText =
		`${adults > 0 ? `${adults} Adult${adults > 1 ? "i" : "o"}` : ""}${youths > 0 ? ` ${youths} Ragazz${youths > 1 ? "i" : "o"}` : ""}${children > 0 ? ` ${children} Bambin${children > 1 ? "i" : "i"}` : ""}`.trim() ||
		"1 Adulto";

	const dynamicPassengerNamesText = passengersList
		.filter((p) => p.itemType === "passenger")
		.map((p, idx) =>
			p.firstName || p.lastName
				? `${p.firstName || ""} ${p.lastName || ""}`.trim()
				: `Passeggero ${idx + 1}`,
		)
		.join(", ");
	const [isLoading, setIsLoading] = useState(true);
	const [isFetchingMore, setIsFetchingMore] = useState(false);
	const [isFetchingPrevious, setIsFetchingPrevious] = useState(false);
	const [hasFetchedPrevious, setHasFetchedPrevious] = useState(false);
	const allRoutesRef = useRef<any[]>([]);
	const dateScrollRef = useRef<FlatList>(null);

	const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
	const [selectedInfoTrains, setSelectedInfoTrains] = useState<any[] | null>(
		null,
	);

	const [bulkDelays, setBulkDelays] = useState<Record<string, string>>({});
	const latestCoveredDelayTimeRef = useRef<Record<string, Date>>({});
	const isFetchingBulkRef = useRef<Record<string, boolean>>({});

	useEffect(() => {
		if (!solutions || solutions.length === 0) return;

		let mounted = true;

		const calculateRegionalPrices = async () => {
			const targetSols = solutions.filter((sol) => {
				if (sol.price <= 0 || sol.trains.length <= 1) return false;
				const isOnlyRegional = sol.trains.every(
					(t: any) =>
						t.type.toLowerCase().includes("regionale") ||
						t.type.toLowerCase().includes("reg"),
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
						sol.trains.map((t: any) =>
							getTrainStopsCount(t.number, t.origin, t.destination),
						),
					);
					if (!mounted) break;

					const totalStops: number = stopsCounts.reduce(
						(acc: number, curr) => acc + (curr || 1),
						0,
					);

					setSolutions((prev) =>
						prev.map((p) => {
							if (p.id === sol.id) {
								let remainingPrice = p.price;
								return {
									...p,
									trains: p.trains.map((t: any, idx: number) => {
										if (idx === p.trains.length - 1) {
											return {
												...t,
												calculatedPrice: Number(remainingPrice.toFixed(2)),
											};
										}
										const exactPrice =
											(p.price / totalStops) * (stopsCounts[idx] || 1);
										const roundedPrice = Math.round(exactPrice / 0.05) * 0.05;
										remainingPrice -= roundedPrice;
										return {
											...t,
											calculatedPrice: Number(roundedPrice.toFixed(2)),
										};
									}),
								};
							}
							return p;
						}),
					);
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

	useEffect(() => {
		if (solutions.length === 0) return;

		// Group solutions by origin station to find the max departure time needed per origin
		const originMaxTimes: Record<string, Date> = {};
		const originFirstTimes: Record<string, Date> = {};

		for (const sol of solutions) {
			const origin = sol.trains[0]?.origin;
			const timeStr = sol.trains[0]?.departureTime;
			if (origin && timeStr) {
				const [h, m] = timeStr.split(":");
				if (h && m) {
					const solDate = new Date(currentSelectedDate);
					solDate.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);

					if (!originMaxTimes[origin] || solDate > originMaxTimes[origin]) {
						originMaxTimes[origin] = solDate;
					}
					if (!originFirstTimes[origin] || solDate < originFirstTimes[origin]) {
						originFirstTimes[origin] = solDate;
					}
				}
			}
		}

		// For each unique origin, check if we need to fetch the next bulk chunk
		for (const origin of Object.keys(originMaxTimes)) {
			if (isFetchingBulkRef.current[origin]) continue;

			const maxNeededTime = originMaxTimes[origin];
			const coveredTime = latestCoveredDelayTimeRef.current[origin];

			if (!coveredTime || maxNeededTime >= coveredTime) {
				const fetchNextBulkForOrigin = async () => {
					isFetchingBulkRef.current[origin] = true;

					let fetchDate = new Date(currentSelectedDate);
					if (!coveredTime) {
						fetchDate = originFirstTimes[origin];
					} else {
						fetchDate = new Date(coveredTime.getTime() + 60000);
					}

					const { delays, lastTrainTime } = await getBulkStationDelays(
						origin,
						fetchDate,
					);

					setBulkDelays((prev) => ({ ...prev, ...delays }));

					if (lastTrainTime) {
						latestCoveredDelayTimeRef.current[origin] = lastTrainTime;
					} else {
						// Fallback to avoid infinite loops on failure
						latestCoveredDelayTimeRef.current[origin] = new Date(
							fetchDate.getTime() + 3600000,
						);
					}

					isFetchingBulkRef.current[origin] = false;
				};
				fetchNextBulkForOrigin();
			}
		}
	}, [solutions, currentSelectedDate, bulkDelays]);

	const handleOpenInfomobilita = (trains: TravelSolution["trains"]) => {
		setSelectedInfoTrains(trains);
		setIsInfoModalVisible(true);
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
				return routeDate.toDateString() === targetDateStr && r.saleable;
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
					offerName: formatOfferName(r.tk?.[0]?.sf || "Ordinaria"),
					serviceClass: formatClassName(
						r.tk?.[0]?.sc || r.tk?.[0]?.c?.[0] || "Standard",
					),
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
			latestCoveredDelayTimeRef.current = {};
			isFetchingBulkRef.current = {};
			setBulkDelays({});

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
	}, [currentSelectedDate, localFrom, localTo, mapRoutesToSolutions]);

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

	const parseTimeToMinutes = (time: string) => {
		const [hours, minutes] = time.split(":").map((part) => parseInt(part, 10));
		if (Number.isNaN(hours) || Number.isNaN(minutes)) {
			return Number.POSITIVE_INFINITY;
		}
		return hours * 60 + minutes;
	};

	useEffect(() => {
		if (showFilters) {
			setPendingSortOrder(sortOrder);
		}
	}, [showFilters, sortOrder]);

	filteredSolutions.forEach((s) => {
		if (s.price > 0) {
			if (s.price < minPrice) minPrice = s.price;
			if (s.duration) {
				const d = parseDuration(s.duration);
				if (d > 0 && d < minDuration) minDuration = d;
			}
		}
	});

	const sortedSolutions = [...filteredSolutions].sort((a, b) => {
		if (sortOrder === "Orario di partenza") {
			return (
				parseTimeToMinutes(a.departureTime) -
				parseTimeToMinutes(b.departureTime)
			);
		}
		if (sortOrder === "Orario di arrivo") {
			const getEffectiveArrival = (arr: string, dep: string) => {
				const arrMins = parseTimeToMinutes(arr);
				const depMins = parseTimeToMinutes(dep);
				return arrMins < depMins ? arrMins + 1440 : arrMins;
			};
			return (
				getEffectiveArrival(a.arrivalTime, a.departureTime) -
				getEffectiveArrival(b.arrivalTime, b.departureTime)
			);
		}
		if (sortOrder === "Durata") {
			return parseDuration(a.duration) - parseDuration(b.duration);
		}
		if (sortOrder === "Prezzo") {
			return a.price - b.price;
		}
		return 0;
	});

	return (
		<View className="flex-1 bg-white">
			{/* Header & Green Panel */}
			<PageHeader
				title="Andata"
				showBackButton={true}
				showShareButton={false}
			>

				{/* Stations Card */}
				<View className="px-5">
					<View className="bg-white/10 rounded-2xl px-4 mt-1 flex-row items-center h-[56px]">
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
				</View>

				{/* Info Row */}
				<View className="flex-row gap-2 mt-3 px-5">
					<View className="flex-1 flex-row gap-2">
						<Pressable
							onPress={() => {
								setActiveCalendarTab("andata");
								setShowCalendar(true);
							}}
							className="bg-white/10 rounded-2xl px-3.5 h-[56px] justify-center active:opacity-70"
							style={{ flex: 11 }}
						>
							<View className="flex-row items-center gap-2">
								<Icon
									name="calendar_today"
									size={18}
									className="!text-white"
									weight={500}
									style={{ marginTop: -2 }}
								/>
								<ThemedText
									className="text-[15px] font-google-sans-bold !text-white"
									numberOfLines={1}
									adjustsFontSizeToFit
								>
									{formatDisplayDate(currentSelectedDate)}
								</ThemedText>
							</View>
						</Pressable>
						<Pressable
							onPress={() => setShowPassengersSheet(true)}
							className="bg-white/10 rounded-2xl px-3.5 h-[56px] justify-center active:opacity-70"
							style={{ flex: 9 }}
						>
							<View
								className={`flex-row items-center ${
									hasBothServices ? "justify-between" : "justify-start gap-3"
								}`}
							>
								<View className="flex-row items-center gap-1">
									<Icon
										name="person"
										size={18}
										className="!text-white"
										weight={500}
										style={{ marginTop: -2 }}
									/>
									<ThemedText
										className="text-[15px] font-google-sans-bold !text-white shrink"
										numberOfLines={1}
										adjustsFontSizeToFit
									>
										{animalCount === 0 && bikeCount === 0
											? dynamicPassengerText.toLowerCase()
											: passengerCount}
									</ThemedText>
								</View>
								{animalCount > 0 && (
									<View className="flex-row items-center gap-1">
										<Icon
											name="pet_supplies"
											size={16}
											className="!text-white"
											weight={500}
											style={{ marginTop: -2 }}
										/>
										<ThemedText className="text-[15px] font-google-sans-bold !text-white">
											{animalCount}
										</ThemedText>
									</View>
								)}
								{bikeCount > 0 && (
									<View className="flex-row items-center gap-1">
										<Icon
											name="pedal_bike"
											size={16}
											className="!text-white"
											weight={500}
											style={{ marginTop: -2 }}
										/>
										<ThemedText className="text-[15px] font-google-sans-bold !text-white">
											{bikeCount}
										</ThemedText>
									</View>
								)}
							</View>
						</Pressable>
					</View>

					<Pressable
						onPress={() => setShowFilters(true)}
						className="w-[56px] h-[56px] rounded-2xl bg-white/10 items-center justify-center shrink-0"
					>
						<Icon
							name="page_info"
							size={22}
							className="!text-white"
							weight={500}
							style={{ marginTop: 1 }}
						/>
					</Pressable>
				</View>

				{/* Date Selector Strip */}
				<View className="mt-4">
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
			</PageHeader>

			{/* Results List */}
			<ScrollView className="flex-1 bg-neutral-50">
				<View className="p-4 gap-4 pb-32">
					{/* Previous Solutions Button */}
					{!hasFetchedPrevious && (
						<Pressable
							onPress={handleFetchPrevious}
							disabled={isFetchingPrevious || isLoading}
							className="h-12 w-full items-center justify-center rounded-2xl border border-neutral-200 bg-white mb-1"
						>
							<ThemedText className="text-[15px] font-google-sans-bold !text-neutral-800">
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
							{sortedSolutions.map((solution, index) => (
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
									bulkDelay={
										solution.trains.length > 0
											? bulkDelays[solution.trains[0].number]
											: undefined
									}
									isCheapest={solution.price > 0 && solution.price === minPrice}
									isFastest={
										solution.price > 0 &&
										!!solution.duration &&
										parseDuration(solution.duration) === minDuration
									}
									onPressInfo={() => handleOpenInfomobilita(solution.trains)}
									onTopPress={() => handleOpenInfomobilita(solution.trains)}
									onPress={() => {
										if (!solution.price) return;
										setSelectedSolutionCache({
											...solution,
											delay:
												solution.trains.length > 0
													? bulkDelays[solution.trains[0].number]
													: undefined,
											trains: solution.trains.map((t: any) => ({
												...t,
												delay: bulkDelays[t.number],
											})),
										});
										router.push({
											pathname: "/select-offer",
											params: {
												routeStr: `${route.from} - ${route.to}`,
												dateStr: currentSelectedDate.toISOString(),
												passengerText: dynamicPassengerText,
												passengerNamesText: dynamicPassengerNamesText,
											},
										});
									}}
								/>
							))}
							{sortedSolutions.length === 0 && !isFetchingMore && (
								<View className="items-center py-10">
									<ThemedText className="text-neutral-500 font-google-sans-medium">
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

			{/* Filters Bottom Sheet */}
			<BottomSheet
				isVisible={showFilters}
				onClose={() => {
					setShowFilters(false);
					setShowTravelType(false);
				}}
				title="Filtri"
			>
				<View className="gap-6">
					<View className="relative overflow-visible gap-0">
						<Pressable
							onPress={() => setShowTravelType(!showTravelType)}
							className="min-h-[50px] flex-row items-center justify-between py-1.5 relative"
						>
							<ThemedText className="text-[15px] font-google-sans-medium !text-neutral-950">
								Soluzioni
							</ThemedText>
							<View className="flex-row items-center gap-1">
								<ThemedText className="text-[15px] font-google-sans-medium !text-neutral-950">
									{activeTravelType}
								</ThemedText>
								<Animated.View style={travelTypeChevronAnimatedStyle}>
									<Icon
										name="expand_more"
										size={20}
										className="!text-neutral-950 -mb-0.5"
									/>
								</Animated.View>
							</View>
						</Pressable>

						<DropdownMenu
							isVisible={showTravelType}
							className="top-[42px] right-0"
							style={{ zIndex: 999, width: 180 }}
						>
							<View className="py-2">
								{["Tutte", "Frecce", "Intercity", "Regionali"].map((type) => (
									<Pressable
										key={type}
										onPress={() => {
											setActiveTravelType(type);
											setShowTravelType(false);
										}}
										className="flex-row items-center justify-between px-4 py-2"
									>
										<ThemedText
											className={`text-[15px] ${activeTravelType === type ? "font-google-sans-semibold !text-neutral-950" : "font-google-sans-regular !text-neutral-500"}`}
										>
											{type}
										</ThemedText>
										<Icon
											name="check"
											size={20}
											className={`!text-primary-500 ${activeTravelType === type ? "opacity-100" : "opacity-0"}`}
										/>
									</Pressable>
								))}
							</View>
						</DropdownMenu>

						<View className="flex-row items-center justify-between py-0.5">
							<ThemedText className="text-[15px] font-google-sans-medium !text-neutral-950">
								Soluzioni senza cambi
							</ThemedText>
							<View
								className={
									Platform.OS === "ios" ? "bg-neutral-200 rounded-full" : ""
								}
							>
								<Switch
									value={noChanges}
									onValueChange={setNoChanges}
									trackColor={{ false: "#e5e7eb", true: "#006666" }}
									thumbColor={"#ffffff"}
								/>
							</View>
						</View>
					</View>

					<View className="gap-4 pt-2">
						<ThemedText className="text-[16px] font-google-sans-bold !text-primary-500">
							Ordina per
						</ThemedText>
						<View className="gap-1 pl-3">
							{sortOptions.map((sort) => (
								<Pressable
									key={sort}
									onPress={() => setPendingSortOrder(sort)}
									className="flex-row items-center justify-between py-2"
								>
									<ThemedText
										className={`text-[15px] ${pendingSortOrder === sort ? "font-google-sans-semibold !text-neutral-950" : "font-google-sans-regular !text-neutral-500"}`}
									>
										{sort}
									</ThemedText>
									<View
										className={`h-6 w-6 rounded-full border-2 items-center justify-center ${
											pendingSortOrder === sort
												? "border-primary-600"
												: "border-neutral-200"
										}`}
									>
										{pendingSortOrder === sort && (
											<View className="h-3 w-3 rounded-full bg-primary-600" />
										)}
									</View>
								</Pressable>
							))}
						</View>
					</View>
				</View>
				<View className="pt-8">
					<MainButton
						title="Applica"
						onPress={() => {
							setSortOrder(pendingSortOrder);
							setShowFilters(false);
						}}
					/>
				</View>
			</BottomSheet>

			{/* Infomobilità Percorso Modal */}
			<BottomSheet
				isVisible={isInfoModalVisible}
				onClose={() => {
					setIsInfoModalVisible(false);
					setSelectedInfoTrains(null);
				}}
				title="Infomobilità Percorso"
			>
				{selectedInfoTrains && (
					<View className="mt-2 -mx-5 px-5">
						<RouteInfomobilityContent
							solutionTrains={selectedInfoTrains}
							isTodayOverride={isToday}
						/>
					</View>
				)}
			</BottomSheet>

			<CalendarPanel
				isVisible={showCalendar}
				onClose={() => setShowCalendar(false)}
				departureDate={currentSelectedDate}
				setDepartureDate={setCurrentSelectedDate}
				returnDate={returnDate}
				setReturnDate={setReturnDate}
				hasReturn={hasReturn}
				setHasReturn={setHasReturn}
				initialTab={activeCalendarTab}
			/>

			<PassengersPanel
				isVisible={showPassengersSheet}
				onClose={() => setShowPassengersSheet(false)}
				passengersList={passengersList}
				setPassengersList={setPassengersList}
			/>
		</View>
	);
}
