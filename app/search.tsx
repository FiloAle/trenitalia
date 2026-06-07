import { BottomSheet } from "@/components/modals/bottom-sheet";
import { SavedSearchItem } from "@/components/search/saved-search-item";
import { SearchListItem } from "@/components/search/search-list-item";
import { SectionHeader } from "@/components/search/section-header";
import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { MainButton } from "@/components/ui/main-button";
import {
	RECENT_SEARCHES,
	SAVED_SEARCHES,
	STATIONS,
} from "@/constants/stations";
import { USER_DATA, getInitials } from "@/constants/user";
import React, { useEffect, useRef, useState } from "react";
import {
	Animated,
	Dimensions,
	FlatList,
	Modal,
	Platform,
	Pressable,
	ScrollView,
	TextInput,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function SearchScreen() {
	const params = useLocalSearchParams();
	const initialFrom = params.initialFrom as string || "";
	const initialTo = params.initialTo as string || "";
	const initialStep = (params.initialStep as "searching" | "details") || "searching";
	const insets = useSafeAreaInsets();
	const [step, setStep] = useState<"searching" | "details">(initialStep);
	const [fromText, setFromText] = useState(initialFrom);
	const [toText, setToText] = useState(initialTo);
	const [activeInput, setActiveInput] = useState<"from" | "to" | null>(null);

	useEffect(() => {
		setFromText(initialFrom);
		setToText(initialTo);
		setStep(initialStep);
	}, [initialFrom, initialTo, initialStep]);

	// Mock modal states
	const [showCalendar, setShowCalendar] = useState(false);
	const [showPassengers, setShowPassengers] = useState(false);
	const [showPassengersSheet, setShowPassengersSheet] = useState(false);
	const [showTravelType, setShowTravelType] = useState(false);
	const [travelType, setTravelType] = useState("Principali Soluzioni");
	const [showDiscountSheet, setShowDiscountSheet] = useState(false);
	const [isPassengerExpanded, setIsPassengerExpanded] = useState(false);
	const [adults, setAdults] = useState(1);
	const [youths, setYouths] = useState(0);
	const [children, setChildren] = useState(0);

	const hourScrollRef = useRef<ScrollView>(null);
	const fromInputRef = useRef<TextInput>(null);
	const toInputRef = useRef<TextInput>(null);

	const [noChanges, setNoChanges] = useState(false);
	const [bike, setBike] = useState(false);
	const [hasReturn, setHasReturn] = useState(false);

	// Date selection states
	const [activeCalendarTab, setActiveCalendarTab] = useState<
		"andata" | "ritorno"
	>("andata");
	const [departureDate, setDepartureDate] = useState(() => {
		const d = new Date();
		d.setSeconds(0);
		d.setMilliseconds(0);
		return d;
	});
	const [returnDate, setReturnDate] = useState(() => {
		const d = new Date();
		d.setHours(d.getHours() + 1);
		d.setSeconds(0);
		d.setMilliseconds(0);
		return d;
	});

	// Components
	const SearchOptionCard = ({
		label,
		value,
		onPress,
		isAdd = false,
		hasCancel = false,
		onCancel = () => {},
	}: {
		label: string;
		value: string;
		onPress: () => void;
		isAdd?: boolean;
		hasCancel?: boolean;
		onCancel?: () => void;
	}) => (
		<Pressable
			onPress={onPress}
			className={`flex-1 rounded-lg border border-gray-200 px-4 py-2 bg-white h-[56px] justify-center ${
				isAdd ? "flex-row items-center justify-center gap-2" : ""
			}`}
		>
			{isAdd ? (
				<>
					<Icon
						name="add_circle"
						size={18}
						className="!text-teal-900"
						weight={300}
					/>
					<ThemedText className="text-[14px] font-plus-jakarta-semibold !text-teal-900">
						{label}
					</ThemedText>
				</>
			) : (
				<View className="flex-row items-center justify-between">
					<View className="flex-1">
						<ThemedText className="text-[13px] font-plus-jakarta-medium !text-gray-500">
							{label}
						</ThemedText>
						<ThemedText className="text-[14px] font-plus-jakarta-semibold !text-gray-950 mt-1">
							{value}
						</ThemedText>
					</View>
					{hasCancel && (
						<Pressable
							onPress={(e) => {
								e.stopPropagation();
								onCancel();
							}}
							className="pl-2"
						>
							<Icon name="cancel" size={20} className="!text-gray-500" />
						</Pressable>
					)}
				</View>
			)}
		</Pressable>
	);
	const [currentMonth, setCurrentMonth] = useState(new Date());

	const useNativeDriver = Platform.OS !== "web";

	const formatDate = (date: Date) => {
		// Correct month index for display
		const monthIdx = date.getMonth();
		const monthName = [
			"Gen",
			"Feb",
			"Mar",
			"Apr",
			"Mag",
			"Giu",
			"Lug",
			"Ago",
			"Set",
			"Ott",
			"Nov",
			"Dic",
		][monthIdx];

		return `${date.getDate()} ${monthName} - ${date.getHours()}:${date
			.getMinutes()
			.toString()
			.padStart(2, "0")}`;
	};

	const ModalHeader = ({
		title,
		onClose,
		isCentered = true,
	}: {
		title: string;
		onClose: () => void;
		isCentered?: boolean;
	}) => (
		<View className="flex-row items-center justify-between px-5 pt-1 pb-2">
			{isCentered ? (
				<>
					<View className="w-10" />
					<ThemedText className="flex-1 text-center text-[15px] font-plus-jakarta-bold !text-gray-950">
						{title}
					</ThemedText>
					<Pressable onPress={onClose} className="p-2">
						<Icon
							name="close"
							size={28}
							className="!text-gray-800"
							weight={300}
						/>
					</Pressable>
				</>
			) : (
				<>
					<ThemedText className="text-[22px] font-plus-jakarta-bold !text-gray-950">
						{title}
					</ThemedText>
					<Pressable onPress={onClose} className="p-2">
						<Icon
							name="close"
							size={28}
							className="!text-gray-800"
							weight={300}
						/>
					</Pressable>
				</>
			)}
		</View>
	);

	const isToday = (date: Date) => {
		const now = new Date();
		return (
			date.getDate() === now.getDate() &&
			date.getMonth() === now.getMonth() &&
			date.getFullYear() === now.getFullYear()
		);
	};

	const generateDays = () => {
		const year = currentMonth.getFullYear();
		const month = currentMonth.getMonth();
		const firstDay = new Date(year, month, 1).getDay();
		const daysInMonth = new Date(year, month + 1, 0).getDate();

		// Adjust for Monday start (0=Lun, 6=Dom)
		const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

		const days = [];
		for (let i = 0; i < adjustedFirstDay; i++) {
			days.push({ day: null });
		}

		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const depOnlyDate = new Date(departureDate);
		depOnlyDate.setHours(0, 0, 0, 0);
		const retOnlyDate = new Date(returnDate);
		retOnlyDate.setHours(0, 0, 0, 0);

		for (let i = 1; i <= daysInMonth; i++) {
			const date = new Date(year, month, i);
			const isStart = hasReturn && date.getTime() === depOnlyDate.getTime();
			const isEnd = hasReturn && date.getTime() === retOnlyDate.getTime();
			const isInRange = hasReturn && date > depOnlyDate && date < retOnlyDate;
			const isSelected =
				activeCalendarTab === "andata"
					? departureDate.toDateString() === date.toDateString()
					: returnDate.toDateString() === date.toDateString();

			days.push({
				day: i,
				date: date,
				isPast: date < today,
				isSelected,
				isStart,
				isEnd,
				isInRange,
			});
		}
		return days;
	};

	// Screen focus animations could be added here if needed

	useEffect(() => {
		if (showCalendar) {
			const h =
				activeCalendarTab === "andata"
					? departureDate.getHours()
					: returnDate.getHours();
			// Synchronizing with -mx-6 layout (+28)
			const offset = h * 88 + 28 - SCREEN_WIDTH / 2;
			setTimeout(() => {
				hourScrollRef.current?.scrollTo({
					x: Math.max(0, offset),
					animated: true,
				});
			}, 400);
		}
	}, [showCalendar, activeCalendarTab]);

	const handleClose = () => {
		router.back();
	};

	const filteredStations = STATIONS.filter((s) => {
		const text = activeInput === "from" ? fromText : toText;
		return text.length > 0 && s.name.toLowerCase().includes(text.toLowerCase());
	});

	const showSuggestions =
		activeInput && (activeInput === "from" ? fromText : toText).length > 0;

	const handleStationSelect = (station: string) => {
		if (activeInput === "from") {
			setFromText(station);
			if (!toText) {
				setActiveInput("to");
				setTimeout(() => toInputRef.current?.focus(), 100);
			} else {
				setActiveInput(null);
				setStep("details");
			}
		} else {
			setToText(station);
			if (!fromText) {
				setActiveInput("from");
				setTimeout(() => fromInputRef.current?.focus(), 100);
			} else {
				setActiveInput(null);
				setStep("details");
			}
		}
	};

	const handleRouteSelect = (from: string, to: string) => {
		setFromText(from);
		setToText(to);
		setActiveInput(null);
		setStep("details");
	};

	return (
		<View style={{ flex: 1, backgroundColor: "white" }}>
			<View style={{ flex: 1, paddingTop: insets.top }}>
					{step === "searching" ? (
						<>
							{/* Header Searching */}
							<ModalHeader title="Dove vuoi andare?" onClose={handleClose} />

							<View className="px-5 pb-3">
								<View className="rounded-lg border border-gray-200 bg-white overflow-hidden">
									<View className="flex-row items-center border-b border-gray-200 px-4 py-4">
										<View className="w-8">
											<ThemedText className="text-[14px] font-plus-jakarta-medium !text-gray-500">
												Da
											</ThemedText>
										</View>
										<TextInput
											ref={fromInputRef}
											className={`flex-1 text-[14px] ml-2 text-gray-950 ${
												fromText
													? "font-plus-jakarta-semibold"
													: "font-plus-jakarta-medium"
											}`}
											placeholder="Stazione di partenza"
											placeholderTextColor="#6b7280"
											value={fromText}
											onChangeText={setFromText}
											onFocus={() => setActiveInput("from")}
											autoFocus
										/>
									</View>
									<View className="flex-row items-center px-4 py-4">
										<View className="w-8">
											<ThemedText className="text-[14px] font-plus-jakarta-medium !text-gray-500">
												A
											</ThemedText>
										</View>
										<TextInput
											ref={toInputRef}
											className={`flex-1 text-[14px] ml-2 text-gray-950 ${
												toText
													? "font-plus-jakarta-semibold"
													: "font-plus-jakarta-medium"
											}`}
											placeholder="Stazione di arrivo"
											placeholderTextColor="#6b7280"
											value={toText}
											onChangeText={setToText}
											onFocus={() => setActiveInput("to")}
										/>
									</View>
								</View>
							</View>

							{showSuggestions ? (
								<FlatList
									data={filteredStations}
									keyExtractor={(item, index) => `${item}-${index}`}
									showsVerticalScrollIndicator={false}
									keyboardShouldPersistTaps="handled"
									contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40 }}
									initialNumToRender={20}
									maxToRenderPerBatch={20}
									windowSize={5}
									ListHeaderComponent={<SectionHeader title="SUGGERIMENTI" />}
									renderItem={({ item, index }) => (
										<SearchListItem
											iconName="train"
											text={item.name}
											showBorder
											weight={300}
											onPress={() => handleStationSelect(item.name)}
										/>
									)}
								/>
							) : (
								<FlatList
									data={STATIONS}
									keyExtractor={(item, index) => `${item.name}-${index}`}
									showsVerticalScrollIndicator={false}
									keyboardShouldPersistTaps="handled"
									contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40 }}
									initialNumToRender={20}
									maxToRenderPerBatch={20}
									windowSize={5}
									ListHeaderComponent={
										<View className="pb-6">
											{/* Current Location */}
											<SearchListItem
												iconName="near_me"
												text="Milano Bovisa Politecnico"
												className="!px-0"
												weight={300}
												onPress={() =>
													handleStationSelect("Milano Bovisa Politecnico")
												}
											/>

											{/* Saved Searches */}
											<View className="mt-5">
												<SectionHeader title="RICERCHE SALVATE" />
												{SAVED_SEARCHES.map((item, index) => {
													const route = `${item.from} - ${item.to}`;
													const badge = item.to.split(" ")[0]; // Take first word of destination as badge
													const colorClass =
														index % 2 === 0
															? "bg-teal-50 text-teal-800 border-teal-100"
															: "bg-pink-50 text-pink-800 border-pink-100";

													return (
														<SavedSearchItem
															key={index}
															route={route}
															badge={badge}
															colorClass={colorClass}
															onPress={() =>
																handleRouteSelect(item.from, item.to)
															}
														/>
													);
												})}
											</View>

											{/* Last Searches */}
											<View className="mt-6">
												<SectionHeader title="ULTIME RICERCHE" />
												{RECENT_SEARCHES.map((item, index) => (
													<SearchListItem
														key={index}
														text={`${item.from} - ${item.to}`}
														iconName="schedule"
														weight={300}
														onPress={() => handleRouteSelect(item.from, item.to)}
													/>
												))}
											</View>

											<View className="mt-6">
												<SectionHeader title="STAZIONI" />
											</View>
										</View>
									}
									renderItem={({ item }) => (
										<SearchListItem
											text={item.name}
											weight={300}
											onPress={() => handleStationSelect(item.name)}
										/>
									)}
								/>
							)}
						</>
					) : (
						<>
							{/* Header Details */}
							<ModalHeader
								title="Ricerca il tuo viaggio"
								onClose={handleClose}
								isCentered={false}
							/>

							<ScrollView
								className="flex-1"
								showsVerticalScrollIndicator={false}
							>
								<View className="px-5 pb-10 gap-4">
									{/* Route Selector Group */}
									<View className="relative">
										<View className="rounded-lg border border-gray-200 bg-white overflow-hidden">
											<Pressable
												onPress={() => setStep("searching")}
												className="flex-row items-center border-b border-gray-200 px-4 py-4"
											>
												<View className="w-8">
													<ThemedText className="text-[14px] font-plus-jakarta-medium !text-gray-500">
														Da
													</ThemedText>
												</View>
												<ThemedText className="flex-1 text-[14px] font-plus-jakarta-semibold !text-gray-950 ml-2">
													{fromText || STATIONS[0].name}
												</ThemedText>
											</Pressable>
											<Pressable
												onPress={() => setStep("searching")}
												className="flex-row items-center px-4 py-4"
											>
												<View className="w-8">
													<ThemedText className="text-[14px] font-plus-jakarta-medium !text-gray-500">
														A
													</ThemedText>
												</View>
												<ThemedText className="flex-1 text-[14px] font-plus-jakarta-semibold !text-gray-950 ml-2">
													{toText || "Roma Termini"}
												</ThemedText>
											</Pressable>
										</View>
										<Pressable
											onPress={() => {
												const temp = fromText;
												setFromText(toText);
												setToText(temp);
											}}
											className="absolute right-4 top-[50%] -mt-[22px] h-11 w-11 items-center justify-center rounded-full bg-pink-50 border border-pink-100 z-10"
										>
											<Icon
												name="swap_vert"
												size={22}
												className="!text-red-600"
											/>
										</Pressable>
									</View>

									{/* Quick Options Grid */}
									<View className="gap-2">
										<View className="flex-row gap-2">
											<SearchOptionCard
												label="Andata"
												value={formatDate(departureDate)}
												onPress={() => {
													setActiveCalendarTab("andata");
													setCurrentMonth(departureDate);
													setShowCalendar(true);
												}}
											/>
											{!hasReturn ? (
												<SearchOptionCard
													label="Aggiungi ritorno"
													value=""
													isAdd
													onPress={() => {
														const next = new Date(departureDate);
														next.setHours(next.getHours() + 1);
														setReturnDate(next);
														setHasReturn(true);
														setActiveCalendarTab("ritorno");
														setCurrentMonth(departureDate);
														setShowCalendar(true);
													}}
												/>
											) : (
												<SearchOptionCard
													label="Ritorno"
													value={formatDate(returnDate)}
													hasCancel
													onCancel={() => setHasReturn(false)}
													onPress={() => {
														setActiveCalendarTab("ritorno");
														setCurrentMonth(returnDate);
														setShowCalendar(true);
													}}
												/>
											)}
										</View>

										<View className="flex-row gap-2">
											<SearchOptionCard
												label="Passeggeri"
												value={`${adults > 0 ? `${adults} Adult${adults > 1 ? "i" : "o"}` : ""}${
													youths > 0
														? ` ${youths} Ragazz${youths > 1 ? "i" : "o"}`
														: ""
												}${
													children > 0
														? ` ${children} Bambin${children > 1 ? "i" : "i"}`
														: ""
												}`.trim()}
												onPress={() => setShowPassengersSheet(true)}
											/>
											<SearchOptionCard
												label="Tipologia viaggio"
												value={travelType}
												onPress={() => setShowTravelType(true)}
											/>
										</View>
									</View>

									{/* Chips Section */}
									<ScrollView
										horizontal
										showsHorizontalScrollIndicator={false}
										className="-mx-5"
										contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
									>
										<Pressable
											onPress={() => setNoChanges(!noChanges)}
											className={`flex-row items-center px-3.5 h-9 rounded-full border ${
												noChanges
													? "bg-teal-50 border-teal-600"
													: "bg-white border-gray-200"
											}`}
										>
											<ThemedText
												className={`text-[14px] font-plus-jakarta-semibold ${
													noChanges ? "!text-teal-700" : "!text-gray-600"
												}`}
											>
												Soluzioni senza cambi
											</ThemedText>
											{noChanges && (
												<Icon
													name="cancel"
													size={16}
													className="ml-2 -mr-1.5 !text-teal-700"
												/>
											)}
										</Pressable>
										<Pressable
											onPress={() => setBike(!bike)}
											className={`flex-row items-center px-3.5 h-9 rounded-full border ${
												bike
													? "bg-teal-50 border-teal-600"
													: "bg-white border-gray-200"
											}`}
										>
											<ThemedText
												className={`text-[14px] font-plus-jakarta-semibold ${
													bike ? "!text-teal-700" : "!text-gray-600"
												}`}
											>
												Viaggia con la tua bici
											</ThemedText>
											{bike && (
												<Icon
													name="cancel"
													size={16}
													className="ml-2 -mr-1.5 !text-teal-700"
												/>
											)}
										</Pressable>
									</ScrollView>

									{/* Bike Info Text */}
									{bike && (
										<View className="flex-row items-start gap-3 mt-1">
											<Icon name="info" size={20} className="!text-gray-500" />
											<ThemedText className="flex-1 text-[13px] font-plus-jakarta-medium !text-gray-500 !leading-snug">
												Ti verranno mostrate solo le soluzioni di viaggio con
												treni Intercity, Regionali ed Eurocity Italia-Svizzera
												che ammettono il trasporto della bici montata.{" "}
												<ThemedText className="underline">
													Maggiori info
												</ThemedText>
											</ThemedText>
										</View>
									)}

									{/* Discount Code Section */}
									<Pressable
										onPress={() => setShowPassengers(true)}
										className="flex-row items-center justify-between py-2 mt-4"
									>
										<View className="flex-row items-center">
											<ThemedText className="text-[14px] font-plus-jakarta-semibold !text-teal-800">
												Aggiungi buono sconto
											</ThemedText>
										</View>
										<Icon name="add" size={24} className="!text-teal-800" />
									</Pressable>

									{/* Legal Info */}
									<View className="mt-4 flex-row gap-2">
										<Icon name="info" size={18} className="!text-gray-400" />
										<ThemedText className="flex-1 text-[12px] font-plus-jakarta-medium !text-gray-500 !leading-tight">
											Prima di procedere con l&apos;acquisto consulta le{" "}
											<ThemedText className="!text-red-700 underline">
												Modifiche della Circolazione Programmata
											</ThemedText>
										</ThemedText>
									</View>
								</View>
							</ScrollView>

							<View className="px-5 py-6 bg-white border-t border-gray-100">
								<MainButton
									title="Ricerca viaggio"
									onPress={() => {
										router.push({
											pathname: "/search-results",
											params: {
												from: fromText,
												to: toText,
												dateStr: departureDate.toISOString(),
												passengerText: `${adults > 0 ? `${adults} Adult${adults > 1 ? "i" : "o"}` : ""}${youths > 0 ? ` ${youths} Ragazz${youths > 1 ? "i" : "o"}` : ""}${children > 0 ? ` ${children} Bambin${children > 1 ? "i" : "i"}` : ""}`.trim()
											}
										});
									}}
									style={{ marginBottom: insets.bottom }}
								/>
							</View>
						</>
					)}
				</View>

				{/* Calendar Bottom Sheet */}
				<BottomSheet
					isVisible={showCalendar}
					onClose={() => setShowCalendar(false)}
					title="Quando vuoi partire?"
				>
					<View className="-mx-6 px-[4px]">
						{/* Selection Tabs */}
						<View className="flex-row px-2 gap-2 mb-3 mx-1">
							<Pressable
								onPress={() => setActiveCalendarTab("andata")}
								className={`flex-1 rounded-lg border p-3 ${
									activeCalendarTab === "andata"
										? "border-teal-800 bg-white"
										: "border-gray-100 bg-gray-50"
								}`}
							>
								<ThemedText className="text-[12px] font-plus-jakarta-medium !text-gray-400">
									Andata
								</ThemedText>
								<ThemedText className="text-[14px] font-plus-jakarta-bold !text-gray-950">
									{formatDate(departureDate)}
								</ThemedText>
							</Pressable>
							<Pressable
								onPress={() => {
									if (!hasReturn) {
										const next = new Date(departureDate);
										next.setHours(next.getHours() + 1);
										setReturnDate(next);
										setHasReturn(true);
									}
									setActiveCalendarTab("ritorno");
								}}
								className={`flex-1 rounded-lg border p-3 relative ${
									activeCalendarTab === "ritorno"
										? "border-teal-800 bg-white"
										: "border-gray-100 bg-gray-50"
								}`}
							>
								<View className="flex-row items-center justify-between">
									<View>
										<ThemedText className="text-[12px] font-plus-jakarta-medium !text-gray-400">
											Ritorno
										</ThemedText>
										<ThemedText
											className={`text-[14px] font-plus-jakarta-bold ${
												hasReturn ? "!text-gray-950" : "!text-gray-300"
											}`}
										>
											{hasReturn ? formatDate(returnDate) : "Aggiungi ritorno"}
										</ThemedText>
									</View>
									{hasReturn && (
										<Pressable
											onPress={(e) => {
												e.stopPropagation();
												setHasReturn(false);
												setActiveCalendarTab("andata");
											}}
										>
											<Icon
												name="cancel"
												size={20}
												className="!text-gray-500"
											/>
										</Pressable>
									)}
								</View>
							</Pressable>
						</View>

						{/* Month Selector */}
						<View className="flex-row justify-between items-center px-2">
							<Pressable
								onPress={() => {
									const prev = new Date(currentMonth);
									prev.setMonth(prev.getMonth() - 1);
									setCurrentMonth(prev);
								}}
								disabled={
									currentMonth.getMonth() === new Date().getMonth() &&
									currentMonth.getFullYear() === new Date().getFullYear()
								}
								className={`p-1 ${
									currentMonth.getMonth() === new Date().getMonth() &&
									currentMonth.getFullYear() === new Date().getFullYear()
										? "opacity-0"
										: "opacity-100"
								}`}
							>
								<Icon
									name="chevron_left"
									size={32}
									className="!text-gray-950"
									weight={200}
								/>
							</Pressable>
							<ThemedText className="text-[14px] font-plus-jakarta-medium !text-gray-950 capitalize">
								{currentMonth.toLocaleString("it-IT", {
									month: "long",
									year: "numeric",
								})}
							</ThemedText>
							<Pressable
								onPress={() => {
									const next = new Date(currentMonth);
									next.setMonth(next.getMonth() + 1);
									setCurrentMonth(next);
								}}
								className="p-1"
							>
								<Icon
									name="chevron_right"
									size={32}
									className="!text-gray-950"
									weight={200}
								/>
							</Pressable>
						</View>

						{/* Days Header */}
						<View className="flex-row px-0 py-4">
							{["LUN", "MAR", "MER", "GIO", "VEN", "SAB", "DOM"].map((d) => (
								<ThemedText
									key={d}
									className="text-[13px] font-plus-jakarta-medium !text-gray-400 w-[14.28%] text-center"
								>
									{d}
								</ThemedText>
							))}
						</View>

						{/* Days Grid */}
						<View className="px-0 flex-row flex-wrap">
							{generateDays().map((d, i) => (
								<Pressable
									key={i}
									disabled={!d.day || d.isPast}
									onPress={() => {
										if (d.date) {
											if (activeCalendarTab === "andata") {
												const newDate = new Date(d.date);
												newDate.setHours(departureDate.getHours());
												newDate.setMinutes(departureDate.getMinutes());
												setDepartureDate(newDate);

												// Smart adjustment: if new departure is after return, update return
												if (hasReturn && newDate >= returnDate) {
													const newReturn = new Date(newDate);
													newReturn.setHours(newDate.getHours() + 1);
													newReturn.setMinutes(0);
													setReturnDate(newReturn);
												}
											} else {
												const newDate = new Date(d.date);
												newDate.setHours(returnDate.getHours());
												newDate.setMinutes(returnDate.getMinutes());
												setReturnDate(newDate);
											}
										}
									}}
									className={`w-[14.28%] h-12 items-center justify-center mb-1 relative`}
								>
									{d.day && (
										<>
											{/* Range Background (Serpentina) */}
											{d.isInRange && (
												<View className="absolute inset-y-1 left-0 right-0 bg-teal-50" />
											)}
											{d.isStart && !d.isEnd && (
												<View className="absolute inset-y-1 left-1/2 right-0 bg-teal-50" />
											)}
											{d.isEnd && !d.isStart && (
												<View className="absolute inset-y-1 left-0 right-1/2 bg-teal-50" />
											)}

											<View
												className={`w-10 h-10 items-center justify-center relative z-10 ${
													d.isSelected || d.isStart || d.isEnd
														? "rounded-full bg-teal-900"
														: ""
												} ${d.isPast ? "opacity-50" : ""}`}
											>
												<ThemedText
													className={`text-[13px] font-plus-jakarta-bold ${
														d.isSelected || d.isStart || d.isEnd
															? "!text-white"
															: d.isPast
																? "!text-gray-500"
																: "!text-gray-950"
													}`}
												>
													{d.day}
												</ThemedText>
												{d.isSelected && (
													<View className="h-1 w-1 bg-white rounded-full absolute bottom-1.5" />
												)}
											</View>
										</>
									)}
								</Pressable>
							))}
						</View>

						<View className="border-t border-gray-100 mt-28 px-0 pt-4 pb-6 -mx-6">
							<View className="pl-12 mb-6">
								<ThemedText className="text-[14px] font-plus-jakarta-medium !text-gray-950">
									Scegli l&apos;ora
								</ThemedText>
							</View>
							<ScrollView
								ref={hourScrollRef}
								horizontal
								showsHorizontalScrollIndicator={false}
								contentContainerStyle={{ paddingHorizontal: 24 }}
							>
								<View className="flex-row gap-2">
									{Array.from({ length: 24 }, (_, i) => i).map((h) => {
										const t = `${h.toString().padStart(2, "0")}:00`;
										const isSelected =
											activeCalendarTab === "andata"
												? departureDate.getHours() === h
												: returnDate.getHours() === h;

										const now = new Date();
										let isDisabled = false;
										if (activeCalendarTab === "andata") {
											if (isToday(departureDate)) {
												isDisabled = h < now.getHours();
											}
										} else {
											if (
												departureDate.getDate() === returnDate.getDate() &&
												departureDate.getMonth() === returnDate.getMonth() &&
												departureDate.getFullYear() === returnDate.getFullYear()
											) {
												isDisabled = h < departureDate.getHours();
											}
										}

										return (
											<Pressable
												key={t}
												disabled={isDisabled}
												onPress={() => {
													if (activeCalendarTab === "andata") {
														const newDate = new Date(departureDate);
														newDate.setHours(h);
														newDate.setMinutes(0);
														setDepartureDate(newDate);
													} else {
														const newDate = new Date(returnDate);
														newDate.setHours(h);
														newDate.setMinutes(0);
														setReturnDate(newDate);
													}
												}}
												className={`py-3 rounded-full border items-center justify-center ${
													isSelected
														? "bg-teal-900 border-teal-900"
														: "bg-white border-gray-200"
												} ${isDisabled ? "opacity-50" : ""}`}
												style={{ width: 80 }}
											>
												<ThemedText
													className={`text-[15px] font-plus-jakarta-bold ${
														isSelected
															? "!text-white"
															: isDisabled
																? "!text-gray-300"
																: "!text-gray-800"
													}`}
												>
													{t}
												</ThemedText>
											</Pressable>
										);
									})}
								</View>
							</ScrollView>
						</View>

						<View className="px-6 pt-4">
							<MainButton
								title="Conferma"
								onPress={() => setShowCalendar(false)}
							/>
						</View>
					</View>
				</BottomSheet>

				{/* Passengers View (replaced Modal to avoid nesting issues) */}
				{showPassengers && (
					<View
						className="absolute inset-0 bg-white z-50"
						style={{ paddingTop: insets.top }}
					>
						<ModalHeader
							title="Configura passeggeri"
							onClose={() => setShowPassengers(false)}
						/>

						<ScrollView className="flex-1 px-5">
							<Pressable
								onPress={() => setIsPassengerExpanded(!isPassengerExpanded)}
								className="flex-row items-start py-6"
							>
								<View className="h-12 w-12 items-center justify-center rounded-full bg-[#e6f3f3]">
									<ThemedText className="text-[14px] font-plus-jakarta-bold !text-teal-900 uppercase">
										{getInitials(USER_DATA.firstName, USER_DATA.lastName)}
									</ThemedText>
								</View>
								<View className="ml-4 flex-1">
									<View className="flex-row items-center justify-between">
										<ThemedText className="text-[16px] font-plus-jakarta-bold !text-gray-950 uppercase">
											{USER_DATA.firstName} {USER_DATA.lastName}
										</ThemedText>
										<Icon
											name={isPassengerExpanded ? "expand_less" : "expand_more"}
											size={24}
											className="!text-gray-950"
										/>
									</View>
									<ThemedText className="text-[14px] font-plus-jakarta-medium !text-gray-500 mt-1">
										Adulto · CF/X-GO: {USER_DATA.loyaltyCode}
									</ThemedText>
									{!isPassengerExpanded && (
										<ThemedText className="text-[14px] font-plus-jakarta-medium !text-gray-500 mt-0.5">
											{USER_DATA.email} · {USER_DATA.phone}
										</ThemedText>
									)}
								</View>
							</Pressable>

							{isPassengerExpanded && (
								<View className="mb-6">
									<View className="flex-row items-center justify-between mb-4">
										<ThemedText className="text-[15px] font-plus-jakarta-bold !text-gray-950">
											Dettagli passeggero
										</ThemedText>
										<ThemedText className="text-[14px] font-plus-jakarta-bold !text-teal-800">
											Svuota campi
										</ThemedText>
									</View>

									<View className="gap-3">
										{[
											{ label: "Nome*", value: USER_DATA.firstName },
											{ label: "Cognome*", value: USER_DATA.lastName },
											{
												label: "CartaFRECCIA/X-GO",
												value: USER_DATA.loyaltyCode,
											},
											{ label: "Data di nascita", value: USER_DATA.birthDate },
											{ label: "Email", value: USER_DATA.email },
											{ label: "Telefono", value: USER_DATA.phone },
										].map((field, idx) => (
											<View
												key={idx}
												className="rounded-lg border border-gray-200 p-3 bg-white flex-row items-center justify-between"
											>
												<View>
													<ThemedText className="text-[11px] font-plus-jakarta-medium !text-gray-400 mb-0.5">
														{field.label}
													</ThemedText>
													<ThemedText className="text-[15px] font-plus-jakarta-bold !text-gray-950 uppercase">
														{field.value}
													</ThemedText>
												</View>
												<Icon
													name="cancel"
													size={20}
													className="!text-gray-300"
												/>
											</View>
										))}
									</View>
									<ThemedText className="text-[12px] font-plus-jakarta-medium !text-gray-400 mt-4">
										* Dati obbligatori
									</ThemedText>
								</View>
							)}

							{/* Discount Code Box */}
							<Pressable
								onPress={() => setShowDiscountSheet(true)}
								className="rounded-lg border border-gray-100 p-4 bg-white flex-row items-center justify-between border-dashed"
							>
								<View className="flex-row items-center">
									<Icon
										name="percent_discount"
										size={24}
										className="!text-teal-800"
									/>
									<ThemedText className="ml-3 text-[15px] font-plus-jakarta-semibold !text-teal-900">
										Aggiungi buono sconto
									</ThemedText>
								</View>
								<Icon name="add" size={24} className="!text-teal-800" />
							</Pressable>
						</ScrollView>

						<View className="px-6 py-6 border-t border-gray-100 bg-white">
							<MainButton
								title="Conferma"
								onPress={() => setShowPassengers(false)}
							/>
						</View>
					</View>
				)}

				{/* Tipologia Viaggio Bottom Sheet */}
				<BottomSheet
					isVisible={showTravelType}
					onClose={() => setShowTravelType(false)}
					title="Tipologia viaggio"
				>
					<View>
						{["Principali Soluzioni", "Frecce", "Intercity", "Regionali"].map(
							(type) => {
								const isSelected = travelType === type;
								return (
									<Pressable
										key={type}
										onPress={() => {
											setTravelType(type);
											setShowTravelType(false);
										}}
										className="flex-row items-center justify-between h-14 border-b border-gray-100"
									>
										<View className="flex-row items-center">
											<ThemedText
												className={`text-[15px] !text-gray-950 ${
													isSelected
														? "font-plus-jakarta-bold"
														: "font-plus-jakarta-medium"
												}`}
											>
												{type}
											</ThemedText>
											{type === "Principali Soluzioni" && (
												<Icon
													name="info"
													size={18}
													className="ml-2 !text-gray-400"
												/>
											)}
										</View>
										{isSelected && (
											<View className="h-7 w-7 rounded-full items-center justify-center bg-teal-50">
												<Icon
													name="check"
													size={18}
													className="!text-teal-900"
												/>
											</View>
										)}
									</Pressable>
								);
							},
						)}
					</View>
				</BottomSheet>

				{/* Passengers Bottom Sheet */}
				<BottomSheet
					isVisible={showPassengersSheet}
					onClose={() => setShowPassengersSheet(false)}
					title="Passeggeri"
				>
					{/* Passengers Rows */}
					<View className="mb-8">
						<View className="flex-row items-center justify-between py-7 border-b border-gray-100">
							<ThemedText className="text-[16px] font-plus-jakarta-medium !text-gray-950">
								Adulto
							</ThemedText>
							<View className="flex-row items-center gap-4">
								<Pressable
									onPress={() => setAdults(Math.max(0, adults - 1))}
									className={`h-10 w-10 items-center justify-center rounded-full border ${
										adults <= 0 ? "border-gray-100" : "border-gray-200"
									}`}
								>
									<Icon
										name="remove"
										size={24}
										className={
											adults <= 0 ? "!text-gray-200" : "!text-gray-950"
										}
									/>
								</Pressable>
								<ThemedText className="text-[16px] font-plus-jakarta-bold w-4 text-center">
									{adults}
								</ThemedText>
								<Pressable
									onPress={() => setAdults(adults + 1)}
									className="h-10 w-10 items-center justify-center rounded-full border border-gray-200"
								>
									<Icon name="add" size={24} className="!text-gray-950" />
								</Pressable>
							</View>
						</View>

						<View className="flex-row items-center justify-between py-7 border-b border-gray-100">
							<ThemedText className="text-[16px] font-plus-jakarta-medium !text-gray-950">
								Ragazzo
							</ThemedText>
							<View className="flex-row items-center gap-4">
								<Pressable
									onPress={() => setYouths(Math.max(0, youths - 1))}
									className={`h-10 w-10 items-center justify-center rounded-full border ${
										youths <= 0 ? "border-gray-100" : "border-gray-200"
									}`}
								>
									<Icon
										name="remove"
										size={24}
										className={
											youths <= 0 ? "!text-gray-200" : "!text-gray-950"
										}
									/>
								</Pressable>
								<ThemedText className="text-[16px] font-plus-jakarta-bold w-4 text-center">
									{youths}
								</ThemedText>
								<Pressable
									onPress={() => setYouths(youths + 1)}
									className="h-10 w-10 items-center justify-center rounded-full border border-gray-200"
								>
									<Icon name="add" size={24} className="!text-gray-950" />
								</Pressable>
							</View>
						</View>

						<View className="flex-row items-center justify-between py-7 border-b border-gray-100">
							<View className="flex-row items-center">
								<ThemedText className="text-[16px] font-plus-jakarta-medium !text-gray-950">
									Bambino
								</ThemedText>
								<ThemedText className="ml-2 text-[14px] font-plus-jakarta-medium !text-gray-500">
									(0-4 anni non compiuti)
								</ThemedText>
							</View>
							<ThemedText className="text-[16px] font-plus-jakarta-medium !text-gray-400">
								Gratuito
							</ThemedText>
						</View>
					</View>

					<Pressable className="mb-8">
						<ThemedText className="text-[14px] font-plus-jakarta-medium !text-gray-950">
							Vedi{" "}
							<ThemedText className="!text-red-700 underline">
								agevolazione ragazzi
							</ThemedText>
						</ThemedText>
					</Pressable>

					<MainButton
						title={`Conferma ${adults + youths} ${
							adults + youths === 1 ? "passeggero" : "passeggeri"
						}`}
						onPress={() => adults + youths > 0 && setShowPassengersSheet(false)}
						disabled={adults + youths === 0}
						className="mb-8"
					/>
				</BottomSheet>
				{/* Discount Code Bottom Sheet */}
				<BottomSheet
					isVisible={showDiscountSheet}
					onClose={() => setShowDiscountSheet(false)}
					title="Aggiungi buono sconto"
				>
					<View>
						<View className="bg-blue-50/50 rounded-lg p-4 mb-6 flex-row items-start">
							<Icon name="info" size={20} className="!text-blue-900 mt-0.5" />
							<ThemedText className="ml-3 flex-1 text-[13px] font-plus-jakarta-medium !text-blue-950 !leading-snug">
								Inserisci tutti i caratteri del Buono Sconto, compresi gli 0 e
								le lettere Maiuscole
							</ThemedText>
						</View>

						<View className="rounded-lg border border-gray-200 p-4 mb-8 h-16 justify-center">
							<ThemedText className="text-[15px] font-plus-jakarta-medium !text-gray-400">
								Codice buono sconto
							</ThemedText>
						</View>

						<MainButton
							title="Conferma"
							onPress={() => setShowDiscountSheet(false)}
						/>
					</View>
				</BottomSheet>
			</View>
	);
}
