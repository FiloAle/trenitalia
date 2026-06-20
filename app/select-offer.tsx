import { selectedSolutionCache } from "@/api/search";
import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { formatClassName, formatOfferName } from "@/utils/format";
import { getGlobalSelectionList } from "@/utils/selection-store";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import Animated, {
	FadeIn,
	FadeOut,
	LinearTransition,
	withTiming,
} from "react-native-reanimated";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const customEntering = () => {
	"worklet";
	return {
		initialValues: {
			opacity: 0,
			transform: [{ translateY: -10 }, { scale: 0.95 }],
		},
		animations: {
			opacity: withTiming(1, { duration: 200 }),
			transform: [
				{ translateY: withTiming(0, { duration: 200 }) },
				{ scale: withTiming(1, { duration: 200 }) },
			],
		},
	};
};

const customExiting = () => {
	"worklet";
	return {
		initialValues: {
			opacity: 1,
			transform: [{ translateY: 0 }, { scale: 1 }],
		},
		animations: {
			opacity: withTiming(0, { duration: 200 }),
			transform: [
				{ translateY: withTiming(-10, { duration: 200 }) },
				{ scale: withTiming(0.95, { duration: 200 }) },
			],
		},
	};
};

import { TravelSolutionCard } from "@/components/search/travel-solution-card";
import { StickyFooter } from "@/components/select-offer/sticky-footer";
import { PageHeader } from "@/components/ui/page-header";

