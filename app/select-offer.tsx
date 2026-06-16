import { selectedSolutionCache } from "@/api/search";
import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import Animated, {
	FadeIn,
	FadeOut,
	LinearTransition,
	withTiming,
} from "react-native-reanimated";
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

import { CheckoutHeader } from "@/components/checkout-header";
import { SegmentHeader } from "@/components/select-offer/segment-header";
import { StickyFooter } from "@/components/select-offer/sticky-footer";

const LOGOS: Record<string, any> = {
	Frecciarossa: require("@/assets/logos/frecciarossa.png"),
	Intercity: require("@/assets/logos/intercity.png"),
	Regionale: require("@/assets/logos/regionale.png"),
	FRRossa: require("@/assets/logos/frecciarossa.png"),
	InterCity: require("@/assets/logos/intercity.png"),
	IntercityNotte: require("@/assets/logos/intercity.png"),
	ICNotte: require("@/assets/logos/intercity.png"),
	Reg: require("@/assets/logos/regionale.png"),
	RegV: require("@/assets/logos/regionale.png"),
	Regv: require("@/assets/logos/regionale.png"),
	"Reg Tper": require("@/assets/logos/tper.png"),
	"Regv Tper": require("@/assets/logos/tper.png"),
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

	const adultsMatch = passengerText.match(/(\d+)\s+Adult/i);
	const adults = adultsMatch ? parseInt(adultsMatch[1], 10) : 0;
	const youthsMatch = passengerText.match(/(\d+)\s+Ragazz/i);
	const youths = youthsMatch ? parseInt(youthsMatch[1], 10) : 0;
	const passengerCount = Math.max(1, adults + youths);

	const solution = selectedSolutionCache;
	const routeStr =
		(params.routeStr as string) || "Roma Termini - Napoli Centrale";
	const [origin, destination] = routeStr.split(" - ");

	const trains = solution?.trains || [];
	const segments = trains.map((t: any) => ({
		...t,
		origin: t.origin || origin,
		destination: t.destination || destination,
		timeStr:
			t.departureTime && t.arrivalTime
				? `${t.departureTime} - ${t.arrivalTime}`
				: `${solution?.departureTime || "00:00"} - ${solution?.arrivalTime || "00:00"}`,
	}));

	// Date formatting
	const dateStr = params.dateStr as string;
	const dateObj = dateStr ? new Date(dateStr) : new Date();
	const day = dateObj.getDate().toString().padStart(2, "0");
	const month = dateObj
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
			name,
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
			let displayName =
				rawName === "S.ECONOMY"
					? "Super Economy"
					: rawName.toUpperCase() === "FR.DAYS"
						? "Freccia Days"
						: rawName
								.toLowerCase()
								.split(" ")
								.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
								.join(" ");
			return {
				id: rawName,
				name: displayName,
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

	return (
		<View className="flex-1 bg-white">
			<CheckoutHeader title="Andata" />

			<ScrollView
				className="flex-1 bg-gray-100"
				contentContainerStyle={{ paddingBottom: 180 }}
			>
				{segments.map((segment: any, sIdx: number) => {
					const normalizedType = segment.type.trim().toLowerCase();
					const isFreccia =
						normalizedType.includes("freccia") || normalizedType === "frrossa";
					const logoKey = Object.keys(LOGOS).find(
						(k) => k.toLowerCase() === normalizedType,
					);
					const logoSource = logoKey ? LOGOS[logoKey] : undefined;
					const realClasses = getRealClasses(sIdx);
					const currentSelectedClass = selectedClasses[sIdx] || "Standard";
					const realOffers = getRealOffers(sIdx, currentSelectedClass);
					const isExpanded = expandedSegments[sIdx] !== false;

					const selectedOfferObj = realOffers.find(
						(o) => o.id === selectedOffers[sIdx],
					);
					const displayOfferName = selectedOfferObj
						? selectedOfferObj.name
						: selectedOffers[sIdx];

					return (
						<Animated.View
							key={sIdx}
							className="bg-white mb-2 pt-3"
							layout={LinearTransition}
						>
							<SegmentHeader
								logoSource={logoSource}
								normalizedType={normalizedType}
								type={segment.type}
								number={segment.number}
								origin={segment.origin}
								destination={segment.destination}
								formattedDate={formattedDate}
								timeStr={segment.timeStr}
								passengerText={passengerText}
								isExpanded={isExpanded}
								onToggle={() => toggleSegment(sIdx)}
							/>

							{isExpanded && (
								<Animated.View entering={FadeIn} exiting={FadeOut}>
									{/* Custom Accordion for Class/Offer */}
									{/* Custom Accordion for Class/Offer */}
									<AnimatedPressable
										layout={LinearTransition}
										onPress={() =>
											setOpenAccordions((prev) => ({
												...prev,
												[sIdx]: !prev[sIdx],
											}))
										}
										className="mb-6 mx-4 bg-white border border-gray-200 rounded-lg overflow-hidden"
									>
										{/* Accordion Header */}
										<View
											className={`flex-row items-center justify-between px-4 py-3 ${openAccordions[sIdx] ? "border-b border-gray-100" : ""}`}
										>
											<View className="flex-1 mr-4">
												<ThemedText className="text-[15px] font-plus-jakarta-bold text-gray-800">
													{currentSelectedClass
														.toUpperCase()
														.replace(" PRENOTAZIONE", "")}
													<ThemedText className="text-[15px] font-plus-jakarta-medium opacity-60">
														{"  "}
														{displayOfferName}
													</ThemedText>
												</ThemedText>
											</View>
											<View className="flex-row items-center">
												<ThemedText className="text-[16px] font-plus-jakarta-bold text-[#005045] mr-2">
													€{" "}
													{getPriceForSegment(
														sIdx,
														currentSelectedClass,
														selectedOffers[sIdx],
													)
														.toFixed(2)
														.replace(".", ",")}
												</ThemedText>
												<Icon
													name={
														openAccordions[sIdx]
															? "keyboard_arrow_up"
															: "keyboard_arrow_down"
													}
													size={20}
													color="#6b7280"
												/>
											</View>
										</View>

										{/* Accordion Body */}
										{openAccordions[sIdx] && (
											<Animated.View
												entering={FadeIn}
												exiting={FadeOut}
												className="py-3 bg-white"
											>
												{realClasses.map((c, cIdx) => {
													const classOffers = getRealOffers(sIdx, c.id)
														.filter((a) => getPriceForSegment(sIdx, c.id, a.id) > 0)
														.sort((a, b) => {
															const priceA = getPriceForSegment(
																sIdx,
																c.id,
																a.id,
															);
															const priceB = getPriceForSegment(
																sIdx,
																c.id,
																b.id,
															);
															return priceA - priceB;
														});

													if (classOffers.length === 0) return null;

													const isLastClass = cIdx === realClasses.length - 1;

													return (
														<View key={`class-${c.id}`}>
															{/* Class Header */}
															<View className="flex-row items-center justify-between px-4 pt-1 pb-1">
																<ThemedText
																	className={`text-[14px] font-plus-jakarta-bold tracking-wider ${selectedClasses[sIdx] === c.id ? "text-gray-800" : "text-gray-500"}`}
																>
																	{c.name
																		.toUpperCase()
																		.replace(" PRENOTAZIONE", "")}
																</ThemedText>
																{CLASS_ICONS[c.name.toUpperCase()] && (
																	<View className="flex-row items-center gap-1.5">
																		{CLASS_ICONS[c.name.toUpperCase()].map(
																			(iconName, idx) => (
																				<Icon
																					key={idx}
																					name={iconName}
																					size={16}
																					className="!text-teal-600"
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
																			setOpenAccordions((prev) => ({
																				...prev,
																				[sIdx]: false,
																			}));
																		}}
																		className={`flex-row items-center justify-between pr-4 pl-8 py-2 ${isSelected ? "bg-teal-500/10" : "active:bg-gray-50"}`}
																	>
																		<View className="flex-row items-center flex-1">
																			<ThemedText
																				className={`text-[15px] ${isSelected ? "font-plus-jakarta-bold text-[#005045]" : "font-plus-jakarta-medium text-gray-700 opacity-60"}`}
																			>
																				{o.name}
																			</ThemedText>
																		</View>
																		<ThemedText
																			className={`text-[15px] ${isSelected ? "font-plus-jakarta-bold text-[#005045]" : "font-plus-jakarta-medium text-gray-800 opacity-60"}`}
																		>
																			€{" "}
																			{offerPrice.toFixed(2).replace(".", ",")}
																		</ThemedText>
																	</Pressable>
																);
															})}

															{/* Optional spacing between classes */}
															{!isLastClass && <View className="h-4" />}
														</View>
													);
												})}
											</Animated.View>
										)}
									</AnimatedPressable>
								</Animated.View>
							)}
						</Animated.View>
					);
				})}
			</ScrollView>

			<StickyFooter
				totalPrice={
					getPriceForSelection(selectedClasses, selectedOffers) * passengerCount
				}
				basePrice={basePrice}
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
								return {
									...train,
									selectedClass: cName,
									selectedOffer: oName,
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
