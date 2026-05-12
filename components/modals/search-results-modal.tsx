import { SectionHeader } from "@/components/search/section-header";
import {
	TravelSolution,
	TravelSolutionCard,
} from "@/components/search/travel-solution-card";
import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, Modal, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomSheet } from "@/components/modals/bottom-sheet";
import { MainButton } from "@/components/ui/main-button";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DATE_ITEM_WIDTH = 80;

const MOCK_SOLUTIONS: TravelSolution[] = [
	{
		id: "1",
		trains: [
			{ type: "Intercity", number: "669" },
			{ type: "Regionale", number: "2045" },
		],
		departureTime: "14:05",
		arrivalTime: "23:48",
		duration: "9h 43min",
		price: 61.65,
		offerName: "Vedi offerte",
	},
	{
		id: "2",
		trains: [{ type: "Frecciarossa", number: "9543" }],
		departureTime: "14:10",
		arrivalTime: "17:49",
		duration: "3h 39min",
		price: 86.7,
		originalPrice: 102.0,
		offerName: "Standard BASE",
		delay: "+2 MIN",
	},
	{
		id: "3",
		trains: [{ type: "Frecciarossa", number: "9639" }],
		departureTime: "14:30",
		arrivalTime: "17:40",
		duration: "3h 10min",
		price: 118.2,
		originalPrice: 139.0,
		offerName: "Business BASE",
		status: "not_started",
	},
	{
		id: "4",
		trains: [{ type: "Frecciarossa", number: "9641" }],
		departureTime: "15:00",
		arrivalTime: "18:15",
		duration: "3h 15min",
		price: 86.7,
		originalPrice: 102.0,
		offerName: "Standard BASE",
		delay: "+2 MIN",
	},
];

interface SearchResultsModalProps {
	isVisible: boolean;
	onClose: () => void;
	route: { from: string; to: string };
	travelType: string;
	departureDate: Date;
	adults: number;
	youths: number;
	children: number;
}

