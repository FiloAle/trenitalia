import { selectedSolutionCache } from "@/api/search";
import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { OtherOffersButton } from "@/components/select-offer/other-offers-button";
import { SegmentHeader } from "@/components/select-offer/segment-header";
import { SelectionCard } from "@/components/select-offer/selection-card";
import { SelectionSection } from "@/components/select-offer/selection-section";
import { StickyFooter } from "@/components/select-offer/sticky-footer";
import { CheckoutHeader } from "@/components/checkout-header";

const LOGOS: Record<string, any> = {
	Frecciarossa: require("@/assets/logos/frecciarossa.png"),
	FRRossa: require("@/assets/logos/frecciarossa.png"),
	Intercity: require("@/assets/logos/intercity.png"),
	InterCity: require("@/assets/logos/intercity.png"),
	IntercityNotte: require("@/assets/logos/intercity.png"),
	ICNotte: require("@/assets/logos/intercity.png"),
	Regionale: require("@/assets/logos/regionale.png"),
	Reg: require("@/assets/logos/regionale.png"),
	RegV: require("@/assets/logos/regionale.png"),
	Regv: require("@/assets/logos/regionale.png"),
	"Reg Tper": require("@/assets/logos/tper.png"),
	"Regv Tper": require("@/assets/logos/tper.png"),
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
						if (
							priceStr &&
							typeof priceStr === "string" &&
							priceStr.trim() !== ""
						) {
							uniqueOffers.add(fName);
						}
					});
				} else if (t.sf) {
					const priceStr = t.p[classIndex][0];
					if (
						priceStr &&
						typeof priceStr === "string" &&
						priceStr.trim() !== ""
					) {
						uniqueOffers.add(t.sf);
					}
				}
			}
		});

		const offersList = Array.from(uniqueOffers).map((name) => ({
			id: name,
			name: name === "S.ECONOMY" ? "SUPER ECONOMY" : name,
			badge:
				name.includes("SUPER") ||
				name.includes("S.ECONOMY") ||
				name.includes("SPECIALE")
					? "Non modificabile"
					: name.includes("BASE") || name.includes("ECONOMY")
						? "Modificabile"
						: "",
		}));
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
			initialClasses[idx] = minClassPrice === Infinity ? rClasses[0].id : bestClass;
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
			initialOffers[idx] = minOfferPrice === Infinity ? rOffers[0].id : bestOffer;
		} else {
			initialOffers[idx] = "ORDINARIA";
		}
	});

	// State for selections
	const [selectedClasses, setSelectedClasses] =
		useState<Record<number, string>>(initialClasses);
	const [selectedOffers, setSelectedOffers] =
		useState<Record<number, string>>(initialOffers);
	const [expandedSegments, setExpandedSegments] = useState<Record<number, boolean>>({});

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

					return (
						<Animated.View key={sIdx} className="bg-white mb-2 pt-3" layout={LinearTransition}>
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
									<SelectionSection
										title="Seleziona il servizio/classe"
										containerClassName="mb-4"
										selectedIndex={Math.max(0, realClasses.findIndex(c => c.id === currentSelectedClass))}
										data={realClasses}
										renderItem={(c) => {
											const isSelected = selectedClasses[sIdx] === c.id;
											const segmentPrice = getMinPriceForClass(sIdx, c.id);
											return (
												<SelectionCard
													isSelected={isSelected}
													onPress={() => {
														setSelectedClasses((prev) => ({
															...prev,
															[sIdx]: c.id,
														}));
														const availableOffers = getRealOffers(sIdx, c.id);
														const currentOffer = selectedOffers[sIdx];
														if (
															availableOffers.length > 0 &&
															!availableOffers.find((o) => o.id === currentOffer)
														) {
															let minOfferPrice = Infinity;
															let bestOffer = availableOffers[0].id;
															for (const o of availableOffers) {
																const price = getPriceForSegment(sIdx, c.id, o.id);
																if (price > 0 && price < minOfferPrice) {
																	minOfferPrice = price;
																	bestOffer = o.id;
																}
															}
															setSelectedOffers((prev) => ({
																...prev,
																[sIdx]: bestOffer,
															}));
														}
													}}
													title={c.name}
													price={segmentPrice}
													showInfo={isFreccia}
													variant="class"
												/>
											);
										}}
									/>

								{(() => {
									const sortedOffers = [...realOffers].sort((a, b) => {
										const priceA = getPriceForSegment(sIdx, currentSelectedClass, a.id);
										const priceB = getPriceForSegment(sIdx, currentSelectedClass, b.id);
										return priceA - priceB;
									});
									const selectedOfferIndex = sortedOffers.findIndex(o => o.id === selectedOffers[sIdx]);

									return (
										<SelectionSection
											title="Seleziona l'offerta"
											containerClassName="mb-5"
											selectedIndex={Math.max(0, selectedOfferIndex)}
											data={sortedOffers}
											renderItem={(o) => {
												const isSelected = selectedOffers[sIdx] === o.id;
												const segmentPrice = getPriceForSegment(
													sIdx,
													currentSelectedClass,
													o.id,
												);
												return (
													<SelectionCard
														isSelected={isSelected}
														onPress={() =>
															setSelectedOffers((prev) => ({
																...prev,
																[sIdx]: o.id,
															}))
														}
														title={o.name}
														price={segmentPrice}
														badge={o.badge}
														showInfo={isFreccia}
														variant="offer"
													/>
												);
											}}
										/>
									);
								})()}

							<OtherOffersButton />
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
					const finalPrice = getPriceForSelection(selectedClasses, selectedOffers) * passengerCount;
					
					if (selectedSolutionCache) {
						selectedSolutionCache.price = finalPrice;
						selectedSolutionCache.trains = selectedSolutionCache.trains.map((train: any, idx: number) => {
							const cName = selectedClasses[idx] || "Standard";
							const oName = selectedOffers[idx] || "Super Economy";
							return {
								...train,
								selectedClass: cName,
								selectedOffer: oName,
								price: getPriceForSegment(idx, cName, oName) * passengerCount
							};
						});
					}

					router.push({
						pathname: "/passenger-data" as any,
						params: {
							...params,
							totalPrice: finalPrice,
							basePrice: basePrice
						}
					});
				}}
			/>
		</View>
	);
}