const LOGOS: Record<string, { source: any; ratio: number }> = {
	Frecciarossa: { source: require("@/assets/logos/small/f.png"), ratio: 1.4 },
	Frecciargento: { source: require("@/assets/logos/small/f.png"), ratio: 1.4 },
	Frecciabianca: { source: require("@/assets/logos/small/f.png"), ratio: 1.4 },
	FrRossa: { source: require("@/assets/logos/small/f.png"), ratio: 1.4 },
	FrArgento: { source: require("@/assets/logos/small/f.png"), ratio: 1.4 },
	FrBianca: { source: require("@/assets/logos/small/f.png"), ratio: 1.4 },

	Intercity: { source: require("@/assets/logos/small/ic.png"), ratio: 0.89 },
	InterCity: { source: require("@/assets/logos/small/ic.png"), ratio: 0.89 },
	IntercityNotte: {
		source: require("@/assets/logos/small/ic.png"),
		ratio: 0.89,
	},
	ICNotte: { source: require("@/assets/logos/small/ic.png"), ratio: 0.89 },
	ICnotte: { source: require("@/assets/logos/small/ic.png"), ratio: 0.89 },
	Ni: { source: require("@/assets/logos/small/ic.png"), ratio: 0.89 },
	Ic: { source: require("@/assets/logos/small/ic.png"), ratio: 0.89 },

	Regionale: { source: require("@/assets/logos/small/r.png"), ratio: 2.03 },
	Regv: { source: require("@/assets/logos/small/r.png"), ratio: 2.03 },
	RegV: { source: require("@/assets/logos/small/r.png"), ratio: 2.03 },
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

const CLASS_ICONS: Record<string, string[]> = {
	STANDARD: ["power", "wifi"],
	PREMIUM: ["airline_seat_recline_extra", "takeout_dining_2", "power", "wifi"],
	BUSINESS: [
		"scene",
		"airline_seat_recline_extra",
		"takeout_dining_2",
		"power",
		"wifi",
	],
	"BUSINESS AREA SILENZIO": [
		"scene",
		"airline_seat_recline_extra",
		"takeout_dining_2",
		"power",
		"wifi",
	],
	EXECUTIVE: [
		"scene",
		"airline_seat_recline_extra",
		"dinner_dining",
		"power",
		"wifi",
	],
};

export default function SelectOfferScreen() {
	const insets = useSafeAreaInsets();
	const params = useLocalSearchParams();
	const passengerText = (params.passengerText as string) || "1 Adulto";
	const passengerNamesText =
		(params.passengerNamesText as string) || passengerText;

	const adultsMatch = passengerText.match(/(\d+)\s+Adult/i);
	const adults = adultsMatch ? parseInt(adultsMatch[1], 10) : 0;
	const youthsMatch = passengerText.match(/(\d+)\s+Ragazz/i);
	const youths = youthsMatch ? parseInt(youthsMatch[1], 10) : 0;
	const passengerCount = Math.max(1, adults + youths);

	const solution = selectedSolutionCache;
	const routeStr =
		(params.routeStr as string) || "Roma Termini - Napoli Centrale";
	const [origin, destination] = routeStr.split(" - ");

	const dateStr = params.dateStr as string;
	const departureDate = dateStr ? new Date(dateStr) : new Date();
	const ddMMyyyy = `${String(departureDate.getDate()).padStart(2, "0")}/${String(departureDate.getMonth() + 1).padStart(2, "0")}/${departureDate.getFullYear()}`;

	const trains = solution?.trains || [];
	const segments = trains.map((t: any) => ({
		...t,
		originalPrice: t.price,
		origin: t.origin || origin,
		destination: t.destination || destination,
		timeStr:
			t.departureTime && t.arrivalTime
				? `${t.departureTime} - ${t.arrivalTime}`
				: `${solution?.departureTime || "00:00"} - ${solution?.arrivalTime || "00:00"}`,
	}));

	const calculateDuration = (start: string, end: string) => {
		const [sh, sm] = start.split(":").map(Number);
		const [eh, em] = end.split(":").map(Number);
		let diff = eh * 60 + em - (sh * 60 + sm);
		if (diff < 0) diff += 24 * 60;
		const h = Math.floor(diff / 60);
		const m = diff % 60;
		return `${h > 0 ? `${h}h ` : ""}${m > 0 ? `${m}min` : ""}`.trim();
	};

	// Date formatting
	const day = departureDate.getDate().toString().padStart(2, "0");
	const month = departureDate
		.toLocaleString("it-IT", { month: "short" })
		.replace(".", "");
	const formattedDate = `${day} ${month.charAt(0).toUpperCase() + month.slice(1)}`;

	const tickets = solution?.tickets || [];

	const getRealClasses = (segmentIndex: number) => {
		if (!tickets || tickets.length === 0) {
			return [{ id: "c1", name: "Standard" }];
		}
		const uniqueClasses = new Set<string>();
		tickets.forEach((t: any) => {
			if (!t) return;
			if (t.i && Array.isArray(t.i) && !t.i.includes(segmentIndex)) return;
			if (t.c) {
				t.c.forEach((className: string) => uniqueClasses.add(className));
			}
		});

		const classesList = Array.from(uniqueClasses).map((name) => ({
			id: name,
			name: formatClassName(name, Infinity) || "STANDARD",
		}));
		return classesList.length > 0
			? classesList
			: [{ id: "c1", name: "Standard" }];
	};

	const getRealOffers = (segmentIndex: number, selectedClassName: string) => {
		if (!tickets || tickets.length === 0) {
			return [{ id: "o1", name: "ORDINARIA", badge: "" }];
		}
		const uniqueOffers = new Set<string>();
		tickets.forEach((t: any) => {
			if (!t) return;
			if (t.i && Array.isArray(t.i) && !t.i.includes(segmentIndex)) return;

			const classIndex = t.c?.indexOf(selectedClassName);
			if (
				classIndex !== undefined &&
				classIndex >= 0 &&
				t.p &&
				t.p[classIndex]
			) {
				if (t.f && Array.isArray(t.f)) {
					t.f.forEach((fName: string, offerIndex: number) => {
						const priceStr = t.p[classIndex][offerIndex];
						if (priceStr && typeof priceStr === "string") {
							const parsedPrice = parseFloat(priceStr.replace(",", "."));
							if (!isNaN(parsedPrice) && parsedPrice > 0) {
								uniqueOffers.add(fName);
							}
						}
					});
				} else if (t.sf) {
					const priceStr = t.p[classIndex][0];
					if (priceStr && typeof priceStr === "string") {
						const parsedPrice = parseFloat(priceStr.replace(",", "."));
						if (!isNaN(parsedPrice) && parsedPrice > 0) {
							uniqueOffers.add(t.sf);
						}
					}
				}
			}
		});

		const offersList = Array.from(uniqueOffers).map((rawName) => {
			return {
				id: rawName,
				name: formatOfferName(rawName),
				badge:
					rawName.includes("SUPER") ||
					rawName.includes("S.ECONOMY") ||
					rawName.includes("SPECIALE")
						? "Non modificabile"
						: rawName.includes("BASE") || rawName.includes("ECONOMY")
							? "Modificabile"
							: "",
			};
		});
		return offersList.length > 0
			? offersList
			: [{ id: "o1", name: "ORDINARIA", badge: "" }];
	};

	const getMinPriceForClass = (sIdx: number, className: string) => {
		if (!tickets || tickets.length === 0) return 0;
		let minPrice = Infinity;
		for (const t of tickets) {
			if (!t) continue;
			if (t.i && Array.isArray(t.i) && t.i.includes(sIdx)) {
				if (t.i[0] !== sIdx) return 0;
				const classIndex = t.c?.indexOf(className);
				if (
					classIndex !== undefined &&
					classIndex >= 0 &&
					t.p &&
					t.p[classIndex]
				) {
					t.p[classIndex].forEach((priceStr: string) => {
						if (priceStr && typeof priceStr === "string") {
							const val = parseFloat(priceStr.replace(",", "."));
							if (!isNaN(val) && val < minPrice) {
								minPrice = val;
							}
						}
					});
				}
			}
		}
		return minPrice === Infinity ? 0 : minPrice;
	};

	const getPriceForSegment = (
		sIdx: number,
		className: string,
		offerName: string,
	) => {
		if (!tickets || tickets.length === 0) return 0;
		for (const t of tickets) {
			if (!t) continue;
			if (t.i && Array.isArray(t.i) && t.i.includes(sIdx)) {
				// Handle unified tickets (multiple segments)
				if (t.i.length > 1) {
					const trainData = selectedSolutionCache?.trains?.[sIdx];
					if (trainData?.calculatedPrice !== undefined) {
						return trainData.calculatedPrice;
					}
					// Fallback: equal split
					const classIndex = t.c?.indexOf(className);
					let totalPrice = 0;
					if (
						classIndex !== undefined &&
						classIndex >= 0 &&
						t.p &&
						t.p[classIndex]
					) {
						if (t.f && Array.isArray(t.f)) {
							const offerIndex = t.f.indexOf(offerName);
							if (offerIndex >= 0) {
								const priceStr = t.p[classIndex][offerIndex];
								if (priceStr)
									totalPrice = parseFloat(priceStr.replace(",", "."));
							}
						} else if (t.sf === offerName) {
							const priceStr = t.p[classIndex][0];
							if (priceStr) totalPrice = parseFloat(priceStr.replace(",", "."));
						}
					}
					return isNaN(totalPrice) ? 0 : totalPrice / t.i.length;
				}

				if (t.i[0] !== sIdx) return 0;
				const classIndex = t.c?.indexOf(className);
				if (
					classIndex !== undefined &&
					classIndex >= 0 &&
					t.p &&
					t.p[classIndex]
				) {
					if (t.f && Array.isArray(t.f)) {
						const offerIndex = t.f.indexOf(offerName);
						if (offerIndex >= 0) {
							const priceStr = t.p[classIndex][offerIndex];
							if (priceStr) {
								const val = parseFloat(priceStr.replace(",", "."));
								if (!isNaN(val)) return val;
							}
						}
					} else if (t.sf === offerName) {
						const priceStr = t.p[classIndex][0];
						if (priceStr) {
							const val = parseFloat(priceStr.replace(",", "."));
							if (!isNaN(val)) return val;
						}
					}
				}
			}
		}
		return 0;
	};

	const getPriceForSelection = (
		classes: Record<number, string>,
		offers: Record<number, string>,
	) => {
		if (!tickets || tickets.length === 0) return basePrice;

		let total = 0;
		const processedGroups = new Set<string>();

		for (const t of tickets) {
			if (!t || !t.i || !Array.isArray(t.i)) continue;

			const groupKey = t.i.join(",");
			if (processedGroups.has(groupKey)) continue;

			const sIdx = t.i[0];
			const selectedClass = classes[sIdx];
			const selectedOffer = offers[sIdx];

			const classIndex = t.c?.indexOf(selectedClass);
			if (
				classIndex !== undefined &&
				classIndex >= 0 &&
				t.p &&
				t.p[classIndex]
			) {
				let priceStr: string | undefined;

				if (t.f && Array.isArray(t.f)) {
					const offerIndex = t.f.indexOf(selectedOffer);
					if (offerIndex >= 0) {
						priceStr = t.p[classIndex][offerIndex];
					}
				} else if (t.sf === selectedOffer) {
					priceStr = t.p[classIndex][0];
				}

				if (priceStr) {
					const val = parseFloat(priceStr.replace(",", "."));
					if (!isNaN(val)) {
						total += val;
						processedGroups.add(groupKey);
					}
				}
			}
		}

		return total > 0 ? total : basePrice;
	};

	// Initialize state
	const initialClasses: Record<number, string> = {};
	const initialOffers: Record<number, string> = {};
	segments.forEach((segment: any, idx: number) => {
		const rClasses = getRealClasses(idx);
		if (rClasses.length > 0) {
			let minClassPrice = Infinity;
			let bestClass = rClasses[0].id;
			for (const c of rClasses) {
				const price = getMinPriceForClass(idx, c.id);
				if (price > 0 && price < minClassPrice) {
					minClassPrice = price;
					bestClass = c.id;
				}
			}
			initialClasses[idx] =
				minClassPrice === Infinity ? rClasses[0].id : bestClass;
		} else {
			initialClasses[idx] = "Standard";
		}

		const rOffers = getRealOffers(idx, initialClasses[idx]);
		if (rOffers.length > 0) {
			let minOfferPrice = Infinity;
			let bestOffer = rOffers[0].id;
			for (const o of rOffers) {
				const price = getPriceForSegment(idx, initialClasses[idx], o.id);
				if (price > 0 && price < minOfferPrice) {
					minOfferPrice = price;
					bestOffer = o.id;
				}
			}
			initialOffers[idx] =
				minOfferPrice === Infinity ? rOffers[0].id : bestOffer;
		} else {
			initialOffers[idx] = "ORDINARIA";
		}
	});

	// State for selections
	const [selectedClasses, setSelectedClasses] =
		useState<Record<number, string>>(initialClasses);
	const [selectedOffers, setSelectedOffers] =
		useState<Record<number, string>>(initialOffers);
	const [expandedSegments, setExpandedSegments] = useState<
		Record<number, boolean>
	>({});
	const [openAccordions, setOpenAccordions] = useState<Record<number, boolean>>(
		{},
	);

	const toggleSegment = (idx: number) => {
		setExpandedSegments((prev) => ({
			...prev,
			[idx]: prev[idx] === undefined ? false : !prev[idx],
		}));
	};

	const basePrice = solution?.price || 15.0;
	const extraServicesCost =
		getGlobalSelectionList().filter(
			(p) =>
				p.itemType === "service" &&
				(p.type === "Animale" || p.type === "Bicicletta"),
		).length * 5.0;

	return (
		<View className="flex-1 bg-white">
			<PageHeader title="Andata" showBackButton={true} />

			<ScrollView
				className="flex-1 bg-neutral-50 px-4 pt-4"
				contentContainerStyle={{ paddingBottom: 180 }}
			>
				{segments.map((segment: any, sIdx: number) => {
					const normalizedType = segment.type.trim().toLowerCase();
					const logoKey = Object.keys(LOGOS).find(
						(k) => k.toLowerCase() === normalizedType,
					);
					const logoData = logoKey ? LOGOS[logoKey] : undefined;
					const realClasses = getRealClasses(sIdx);
					const currentSelectedClass = selectedClasses[sIdx] || "Standard";
					const realOffers = getRealOffers(sIdx, currentSelectedClass);
					const isExpanded = expandedSegments[sIdx] === true;

					const selectedOfferObj = realOffers.find(
						(o) => o.id === selectedOffers[sIdx],
					);
					const displayOfferName = selectedOfferObj
						? selectedOfferObj.name
						: selectedOffers[sIdx];

					return (
						<Animated.View
							key={sIdx}
							className="bg-transparent mb-4"
							layout={Platform.OS === "web" ? undefined : LinearTransition}
						>
							<View style={{ zIndex: 10, elevation: 10 }}>
								<TravelSolutionCard
									solution={{
										id: `seg-${sIdx}`,
										departureTime:
											segment.departureTime ||
											solution?.departureTime ||
											"00:00",
										arrivalTime:
											segment.arrivalTime || solution?.arrivalTime || "00:00",
										duration: calculateDuration(
											segment.departureTime ||
												solution?.departureTime ||
												"00:00",
											segment.arrivalTime || solution?.arrivalTime || "00:00",
										),
										trains: [segment],
										price:
											getPriceForSegment(
												sIdx,
												currentSelectedClass,
												selectedOffers[sIdx],
											) * passengerCount,
										serviceClass: currentSelectedClass,
										offerName: displayOfferName,
										delay: segment.delay || solution?.delay,
									}}
									route={{ from: segment.origin, to: segment.destination }}
									searchDate={departureDate}
									isSelectOfferMode={true}
									selectOfferModeProps={{
										dateStr: calculateDuration(
											segment.departureTime ||
												solution?.departureTime ||
												"00:00",
											segment.arrivalTime || solution?.arrivalTime || "00:00",
										),
										isExpanded,
										passengerName: ddMMyyyy,
									}}
									onPress={() => toggleSegment(sIdx)}
								/>
							</View>

							<Animated.View
								style={{
									zIndex: 1,
									elevation: 1,
									marginTop: -16,
									overflow: "hidden",
								}}
								className="bg-white rounded-b-2xl border-x border-b border-neutral-200"
								layout={Platform.OS === "web" ? undefined : LinearTransition}
							>
								<View style={{ height: 16 }} />
								{isExpanded && (
									<Animated.View
										entering={Platform.OS === "web" ? undefined : FadeIn.duration(200)}
										exiting={Platform.OS === "web" ? undefined : FadeOut.duration(200)}
									>
										<View className="pb-2 pt-2">
											{realClasses.map((c, cIdx) => {
												const classOffers = getRealOffers(sIdx, c.id)
													.filter(
														(a) => getPriceForSegment(sIdx, c.id, a.id) > 0,
													)
													.sort((a, b) => {
														const priceA = getPriceForSegment(sIdx, c.id, a.id);
														const priceB = getPriceForSegment(sIdx, c.id, b.id);
														return priceA - priceB;
													});

												if (classOffers.length === 0) return null;

												const isLastClass = cIdx === realClasses.length - 1;

												return (
													<View key={`class-${c.id}`}>
														{/* Class Header */}
														<View className="flex-row items-center justify-between px-4 pt-1 pb-1">
															<ThemedText
																className={`text-[14px] font-google-sans-bold ${selectedClasses[sIdx] === c.id ? "text-neutral-800" : "text-neutral-500"}`}
															>
																{formatClassName(c.name, Infinity)}
															</ThemedText>
															{CLASS_ICONS[c.name.toUpperCase()] && (
																<View className="flex-row items-center gap-1.5">
																	{CLASS_ICONS[c.name.toUpperCase()].map(
																		(iconName, idx) => (
																			<Icon
																				key={idx}
																				name={iconName}
																				size={16}
																				className="!text-primary-500"
																			/>
																		),
																	)}
																</View>
															)}
														</View>

														{/* Offers List */}
														{classOffers.map((o, oIdx) => {
															const isLastOffer =
																oIdx === classOffers.length - 1;
															const isSelected =
																selectedClasses[sIdx] === c.id &&
																selectedOffers[sIdx] === o.id;
															const offerPrice = getPriceForSegment(
																sIdx,
																c.id,
																o.id,
															);

															return (
																<Pressable
																	key={`offer-${o.id}`}
																	onPress={() => {
																		setSelectedClasses((prev) => ({
																			...prev,
																			[sIdx]: c.id,
																		}));
																		setSelectedOffers((prev) => ({
																			...prev,
																			[sIdx]: o.id,
																		}));
																		setExpandedSegments((prev) => ({
																			...prev,
																			[sIdx]: false,
																		}));
																	}}
																	className={`flex-row items-center justify-between pr-4 pl-10 py-2 ${isSelected ? "bg-primary-500/5" : "active:bg-neutral-50"}`}
																>
																	<View className="flex-row items-center flex-1 relative">
																		{isSelected && (
																			<View className="absolute -left-6">
																				<Icon
																					name="check"
																					size={18}
																					className="!text-primary-500"
																				/>
																			</View>
																		)}
																		<ThemedText
																			className={`text-[15px] ${isSelected ? "font-google-sans-bold !text-primary-500" : "font-google-sans-regular !text-neutral-900"}`}
																		>
																			{o.name}
																		</ThemedText>
																	</View>
																	<ThemedText
																		className={`text-[15px] ${isSelected ? "font-google-sans-bold !text-primary-500" : "font-google-sans-regular !text-neutral-900"}`}
																	>
																		€ {offerPrice.toFixed(2).replace(".", ",")}
																	</ThemedText>
																</Pressable>
															);
														})}

														{/* Optional spacing between classes */}
														{!isLastClass && <View className="h-4" />}
													</View>
												);
											})}
										</View>
									</Animated.View>
								)}
							</Animated.View>
						</Animated.View>
					);
				})}
			</ScrollView>

			<StickyFooter
				totalPrice={
					getPriceForSelection(selectedClasses, selectedOffers) * passengerCount
				}
				basePrice={basePrice}
				buttonClassName="w-[160px]"
				onPress={() => {
					const finalPrice =
						getPriceForSelection(selectedClasses, selectedOffers) *
						passengerCount;

					if (selectedSolutionCache) {
						selectedSolutionCache.price = finalPrice;
						selectedSolutionCache.trains = selectedSolutionCache.trains.map(
							(train: any, idx: number) => {
								const cName = selectedClasses[idx] || "Standard";
								const oName = selectedOffers[idx] || "Super Economy";

								const realOffers = getRealOffers(idx, cName);
								const selectedOfferObj = realOffers.find((o) => o.id === oName);
								const displayOfferName = selectedOfferObj
									? selectedOfferObj.name
									: oName;

								return {
									...train,
									selectedClass: cName,
									selectedOffer: displayOfferName,
									price: getPriceForSegment(idx, cName, oName) * passengerCount,
								};
							},
						);
					}

					router.push({
						pathname: "/passenger-data" as any,
						params: {
							...params,
							totalPrice: finalPrice,
							basePrice: basePrice,
						},
					});
				}}
			/>
		</View>
	);
}
