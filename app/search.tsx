import { BottomSheet } from "@/components/modals/bottom-sheet";
import { SearchListItem } from "@/components/search/search-list-item";
import { SectionHeader } from "@/components/search/section-header";
import { ThemedText } from "@/components/themed-text";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { MainButton } from "@/components/ui/main-button";
import {
	RECENT_SEARCHES,
	SAVED_SEARCHES,
	STATIONS,
} from "@/constants/stations";
import { USER_DATA, getInitials } from "@/constants/user";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
	Alert,
	Button,
	Dimensions,
	FlatList,
	Keyboard,
	LogBox,
	Platform,
	Pressable,
	ScrollView,
	Switch,
	TextInput,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import Animated, {
	SlideInDown,
	SlideOutDown,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

LogBox.ignoreLogs([
	"VirtualizedLists should never be nested inside plain ScrollViews",
]);

// Expo UI (for iOS Liquid Glass buttons)
import { Button as ExpoButton, Host } from "@expo/ui/swift-ui";
import {
	buttonBorderShape,
	buttonStyle,
	controlSize,
	disabled,
	labelStyle,
	tint,
} from "@expo/ui/swift-ui/modifiers";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

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
		style={{ height: 56 }}
		className={`w-full rounded-lg border border-gray-200 px-4 py-2 bg-white justify-center ${
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
			<View
				className="flex-row items-center justify-between"
				style={{ height: "100%" }}
			>
				<View className="flex-1 justify-center">
					<ThemedText
						className="text-[13px] font-plus-jakarta-medium !text-gray-500"
						numberOfLines={1}
					>
						{label}
					</ThemedText>
					<ThemedText
						className="text-[14px] font-plus-jakarta-semibold !text-gray-950 mt-1"
						numberOfLines={1}
					>
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
						<Icon
							name="delete"
							size={20}
							className="!text-rose-600 -mt-6 -mr-2"
						/>
					</Pressable>
				)}
			</View>
		)}
	</Pressable>
);

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

export default function SearchScreen() {
	const params = useLocalSearchParams();
	const initialFrom = (params.initialFrom as string) || "";
	const initialTo = (params.initialTo as string) || "";
	const insets = useSafeAreaInsets();
	const [fromText, setFromText] = useState(initialFrom);
	const [toText, setToText] = useState(initialTo);
	const [activeInput, setActiveInput] = useState<"from" | "to" | null>(null);
	const [lastActiveInput, setLastActiveInput] = useState<"from" | "to">("from");

	useEffect(() => {
		if (activeInput) {
			setLastActiveInput(activeInput);
		}
	}, [activeInput]);

	useEffect(() => {
		setFromText(initialFrom);
		setToText(initialTo);
	}, [initialFrom, initialTo]);



	// Mock modal states
	const [showCalendar, setShowCalendar] = useState(false);
	const [showPassengers, setShowPassengers] = useState(false);
	const [showPassengersSheet, setShowPassengersSheet] = useState(false);
	const [showTravelType, setShowTravelType] = useState(false);
	const [travelType, setTravelType] = useState("Tutte le soluzioni");
	const [isPassengerExpanded, setIsPassengerExpanded] = useState(false);
	const [adults, setAdults] = useState(1);
	const [youths, setYouths] = useState(0);
	const [children, setChildren] = useState(0);
	const [hasDiscount, setHasDiscount] = useState(false);
	const [discountCodeText, setDiscountCodeText] = useState("");
	const [isDiscountFocused, setIsDiscountFocused] = useState(false);

	const purchaseTypes = ["Biglietto", "Abbonamento", "Carnet", "Carta regalo"];
	const [purchaseType, setPurchaseType] = useState("Biglietto");
	const [showPurchaseTypeSheet, setShowPurchaseTypeSheet] = useState(false);
	const isSubscriptionOrCarnet =
		purchaseType === "Abbonamento" || purchaseType === "Carnet";

	const hourScrollRef = useRef<FlatList>(null);
	const fromInputRef = useRef<TextInput>(null);
	const toInputRef = useRef<TextInput>(null);
	const discountInputRef = useRef<TextInput>(null);

	const chevronRotation = useSharedValue(0);
	useEffect(() => {
		chevronRotation.value = withTiming(showPurchaseTypeSheet ? -180 : 0, {
			duration: 250,
		});
	}, [showPurchaseTypeSheet]);

	const chevronAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ rotate: `${chevronRotation.value}deg` }],
		};
	});

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

	const [noChanges, setNoChanges] = useState(false);
	const [bike, setBike] = useState(false);
	const [hasReturn, setHasReturn] = useState(false);

	useEffect(() => {
		const timeout = setTimeout(() => {
			fromInputRef.current?.focus();
		}, 300);
		return () => clearTimeout(timeout);
	}, []);

	// Date selection states
	const [activeCalendarTab, setActiveCalendarTab] = useState<
		"andata" | "ritorno"
	>("andata");
	const [departureDate, setDepartureDate] = useState(() => new Date());
	const [returnDate, setReturnDate] = useState(() => {
		const d = new Date();
		d.setHours(d.getHours() + 1);
		return d;
	});

	const [currentMonth, setCurrentMonth] = useState(new Date());

	// Tracking per abilitare/disabilitare pulsante Salva
	const [initialCalendarState, setInitialCalendarState] = useState<{
		departureDate: string;
		returnDate: string;
		hasReturn: boolean;
	} | null>(null);

	useEffect(() => {
		if (!showCalendar) {
			setInitialCalendarState(null);
		}
	}, [showCalendar]);

	const openCalendar = (tab: "andata" | "ritorno", isAddReturn = false) => {
		setInitialCalendarState({
			departureDate: departureDate.toISOString(),
			returnDate: returnDate.toISOString(),
			hasReturn: hasReturn,
		});

		setActiveCalendarTab(tab);

		if (isAddReturn) {
			const next = new Date(departureDate);
			next.setHours(next.getHours() + 1);
			setReturnDate(next);
			setHasReturn(true);
			setCurrentMonth(departureDate);
		} else {
			setCurrentMonth(tab === "andata" ? departureDate : returnDate);
		}

		setShowCalendar(true);
	};

	const isSameDateToMinutes = (date1: string | Date, date2: string | Date) => {
		const d1 = new Date(date1);
		const d2 = new Date(date2);
		return (
			d1.getFullYear() === d2.getFullYear() &&
			d1.getMonth() === d2.getMonth() &&
			d1.getDate() === d2.getDate() &&
			d1.getHours() === d2.getHours() &&
			d1.getMinutes() === d2.getMinutes()
		);
	};

	const hasCalendarChanges =
		initialCalendarState !== null &&
		(initialCalendarState.hasReturn !== hasReturn ||
			!isSameDateToMinutes(initialCalendarState.departureDate, departureDate) ||
			(hasReturn &&
				!isSameDateToMinutes(initialCalendarState.returnDate, returnDate)));

	const handleCancelCalendar = () => {
		if (initialCalendarState) {
			setDepartureDate(new Date(initialCalendarState.departureDate));
			setReturnDate(new Date(initialCalendarState.returnDate));
			setHasReturn(initialCalendarState.hasReturn);
		}
		setShowCalendar(false);
	};

	const handleCancelPress = () => {
		if (hasCalendarChanges) {
			Alert.alert(
				"Cancellare le modifiche?",
				"Le modifiche al calendario non verranno salvate.",
				[
					{ text: "Annulla", style: "cancel" },
					{
						text: "Cancella modifiche",
						style: "destructive",
						onPress: handleCancelCalendar,
					},
				],
				{ cancelable: true },
			);
		} else {
			handleCancelCalendar();
		}
	};

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

	// Rest of component...

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
			setTimeout(() => {
				hourScrollRef.current?.scrollToOffset({
					offset: h * 88,
					animated: true,
				});
			}, 400);
		}
	}, [showCalendar, activeCalendarTab]);

	const handleClose = () => {
		router.back();
	};

	const effectiveInput = activeInput || lastActiveInput;

	const filteredStations = STATIONS.filter((s) => {
		const text = effectiveInput === "from" ? fromText : toText;
		return text.length > 0 && s.name.toLowerCase().includes(text.toLowerCase());
	});

	const showSuggestions =
		(effectiveInput === "from" ? fromText : toText).length > 0;

	const handleStationSelect = (station: string) => {
		if (activeInput === "from") {
			setFromText(station);
			if (!toText) {
				setActiveInput("to");
				setTimeout(() => toInputRef.current?.focus(), 100);
			} else {
				setActiveInput(null);
				Keyboard.dismiss();
			}
		} else {
			setToText(station);
			if (!fromText) {
				setActiveInput("from");
				setTimeout(() => fromInputRef.current?.focus(), 100);
			} else {
				setActiveInput(null);
				Keyboard.dismiss();
			}
		}
	};

	const handleRouteSelect = (from: string, to: string) => {
		setFromText(from);
		setToText(to);
		setActiveInput(null);
		Keyboard.dismiss();
	};

	return (
		<TouchableWithoutFeedback
			onPress={() => {
				Keyboard.dismiss();
				setActiveInput(null);
				setShowTravelType(false);
			}}
			accessible={false}
		>
			<View style={{ flex: 1, backgroundColor: "white" }}>
				{/* Overlay invisibile per chiudere la dropdown cliccando fuori */}
				{showPurchaseTypeSheet && (
					<Pressable
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							zIndex: 90,
							elevation: 90,
						}}
						onPress={() => setShowPurchaseTypeSheet(false)}
					/>
				)}

				<View style={{ flex: 1, paddingTop: insets.top }} className="px-5">
					{/* Header Details */}
					<View
						className="relative z-[100] -mx-5"
						style={{ elevation: 100, zIndex: 100 }}
					>
						<View className="flex-row items-center justify-between px-5 pt-1 pb-2">
							<View className="flex-row items-center">
								<ThemedText className="text-[22px] font-plus-jakarta-bold !text-gray-950">
									Acquista{" "}
								</ThemedText>
								<Pressable
									className="flex-row items-center border-b-2 border-teal-800 pt-[2px]"
									onPress={() =>
										setShowPurchaseTypeSheet(!showPurchaseTypeSheet)
									}
								>
									<ThemedText className="text-[22px] font-plus-jakarta-bold !text-teal-800 lowercase">
										{purchaseType}
									</ThemedText>
									<Animated.View style={chevronAnimatedStyle}>
										<Icon
											name="expand_more"
											size={24}
											className="!text-teal-800 ml-1"
										/>
									</Animated.View>
								</Pressable>
							</View>
							<Pressable onPress={handleClose} className="p-2 -mr-2">
								<Icon
									name="close"
									size={28}
									className="!text-gray-800"
									weight={300}
								/>
							</Pressable>
						</View>

						<DropdownMenu
							isVisible={showPurchaseTypeSheet}
							className="top-[100%] left-32 min-w-[200px]"
						>
							<View className="py-2">
								{purchaseTypes.map((type) => (
									<Pressable
										key={type}
										onPress={() => {
											setPurchaseType(type);
											setShowPurchaseTypeSheet(false);
										}}
										className="flex-row items-center justify-between px-4 py-3"
									>
										<ThemedText
											className={`text-[15px] ${purchaseType === type ? "font-plus-jakarta-bold !text-gray-950" : "font-plus-jakarta-medium !text-gray-950"}`}
										>
											{type}
										</ThemedText>
										<Icon
											name="check"
											size={20}
											className={`!text-teal-800 ${purchaseType === type ? "opacity-100" : "opacity-0"}`}
										/>
									</Pressable>
								))}
							</View>
						</DropdownMenu>
					</View>

					<ScrollView
						className="pt-4 flex-1 -mx-5 px-5"
						showsVerticalScrollIndicator={false}
						keyboardShouldPersistTaps="handled"
						onScrollBeginDrag={() => {
							setShowTravelType(false);
							Keyboard.dismiss();
						}}
					>
						<View
							className="flex-col gap-10"
							style={{ zIndex: 200, elevation: 200 }}
						>
							{/* Route Selector Group */}
							<View className="relative flex-col gap-2" style={{ zIndex: 200 }}>
								<ThemedText className="text-[16px] font-plus-jakarta-bold !text-teal-800">
									Dove{" "}
									{!isSubscriptionOrCarnet && (
										<ThemedText className="text-[16px] font-plus-jakarta-bold !text-teal-800">
											e quando
										</ThemedText>
									)}
								</ThemedText>
								<View className="flex-col gap-2">
									<View className="rounded-lg border border-gray-200 bg-white flex-row items-center px-4 h-[56px] overflow-visible">
										<Pressable
											className="flex-1 justify-center"
											onPress={() => {
												setActiveInput("from");
												fromInputRef.current?.focus();
											}}
										>
											{(activeInput === "from" || fromText.length > 0) && (
												<ThemedText className="text-[13px] font-plus-jakarta-medium !text-gray-500">
													Partenza
												</ThemedText>
											)}
											<View
												className={`relative w-full ${
													activeInput === "from" || fromText.length > 0
														? "mt-1"
														: ""
												}`}
											>
												<TextInput
													ref={fromInputRef}
													className={`w-full text-[14px] text-gray-950 p-0 m-0 ${
														fromText
															? "font-plus-jakarta-semibold"
															: "font-plus-jakarta-medium"
													} ${activeInput !== "from" && fromText ? "opacity-0" : "opacity-100"}`}
													placeholder={
														activeInput === "from" || fromText.length > 0
															? ""
															: "Partenza"
													}
													placeholderTextColor="#6b7280"
													value={fromText}
													onChangeText={setFromText}
													onFocus={() => setActiveInput("from")}
												/>
												{activeInput !== "from" && fromText ? (
													<View
														pointerEvents="none"
														className="absolute inset-0 justify-center"
													>
														<ThemedText
															numberOfLines={1}
															className="text-[14px] font-plus-jakarta-semibold !text-gray-950"
														>
															{fromText}
														</ThemedText>
													</View>
												) : null}
											</View>
										</Pressable>

										<Pressable
											onPress={() => {
												const temp = fromText;
												setFromText(toText);
												setToText(temp);
											}}
											className="h-10 w-10 bg-teal-800/10 border border-teal-800/20 rounded-full items-center justify-center mx-2 z-50"
										>
											<Icon
												name="swap_horiz"
												size={24}
												className="!text-teal-800"
											/>
										</Pressable>

										<Pressable
											className="flex-1 justify-center ml-2"
											onPress={() => {
												setActiveInput("to");
												toInputRef.current?.focus();
											}}
										>
											{(activeInput === "to" || toText.length > 0) && (
												<ThemedText className="text-[13px] font-plus-jakarta-medium !text-gray-500">
													Arrivo
												</ThemedText>
											)}
											<View
												className={`relative w-full ${
													activeInput === "to" || toText.length > 0
														? "mt-1"
														: ""
												}`}
											>
												<TextInput
													ref={toInputRef}
													className={`w-full text-[14px] text-left text-gray-950 p-0 m-0 ${
														toText
															? "font-plus-jakarta-semibold"
															: "font-plus-jakarta-medium"
													} ${activeInput !== "to" && toText ? "opacity-0" : "opacity-100"}`}
													placeholder={
														activeInput === "to" || toText.length > 0
															? ""
															: "Arrivo"
													}
													placeholderTextColor="#6b7280"
													value={toText}
													onChangeText={setToText}
													onFocus={() => setActiveInput("to")}
												/>
												{activeInput !== "to" && toText ? (
													<View
														pointerEvents="none"
														className="absolute inset-0 justify-center"
													>
														<ThemedText
															numberOfLines={1}
															className="text-[14px] font-plus-jakarta-semibold !text-gray-950"
														>
															{toText}
														</ThemedText>
													</View>
												) : null}
											</View>
										</Pressable>
									</View>
									{!isSubscriptionOrCarnet && (
										<View className="flex-row gap-2">
											<View className="flex-1">
												<SearchOptionCard
													label="Andata"
													value={formatDate(departureDate)}
													onPress={() => openCalendar("andata")}
												/>
											</View>
											<View className="flex-1">
												{!hasReturn ? (
													<SearchOptionCard
														label="Aggiungi ritorno"
														value=""
														isAdd
														onPress={() => openCalendar("ritorno", true)}
													/>
												) : (
													<SearchOptionCard
														label="Ritorno"
														value={formatDate(returnDate)}
														hasCancel
														onCancel={() => setHasReturn(false)}
														onPress={() => openCalendar("ritorno")}
													/>
												)}
											</View>
										</View>
									)}
								</View>

								{/* Dropdown Suggestions */}
								<DropdownMenu
									isVisible={!!activeInput}
									className="top-[100%] mt-2 left-0 right-0"
								>
									{showSuggestions ? (
										<FlatList
											data={filteredStations}
											keyExtractor={(item, index) => `${item}-${index}`}
											showsVerticalScrollIndicator={false}
											keyboardShouldPersistTaps="handled"
											contentContainerStyle={{
												paddingHorizontal: 16,
												paddingTop: 12,
												paddingBottom: 4,
											}}
											initialNumToRender={20}
											maxToRenderPerBatch={20}
											windowSize={5}
											ListHeaderComponent={
												<SectionHeader title="SUGGERIMENTI" />
											}
											ListEmptyComponent={
												<View className="py-6 items-center justify-center">
													<ThemedText className="text-[14px] font-plus-jakarta !text-gray-400 text-center">
														Nessuna stazione corrispondente
													</ThemedText>
												</View>
											}
											renderItem={({ item, index }) => (
												<SearchListItem
													iconName="train"
													text={item.name}
													showBorder={index < filteredStations.length - 1}
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
											contentContainerStyle={{
												paddingHorizontal: 16,
												paddingTop: 8,
												paddingBottom: 16,
											}}
											initialNumToRender={20}
											maxToRenderPerBatch={20}
											windowSize={5}
											ListHeaderComponent={
												<View className="pb-4">
													{/* Current Location */}
													<SearchListItem
														iconName="my_location"
														text="Milano Bovisa Politecnico"
														className="!px-0"
														weight={300}
														onPress={() =>
															handleStationSelect("Milano Bovisa Politecnico")
														}
													/>

													{/* Saved Searches */}
													<View className="mt-4">
														<SectionHeader title="TRATTE SALVATE" />
														{SAVED_SEARCHES.map((item, index) => {
															const route = `${item.from} - ${item.to}`;
															return (
																<SearchListItem
																	key={index}
																	iconName="route"
																	secondaryIconName="bookmark"
																	text={route}
																	//className="!px-0"
																	weight={300}
																	onPress={() =>
																		handleRouteSelect(item.from, item.to)
																	}
																/>
															);
														})}
													</View>

													{/* Last Searches */}
													<View className="mt-4">
														<SectionHeader title="ULTIME RICERCHE" />
														{RECENT_SEARCHES.map((item, index) => (
															<SearchListItem
																key={index}
																text={`${item.from} - ${item.to}`}
																iconName="schedule"
																weight={300}
																onPress={() =>
																	handleRouteSelect(item.from, item.to)
																}
															/>
														))}
													</View>

													<View className="mt-4">
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
								</DropdownMenu>
							</View>

							{/* Quick Options Grid */}
							{!isSubscriptionOrCarnet && (
								<View className="flex-col gap-2">
									<ThemedText className="text-[16px] font-plus-jakarta-bold !text-teal-800">
										Passeggeri e sconti
									</ThemedText>

									<View className="flex-row gap-2">
										<View className="flex-1">
											<SearchOptionCard
												label="Passeggeri"
												value={`${adults > 0 ? `${adults} adult${adults > 1 ? "i" : "o"}` : ""}${
													youths > 0
														? ` ${youths} ragazz${youths > 1 ? "i" : "o"}`
														: ""
												}${
													children > 0
														? ` ${children} bambin${children > 1 ? "i" : "o"}`
														: ""
												}`.trim()}
												onPress={() => setShowPassengersSheet(true)}
											/>
										</View>
										<View className="flex-1">
											<View className="rounded-lg border border-gray-200 bg-white flex-row items-center px-4 h-[56px] overflow-visible">
												<Pressable
													className="flex-1 justify-center"
													onPress={() => {
														setIsDiscountFocused(true);
														discountInputRef.current?.focus();
													}}
												>
													<ThemedText className="text-[13px] font-plus-jakarta-medium !text-gray-500">
														Buono sconto
													</ThemedText>
													<View className="relative w-full mt-1">
														<TextInput
															ref={discountInputRef}
															className={`w-full text-[14px] text-gray-950 p-0 m-0 ${
																discountCodeText
																	? "font-plus-jakarta-semibold"
																	: "font-plus-jakarta-medium"
															}`}
															placeholder="Inserisci codice"
															placeholderTextColor="#6b728090"
															value={discountCodeText}
															onChangeText={setDiscountCodeText}
															onFocus={() => setIsDiscountFocused(true)}
															onBlur={() => setIsDiscountFocused(false)}
															onSubmitEditing={() =>
																setHasDiscount(
																	discountCodeText.trim().length > 0,
																)
															}
															autoCapitalize="characters"
															autoCorrect={false}
														/>
														{!isDiscountFocused && discountCodeText ? (
															<View
																pointerEvents="none"
																className="absolute inset-0 justify-center"
															>
																<ThemedText
																	numberOfLines={1}
																	className="text-[14px] font-plus-jakarta-semibold !text-gray-950"
																>
																	{discountCodeText}
																</ThemedText>
															</View>
														) : null}
													</View>
												</Pressable>
												{discountCodeText.length > 0 && (
													<Pressable
														onPress={() => {
															setDiscountCodeText("");
															setHasDiscount(false);
															setIsDiscountFocused(false);
														}}
														className="pl-2"
													>
														<Icon
															name="delete"
															size={20}
															className="!text-rose-600 -mt-6 -mr-2"
														/>
													</Pressable>
												)}
											</View>
										</View>
									</View>
								</View>
							)}

							{/* Switches Section */}
							<View className="flex-col gap-2">
								<ThemedText className="text-[16px] font-plus-jakarta-bold !text-teal-800">
									Opzioni di viaggio
								</ThemedText>
								{!isSubscriptionOrCarnet && (
									<View
										className="rounded-lg border border-gray-200 bg-white"
										style={{ zIndex: 100, elevation: 100 }}
									>
										<View style={{ zIndex: 100 }}>
											<Pressable
												onPress={() => setShowTravelType(!showTravelType)}
												className="min-h-[50px] flex-row items-center justify-between p-3 pl-4 relative"
											>
												<ThemedText className="text-[14px] font-plus-jakarta-semibold !text-gray-950">
													Mostra
												</ThemedText>
												<View className="flex-row items-center gap-1">
													<ThemedText className="text-[14px] font-plus-jakarta-medium !text-gray-950">
														{travelType}
													</ThemedText>
													<Animated.View style={travelTypeChevronAnimatedStyle}>
														<Icon
															name="expand_more"
															size={20}
															weight={300}
															className="!text-gray-950 -mb-0.5"
														/>
													</Animated.View>
												</View>
											</Pressable>
											<DropdownMenu
												isVisible={showTravelType}
												className="top-[100%] right-2 min-w-[200px]"
											>
												<View className="py-2">
													{[
														"Tutte le soluzioni",
														"Frecce",
														"Intercity",
														"Regionali",
													].map((type) => (
														<Pressable
															key={type}
															onPress={() => {
																setTravelType(type);
																setShowTravelType(false);
															}}
															className="flex-row items-center justify-between px-4 py-3"
														>
															<ThemedText
																className={`text-[15px] ${travelType === type ? "font-plus-jakarta-semibold !text-gray-950" : "font-plus-jakarta-medium !text-gray-500"}`}
															>
																{type}
															</ThemedText>
															<Icon
																name="check"
																size={20}
																className={`!text-teal-800 ${travelType === type ? "opacity-100" : "opacity-0"}`}
															/>
														</Pressable>
													))}
												</View>
											</DropdownMenu>
										</View>

										<View className="h-[1px] bg-gray-100 mx-4" />

										<View className="p-3 pl-4 flex-row items-center justify-between">
											<ThemedText className="text-[14px] font-plus-jakarta-semibold !text-gray-950">
												Solo treni diretti
											</ThemedText>
											<View
												className={
													Platform.OS === "ios"
														? "bg-gray-200 rounded-full"
														: ""
												}
											>
												<Switch
													value={noChanges}
													onValueChange={setNoChanges}
													trackColor={{ false: "#e5e7eb", true: "#005045" }}
													thumbColor={"#ffffff"}
													//className={Platform.OS === "ios" ? "-mr-0.5" : ""}
												/>
											</View>
										</View>

										<View className="h-[1px] bg-gray-100 mx-4" />

										<View className="p-3 pl-4 justify-center">
											<View className="flex-row items-center justify-between">
												<ThemedText className="text-[14px] font-plus-jakarta-semibold !text-gray-950">
													Viaggia con la tua bici
												</ThemedText>
												<View
													className={
														Platform.OS === "ios"
															? "bg-gray-200 rounded-full"
															: ""
													}
												>
													<Switch
														value={bike}
														onValueChange={setBike}
														trackColor={{ false: "#e5e7eb", true: "#005045" }}
														thumbColor={"#ffffff"}
														//className={Platform.OS === "ios" ? "-mr-0.5" : ""}
													/>
												</View>
											</View>
											{bike && (
												<View className="flex-row items-start gap-2 mt-4">
													<Icon
														name="info"
														size={18}
														className="!text-gray-500 -mt-0.5"
														weight={300}
													/>
													<ThemedText className="flex-1 text-[12px] font-plus-jakarta-medium !text-gray-500 !leading-tight">
														Ti verranno mostrate solo le soluzioni di viaggio
														con treni Intercity, Regionali ed Eurocity
														Italia-Svizzera che ammettono il trasporto della
														bici montata.{" "}
														<ThemedText className="!text-teal-800 underline">
															Maggiori info
														</ThemedText>
													</ThemedText>
												</View>
											)}
										</View>
									</View>
								)}
							</View>
						</View>

						{/* Legal Info */}
						<View className="mt-8 flex-row gap-2 pb-8">
							<Icon
								name="info"
								size={18}
								weight={300}
								className="!text-gray-500 -mt-0.5"
							/>
							<ThemedText className="flex-1 text-[12px] font-plus-jakarta-medium !text-gray-500 !leading-tight">
								Prima di procedere con l&apos;acquisto consulta le{" "}
								<ThemedText className="!text-teal-800 underline">
									Modifiche della Circolazione Programmata
								</ThemedText>
							</ThemedText>
						</View>
					</ScrollView>

					<View className="-mx-5 px-5 py-6 bg-white border-t border-gray-100 mt-auto">
						<MainButton
							title="Ricerca viaggio"
							onPress={() => {
								Keyboard.dismiss();
								setActiveInput(null);
								router.push({
									pathname: "/search-results",
									params: {
										from: fromText,
										to: toText,
										dateStr: departureDate.toISOString(),
										noChanges: noChanges ? "true" : "false",
										bike: bike ? "true" : "false",
										travelType: travelType,
										passengerText:
											`${adults > 0 ? `${adults} Adult${adults > 1 ? "i" : "o"}` : ""}${youths > 0 ? ` ${youths} Ragazz${youths > 1 ? "i" : "o"}` : ""}${children > 0 ? ` ${children} Bambin${children > 1 ? "i" : "i"}` : ""}`.trim(),
									},
								});
							}}
							disabled={!fromText || !toText}
							style={{ marginBottom: insets.bottom }}
						/>
					</View>
				</View>

				{/* Calendar Bottom Sheet */}
				<BottomSheet
					isVisible={showCalendar}
					onClose={() => setShowCalendar(false)}
					hideCloseButton={true}
				>
					<View className="flex-row justify-between items-center mb-4 -mx-2 -mt-1 z-50">
						{/* Titolo Centrato */}
						<View
							pointerEvents="none"
							className="absolute left-0 right-0 items-center"
						>
							<ThemedText className="font-plus-jakarta-bold text-xl -mt-1">
								Data e ora
							</ThemedText>
						</View>

						{Platform.OS === "ios" ? (
							<Host matchContents={true}>
								<ExpoButton
									label="Annulla"
									systemImage="xmark"
									modifiers={[
										buttonStyle("glass"),
										controlSize("extraLarge"),
										labelStyle("iconOnly"),
										buttonBorderShape("circle"),
									]}
									onPress={handleCancelPress}
								/>
							</Host>
						) : (
							<Button title="Annulla" onPress={handleCancelPress} />
						)}

						{Platform.OS === "ios" ? (
							<Host matchContents={true}>
								<ExpoButton
									label="Salva"
									//systemImage="checkmark"
									modifiers={[
										buttonStyle("glassProminent"),
										controlSize("extraLarge"),
										labelStyle("iconOnly"),
										//buttonBorderShape("circle"),
										tint("#134E4A"),
										disabled(!hasCalendarChanges),
									]}
									onPress={() => setShowCalendar(false)}
								/>
							</Host>
						) : (
							<Button title="Salva" onPress={() => setShowCalendar(false)} />
						)}
					</View>

					<View className="-mx-6 px-[4px]">
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

												if (newDate < departureDate) {
													const newDeparture = new Date(departureDate);
													newDeparture.setFullYear(newDate.getFullYear());
													newDeparture.setMonth(newDate.getMonth());
													newDeparture.setDate(newDate.getDate());
													if (newDeparture >= newDate) {
														newDeparture.setHours(newDate.getHours() - 1);
														newDeparture.setMinutes(newDate.getMinutes());
													}
													setDepartureDate(newDeparture);
												}
											}
										}
									}}
									className={`w-[14.28%] h-12 items-center justify-center mb-1 relative`}
								>
									{d.day && (
										<>
											{/* Range Background (Serpentina) */}
											{d.isInRange && (
												<View className="absolute inset-y-1 left-0 right-0 bg-teal-800/10" />
											)}
											{d.isStart && !d.isEnd && (
												<View className="absolute inset-y-1 left-1/2 right-0 bg-teal-800/10" />
											)}
											{d.isEnd && !d.isStart && (
												<View className="absolute inset-y-1 left-0 right-1/2 bg-teal-800/10" />
											)}

											<View
												className={`w-10 h-10 items-center justify-center relative z-10 ${
													d.isSelected
														? "rounded-full bg-teal-900"
														: d.isStart || d.isEnd
															? "rounded-full border-2 border-teal-900 bg-white"
															: ""
												} ${d.isPast ? "opacity-50" : ""}`}
											>
												<ThemedText
													className={`text-[13px] font-plus-jakarta-bold ${
														d.isSelected
															? "!text-white"
															: d.isPast
																? "!text-gray-500"
																: "!text-gray-950"
													}`}
												>
													{d.day}
												</ThemedText>
											</View>
										</>
									)}
								</Pressable>
							))}
						</View>

						{/* Selection Tabs */}
						<View className="border-t border-gray-100 mt-12 pt-6 px-4">
							{/* Labels */}
							<View className="flex-row items-center gap-2 mb-2.5 px-1">
								<View style={{ flex: 1 }}>
									<ThemedText className="text-[13px] font-plus-jakarta-medium !text-gray-500">
										Andata
									</ThemedText>
								</View>
								{/* Spazio vuoto per la freccia */}
								<View style={{ width: 20 }} />
								<View
									style={{ flex: 1 }}
									className="flex-row flex-start justify-between items-center"
								>
									<ThemedText className="text-[13px] font-plus-jakarta-medium !text-gray-500">
										Ritorno
									</ThemedText>
									{hasReturn && (
										<Pressable
											onPress={(e) => {
												e.stopPropagation();
												setHasReturn(false);
												setActiveCalendarTab("andata");
											}}
											className="flex-row gap-1 -my-2 items-center bg-rose-600/10 rounded-full py-1 px-2"
										>
											<Icon
												name="delete"
												size={14}
												weight={400}
												className="!text-rose-600"
											/>
											<ThemedText className="text-[11px] font-plus-jakarta-semibold !text-rose-600">
												Rimuovi
											</ThemedText>
										</Pressable>
									)}
								</View>
							</View>
							{/* Cards */}
							<View className="flex-row items-center gap-2">
								{/* Andata */}
								<Pressable
									onPress={() => setActiveCalendarTab("andata")}
									className={`flex-row items-center justify-center gap-2 rounded-xl px-3 border ${
										activeCalendarTab === "andata"
											? "border-teal-800 bg-white"
											: "border-gray-100 bg-gray-50"
									}`}
									style={{ flex: 1, height: 48, alignItems: "center" }}
								>
									<ThemedText className="text-[15px] font-plus-jakarta-semibold !text-gray-950">
										{`${
											["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"][
												departureDate.getDay()
											]
										} ${departureDate.getDate()} ${
											[
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
											][departureDate.getMonth()]
										}`}
									</ThemedText>
									<View className="bg-gray-200 rounded-lg px-2 py-1">
										<ThemedText className="text-[14px] font-plus-jakarta-semibold !text-gray-800">
											{`${departureDate.getHours()}:${departureDate.getMinutes().toString().padStart(2, "0")}`}
										</ThemedText>
									</View>
								</Pressable>

								{/* Freccia — sempre presente, invisibile senza ritorno */}
								<Icon
									name="arrow_forward"
									size={20}
									className="!text-gray-400"
									style={{ opacity: hasReturn ? 1 : 0 }}
								/>

								{/* Ritorno */}
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
									className={`rounded-xl border px-3 flex-row items-center gap-3 ${
										hasReturn
											? activeCalendarTab === "ritorno"
												? "border-teal-800 bg-white"
												: "border-gray-100 bg-gray-50"
											: "border-teal-800 bg-transparent"
									}`}
									style={{
										flex: 1,
										height: 48,
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									{hasReturn ? (
										<>
											<View className="flex-row items-center justify-center gap-2">
												<ThemedText className="text-[15px] font-plus-jakarta-semibold !text-gray-950">
													{`${
														["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"][
															returnDate.getDay()
														]
													} ${returnDate.getDate()} ${
														[
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
														][returnDate.getMonth()]
													}`}
												</ThemedText>
												<View className="bg-gray-200 rounded-lg px-2 py-1">
													<ThemedText className="text-[14px] font-plus-jakarta-semibold !text-gray-800">
														{`${returnDate.getHours()}:${returnDate.getMinutes().toString().padStart(2, "0")}`}
													</ThemedText>
												</View>
											</View>
										</>
									) : (
										<View className="flex-row items-center justify-center gap-1">
											<Icon name="add" size={18} className="!text-teal-800" />
											<ThemedText className="text-[15px] font-plus-jakarta-semibold !text-teal-800">
												Aggiungi
											</ThemedText>
										</View>
									)}
								</Pressable>
							</View>
						</View>

						<View
							className="mt-4 px-0 pt-4 pb-2"
							style={{ width: SCREEN_WIDTH, alignSelf: "center" }}
						>
							<View className="px-5 mb-6">
								<ThemedText className="text-[14px] font-plus-jakarta-medium !text-gray-950">
									{activeCalendarTab === "andata"
										? "Scegli l'orario di andata"
										: "Scegli l'orario di ritorno"}
								</ThemedText>
							</View>
							<FlatList
								ref={hourScrollRef}
								horizontal
								showsHorizontalScrollIndicator={false}
								contentContainerStyle={{
									paddingHorizontal: SCREEN_WIDTH / 2 - 40,
								}}
								data={Array.from({ length: 24 }, (_, i) => i)}
								keyExtractor={(item) => item.toString()}
								ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
								getItemLayout={(_, index) => ({
									length: 80,
									offset: 88 * index,
									index,
								})}
								renderItem={({ item: h }) => {
									const t = `${h}:00`;
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
										if (isToday(returnDate)) {
											isDisabled = h < now.getHours();
										}
									}

									return (
										<Pressable
											disabled={isDisabled}
											onPress={() => {
												if (activeCalendarTab === "andata") {
													const newDate = new Date(departureDate);
													newDate.setHours(h);
													newDate.setMinutes(0);
													setDepartureDate(newDate);

													if (hasReturn && newDate >= returnDate) {
														const newReturn = new Date(newDate);
														newReturn.setHours(newDate.getHours() + 1);
														newReturn.setMinutes(0);
														setReturnDate(newReturn);
													}
												} else {
													const newDate = new Date(returnDate);
													newDate.setHours(h);
													newDate.setMinutes(0);
													setReturnDate(newDate);

													if (newDate <= departureDate) {
														const newDeparture = new Date(departureDate);
														newDeparture.setFullYear(newDate.getFullYear());
														newDeparture.setMonth(newDate.getMonth());
														newDeparture.setDate(newDate.getDate());
														newDeparture.setHours(newDate.getHours() - 1);
														newDeparture.setMinutes(newDate.getMinutes());
														setDepartureDate(newDeparture);
													}
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
								}}
							/>
						</View>
					</View>
				</BottomSheet>

				{/* Passengers View (replaced Modal to avoid nesting issues) */}
				{showPassengers && (
					<Animated.View
						entering={SlideInDown}
						exiting={SlideOutDown}
						className="absolute inset-0 bg-white"
						style={{ paddingTop: insets.top, zIndex: 110, elevation: 110 }}
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
						</ScrollView>

						<View className="px-6 py-6 border-t border-gray-100 bg-white">
							<MainButton
								title="Conferma"
								onPress={() => setShowPassengers(false)}
							/>
						</View>
					</Animated.View>
				)}

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
								Adulti
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
								Ragazzi
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
									Bambini
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
			</View>
		</TouchableWithoutFeedback>
	);
}