export function SearchResultsModal({
	isVisible,
	onClose,
	route,
	travelType: initialTravelType,
	departureDate,
	adults,
	youths,
	children,
}: SearchResultsModalProps) {
	const insets = useSafeAreaInsets();
	const [showFilters, setShowFilters] = useState(false);
	const [activeTravelType, setActiveTravelType] = useState(initialTravelType);

	const [localFrom, setLocalFrom] = useState(route.from);
	const [localTo, setLocalTo] = useState(route.to);
	const [currentSelectedDate, setCurrentSelectedDate] = useState(departureDate);
	const dateScrollRef = useRef<ScrollView>(null);

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
			dateScrollRef.current.scrollTo({ x: offset, animated });
		}
	};

	useEffect(() => {
		if (isVisible && selectedDateIndex !== -1 && dateScrollRef.current) {
			scrollToDate(selectedDateIndex, false);
		}
	}, [isVisible, selectedDateIndex, snapOffsets]);

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

	const passengerText = [
		adults > 0 ? `${adults} Adult${adults > 1 ? "i" : "o"}` : "",
		youths > 0 ? `${youths} Ragazz${youths > 1 ? "i" : "o"}` : "",
		children > 0 ? `${children} Bambin${children > 1 ? "i" : "o"}` : "",
	]
		.filter(Boolean)
		.join(", ");

	const isPast = (d: Date) => {
		const now = new Date();
		now.setHours(0, 0, 0, 0);
		return d < now;
	};

	// Update local state when prop changes
	React.useEffect(() => {
		setActiveTravelType(initialTravelType);
		setLocalFrom(route.from);
		setLocalTo(route.to);
		setCurrentSelectedDate(departureDate);
	}, [initialTravelType, route, isVisible, departureDate]);

	const handleSwitch = () => {
		const temp = localFrom;
		setLocalFrom(localTo);
		setLocalTo(temp);
	};

	const filteredSolutions = MOCK_SOLUTIONS.filter((sol) => {
		if (activeTravelType === "Principali Soluzioni") return true;
		if (activeTravelType === "Frecce") {
			return sol.trains.every((t) => t.type.includes("Freccia"));
		}
		if (activeTravelType === "Intercity") {
			return sol.trains.every((t) => t.type === "Intercity");
		}
		if (activeTravelType === "Regionali") {
			return sol.trains.every((t) => t.type === "Regionale");
		}
		return true;
	});

	return (
		<Modal visible={isVisible} animationType="slide" transparent={false}>
			<View className="flex-1 bg-white">
				{/* Top Green Header */}
				<View className="bg-[#004a4d] px-5" style={{ paddingTop: insets.top }}>
					{/* Navigation Row */}
					<View className="flex-row items-center justify-between relative">
						<Pressable onPress={onClose} className="p-2 -ml-2 z-10">
							<Icon name="arrow_back" size={26} className="!text-white" />
						</Pressable>

						<View className="absolute left-0 right-0 top-0 bottom-0 items-center justify-center">
							<ThemedText className="text-[17px] font-plus-jakarta-bold !text-white">
								Andata
							</ThemedText>
						</View>

						<View className="flex-row items-center gap-5 mr-1 z-10">
							<Icon name="home" size={26} className="!text-white" />
							<Icon name="shopping_cart" size={26} className="!text-white" />
						</View>
					</View>

					{/* Stations Card */}
					<View className="bg-white/10 rounded-xl px-4 mt-3 flex-row items-center h-[56px]">
						<ThemedText
							numberOfLines={1}
							className="flex-1 text-[14px] font-plus-jakarta-semibold !text-white"
						>
							{localFrom}
						</ThemedText>

						<Pressable
							onPress={handleSwitch}
							className="h-10 w-10 bg-white rounded-full items-center justify-center mx-4"
						>
							<Icon name="swap_horiz" size={24} className="!text-teal-900" />
						</Pressable>

						<ThemedText
							numberOfLines={1}
							className="flex-1 text-[14px] font-plus-jakarta-semibold !text-white"
						>
							{localTo}
						</ThemedText>
					</View>

					{/* Info Row */}
					<View className="flex-row gap-3 mt-3">
						<View className="flex-1 bg-white/10 rounded-xl p-3.5 h-[56px] justify-center">
							<ThemedText className="text-[12px] font-plus-jakarta-medium !text-white/60 mb-0.5">
								Andata
							</ThemedText>
							<ThemedText className="text-[15px] font-plus-jakarta-bold !text-white">
								{formatDisplayDate(departureDate)}
							</ThemedText>
						</View>
						<View className="flex-1 bg-white/10 rounded-xl p-3.5 h-[56px] justify-center">
							<ThemedText className="text-[12px] font-plus-jakarta-medium !text-white/60 mb-0.5">
								Passeggeri
							</ThemedText>
							<ThemedText
								numberOfLines={1}
								className="text-[15px] font-plus-jakarta-bold !text-white"
							>
								{passengerText}
							</ThemedText>
						</View>
					</View>

					{/* Date Selector Strip */}
					<View className="mt-4 -mx-5">
						<ScrollView
							ref={dateScrollRef}
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={{
								paddingHorizontal: 0,
							}}
							snapToOffsets={snapOffsets}
							snapToAlignment="center"
							decelerationRate="fast"
							onLayout={() => {
								if (selectedDateIndex !== -1) {
									scrollToDate(selectedDateIndex, false);
								}
							}}
						>
							{dates.map((date, idx) => {
								const isSelected =
									date.getDate() === currentSelectedDate.getDate() &&
									date.getMonth() === currentSelectedDate.getMonth() &&
									date.getFullYear() === currentSelectedDate.getFullYear();
								const isDisabled = isPast(date);

								return (
									<Pressable
										key={idx}
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
												className={`text-[14px] font-plus-jakarta-semibold ${
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
							})}
						</ScrollView>
					</View>
				</View>

				{/* Results List */}
				<ScrollView className="flex-1 bg-gray-50">
					<View className="p-4 gap-4">
						{/* Previous Solutions Button */}
						<Pressable className="h-12 w-full items-center justify-center rounded-lg border border-gray-200 bg-white mb-1">
							<ThemedText className="text-[15px] font-plus-jakarta-bold !text-gray-800">
								Soluzioni precedenti
							</ThemedText>
						</Pressable>

						{filteredSolutions.map((solution) => (
							<TravelSolutionCard
								key={solution.id}
								solution={solution}
								route={route}
							/>
						))}
						{filteredSolutions.length === 0 && (
							<View className="items-center py-10">
								<ThemedText className="text-gray-500 font-plus-jakarta-medium">
									Nessuna soluzione trovata per questa tipologia.
								</ThemedText>
							</View>
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
						<ThemedText className="ml-2 text-[15px] font-plus-jakarta-bold !text-white">
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
												<ThemedText className="text-[16px] font-plus-jakarta-bold !text-gray-800">
													{type}
												</ThemedText>
												{type === "Principali Soluzioni" && (
													<Icon
														name="info"
														size={16}
														className="ml-2 !text-gray-400"
													/>
												)}
											</View>
											<View
												className={`h-6 w-6 rounded-full border-2 items-center justify-center ${
													activeTravelType === type
														? "border-teal-800"
														: "border-gray-200"
												}`}
											>
												{activeTravelType === type && (
													<View className="h-3 w-3 rounded-full bg-teal-800" />
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
									{["Soluzioni senza cambi", "Viaggia con la tua bici"].map(
										(pref) => (
											<View
												key={pref}
												className="flex-row items-center justify-between py-1"
											>
												<ThemedText className="text-[16px] font-plus-jakarta-bold !text-gray-800">
													{pref}
												</ThemedText>
												<View className="h-6 w-11 rounded-full bg-gray-100 p-1">
													<View className="h-4 w-4 rounded-full bg-white" />
												</View>
											</View>
										),
									)}
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
											<ThemedText className="text-[16px] font-plus-jakarta-bold !text-gray-800">
												{sort}
											</ThemedText>
											<View
												className={`h-6 w-6 rounded-full border-2 items-center justify-center ${
													sort === "Orario di partenza"
														? "border-teal-800"
														: "border-gray-200"
												}`}
											>
												{sort === "Orario di partenza" && (
													<View className="h-3 w-3 rounded-full bg-teal-800" />
												)}
											</View>
										</Pressable>
									))}
								</View>
							</View>
						</View>
					</ScrollView>

					<View className="flex-row gap-4 mt-6">
						<Pressable className="flex-1 h-14 items-center justify-center rounded-lg border border-gray-300">
							<ThemedText className="text-[16px] font-plus-jakarta-bold !text-gray-800 uppercase">
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
			</View>
		</Modal>
	);
}
