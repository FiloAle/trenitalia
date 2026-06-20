import { BottomSheet } from "@/components/modals/bottom-sheet";
import { SearchListItem } from "@/components/search/search-list-item";
import { SectionHeader } from "@/components/search/section-header";
import { ThemedText } from "@/components/themed-text";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { MainButton } from "@/components/ui/main-button";
import { PageHeader } from "@/components/ui/page-header";
import { TabSelector } from "@/components/ui/tab-selector";
import {
	RECENT_SEARCHES,
	SAVED_SEARCHES,
	STATIONS,
} from "@/constants/stations";
import { USER_DATA, getInitials } from "@/constants/user";
import { SelectionItem, setGlobalSelectionList } from "@/utils/selection-store";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
	Alert,
	Dimensions,
	FlatList,
	Keyboard,
	KeyboardAvoidingView,
	LogBox,
	Modal,
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
		className={`w-full rounded-2xl border px-4 py-2 justify-center ${
			isAdd
				? "flex-row items-center justify-center gap-2 bg-[#F0F7F7] border-[#DCEBEB]"
				: "bg-white border-neutral-200"
		}`}
	>
		{isAdd ? (
			<>
				<Icon name="add" size={20} className="!text-primary-500" />
				<ThemedText className="text-[14px] font-google-sans-semibold !text-primary-500">
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
						className="text-[13px] font-google-sans-medium !text-neutral-500"
						numberOfLines={1}
					>
						{label}
					</ThemedText>
					<ThemedText
						className="text-[14px] font-google-sans-semibold !text-neutral-950 mt-1"
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
				<ThemedText className="flex-1 text-center text-[15px] font-google-sans-bold !text-neutral-950">
					{title}
				</ThemedText>
				<Pressable onPress={onClose} className="p-2">
					<Icon
						name="close"
						size={28}
						className="!text-neutral-800"
						weight={300}
					/>
				</Pressable>
			</>
		) : (
			<>
				<ThemedText className="text-[22px] font-google-sans-bold !text-neutral-950">
					{title}
				</ThemedText>
				<Pressable onPress={onClose} className="p-2">
					<Icon
						name="close"
						size={28}
						className="!text-neutral-800"
						weight={300}
					/>
				</Pressable>
			</>
		)}
	</View>
);

const PassengerInput = ({
	label,
	value,
	onChangeText,
	keyboardType = "default",
	autoCapitalize = "sentences",
	focusedInputId,
	setFocusedInputId,
	inputId,
}: {
	label: string;
	value: string;
	onChangeText: (text: string) => void;
	keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
	autoCapitalize?: "none" | "sentences" | "words" | "characters";
	focusedInputId: string | null;
	setFocusedInputId: (id: string | null) => void;
	inputId: string;
}) => {
	const isFocused = focusedInputId === inputId;
	const hasText = value.length > 0;
	const isActive = isFocused || hasText;
	const inputRef = useRef<TextInput>(null);

	return (
		<View className="flex-1 h-[56px] rounded-2xl border border-neutral-200 px-4 bg-white justify-center overflow-visible">
			<Pressable
				className="w-full flex-1 justify-center"
				onPress={() => {
					setFocusedInputId(inputId);
					inputRef.current?.focus();
				}}
			>
				{isActive && (
					<ThemedText className="text-[13px] font-google-sans-medium !text-neutral-500">
						{label}
					</ThemedText>
				)}
				<View className={`relative w-full ${isActive ? "mt-0.5" : ""}`}>
					<TextInput
						ref={inputRef}
						value={value}
						onChangeText={onChangeText}
						onFocus={() => setFocusedInputId(inputId)}
						onBlur={() => setFocusedInputId(null)}
						className={`w-full text-[14px] text-neutral-950 p-0 m-0 ${
							hasText ? "font-google-sans-semibold" : "font-google-sans-medium"
						} ${!isFocused && hasText ? "opacity-0" : "opacity-100"}`}
						placeholder={isActive ? "" : label}
						placeholderTextColor="#6b7280"
						keyboardType={keyboardType}
						autoCapitalize={autoCapitalize}
					/>
					{!isFocused && hasText && (
						<View
							pointerEvents="none"
							className="absolute inset-0 justify-center"
						>
							<ThemedText
								numberOfLines={1}
								className="text-[14px] font-google-sans-semibold !text-neutral-950"
							>
								{value}
							</ThemedText>
						</View>
					)}
				</View>
			</Pressable>
		</View>
	);
};

export default function SearchScreen() {
	const params = useLocalSearchParams();
	const initialFrom = (params.initialFrom as string) || "";
	const initialTo = (params.initialTo as string) || "";
	const insets = useSafeAreaInsets();
	const [fromText, setFromText] = useState(initialFrom);
	const [toText, setToText] = useState(initialTo);
	const [activeInput, setActiveInput] = useState<"from" | "to" | null>(null);
	const [lastActiveInput, setLastActiveInput] = useState<"from" | "to">("from");
	const [focusedPassengerInputId, setFocusedPassengerInputId] = useState<
		string | null
	>(null);

	useEffect(() => {
		if (activeInput) {
			setLastActiveInput(activeInput);
		}
	}, [activeInput]);

	useEffect(() => {
		setFromText(initialFrom);
		setToText(initialTo);
	}, [initialFrom, initialTo]);

	// Lazy-load @expo/ui/swift-ui only on iOS to avoid SSR/web crashes.
	// We use synchronous require instead of dynamic import() to avoid Metro chunk loading errors on iOS.
	const ExpoUIComponents = useMemo(() => {
		if (Platform.OS === "ios") {
			try {
				const ui = require("@expo/ui/swift-ui");
				const mods = require("@expo/ui/swift-ui/modifiers");
				return { ExpoButton: ui.Button, Host: ui.Host, modifiers: mods };
			} catch (e) {
				return null;
			}
		}
		return null;
	}, []);

	// Mock modal states
	const [showCalendar, setShowCalendar] = useState(false);
	const [showPassengers, setShowPassengers] = useState(false);
	const [showPassengersSheet, setShowPassengersSheet] = useState(false);
	const [showTravelType, setShowTravelType] = useState(false);
	const [showFiltersSheet, setShowFiltersSheet] = useState(false);
	const [travelType, setTravelType] = useState("Tutte");
	const [sortOrder, setSortOrder] = useState("Orario di partenza");
	const [pendingSortOrder, setPendingSortOrder] =
		useState("Orario di partenza");
	const [isPassengerExpanded, setIsPassengerExpanded] = useState(false);
	const formatName = (str: string) =>
		str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

	const [passengersList, setPassengersList] = useState<SelectionItem[]>([
		{
			id: "mock_user",
			itemType: "passenger",
			type: "Adulto",
			name: `${formatName(USER_DATA.firstName)} ${formatName(USER_DATA.lastName)}`,
			isMock: true,
			firstName: formatName(USER_DATA.firstName),
			lastName: formatName(USER_DATA.lastName),
			birthDate: USER_DATA.birthDate,
			loyaltyCode: USER_DATA.loyaltyCode,
			phone: USER_DATA.phone,
			email: USER_DATA.email,
		},
	]);

	const [expandedPassengerId, setExpandedPassengerId] = useState<string | null>(
		null,
	);

	const [showAddPassengerSheet, setShowAddPassengerSheet] = useState(false);
	const [newAdults, setNewAdults] = useState(0);
	const [newYouths, setNewYouths] = useState(0);
	const [newChildren, setNewChildren] = useState(0);

	const adults = passengersList.filter((p) => p.type === "Adulto").length;
	const youths = passengersList.filter((p) => p.type === "Ragazzo").length;
	const children = passengersList.filter((p) => p.type === "Bambino").length;
	const bikes = passengersList.filter((p) => p.type === "Bicicletta").length;
	const animals = passengersList.filter((p) => p.type === "Animale").length;
	const passengerItems = passengersList.filter(
		(p) => p.itemType === "passenger",
	);
	const totalPassengers = passengerItems.length;
	const firstPassengerName =
		passengerItems[0]?.firstName || passengerItems[0]?.lastName
			? `${passengerItems[0]?.firstName || ""} ${passengerItems[0]?.lastName || ""}`.trim()
			: "Passeggero 1";
	const passengerSummary =
		totalPassengers <= 1
			? firstPassengerName
			: `${firstPassengerName} e altri ${totalPassengers - 1}`;
	const hasBike = bikes > 0;
	const hasAnimal = animals > 0;
	const [hasDiscount, setHasDiscount] = useState(false);
	const [discountCodeText, setDiscountCodeText] = useState("");
	const [isDiscountFocused, setIsDiscountFocused] = useState(false);

	const purchaseTypes = ["Biglietto", "Carnet", "Abbonamento"];
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
	const [hasReturn, setHasReturn] = useState(false);

	useEffect(() => {
		if (showFiltersSheet) {
			setPendingSortOrder(sortOrder);
		}
	}, [showFiltersSheet, sortOrder]);

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

	const sortOptions = [
		"Orario di partenza",
		"Orario di arrivo",
		"Durata del viaggio",
		"Prezzo",
	];

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

	const addPassenger = () => {
		setNewAdults(0);
		setNewYouths(0);
		setNewChildren(0);
		setShowAddPassengerSheet(true);
	};

	const addBike = () => {
		setPassengersList((prev) => [
			...prev,
			{
				id: Math.random().toString(),
				itemType: "service",
				type: "Bicicletta",
				name: "Bicicletta",
			},
		]);
	};

	const addAnimal = () => {
		setPassengersList((prev) => [
			...prev,
			{
				id: Math.random().toString(),
				itemType: "service",
				type: "Animale",
				name: "Animale",
			},
		]);
	};

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
				<PageHeader
					title="Acquista"
					showBackButton={true}
					onBack={handleClose}
				/>

				{/* Selettore — fuori dall'header, nel body bianco, come in I miei viaggi */}
				<View className="px-5 pt-5 z-50">
					<TabSelector
						tabs={purchaseTypes}
						activeTab={purchaseType}
						onTabChange={setPurchaseType}
					/>
				</View>
				{/* ===== Fine header ===== */}

				<View style={{ flex: 1 }} className="px-5">
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
								<ThemedText className="text-[16px] font-google-sans-bold !text-primary-500">
									Dove{" "}
									{!isSubscriptionOrCarnet && (
										<ThemedText className="text-[16px] font-google-sans-bold !text-primary-500">
											e quando
										</ThemedText>
									)}
								</ThemedText>
								<View
									className={`${Platform.OS === "web" ? "relative " : ""}flex-col gap-2`}
								>
									<View className="rounded-2xl border border-neutral-200 bg-white flex-row items-center px-4 h-[56px] overflow-visible">
										<Pressable
											className="flex-1 justify-center"
											onPress={() => {
												setActiveInput("from");
												fromInputRef.current?.focus();
											}}
										>
											{(activeInput === "from" || fromText.length > 0) && (
												<ThemedText className="text-[13px] font-google-sans-medium !text-neutral-500">
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
													className={`w-full text-[14px] text-neutral-950 p-0 m-0 ${
														fromText
															? "font-google-sans-semibold"
															: "font-google-sans-medium"
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
															className="text-[14px] font-google-sans-semibold !text-neutral-950"
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
											className="h-10 w-10 bg-[#F0F7F7] border border-[#DCEBEB] rounded-full items-center justify-center mx-2 z-50"
										>
											<Icon
												name="swap_horiz"
												size={24}
												className="!text-primary-500"
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
												<ThemedText className="text-[13px] font-google-sans-medium !text-neutral-500">
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
													className={`w-full text-[14px] text-left text-neutral-950 p-0 m-0 ${
														toText
															? "font-google-sans-semibold"
															: "font-google-sans-medium"
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
															className="text-[14px] font-google-sans-semibold !text-neutral-950"
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
									className="top-[90px] left-0 right-0"
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
													<ThemedText className="text-[14px] font-google-sans-regular !text-neutral-400 text-center">
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
														text="Milano Centrale"
														className="!px-0"
														weight={300}
														onPress={() =>
															handleStationSelect("Milano Centrale")
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
									<ThemedText className="text-[16px] font-google-sans-bold !text-primary-500">
										Passeggeri e servizi
									</ThemedText>
									<Pressable
										onPress={() => setShowPassengersSheet(true)}
										style={{ minHeight: 68 }}
										className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 justify-center"
									>
										<View className="flex-row items-center gap-0.5">
											<Icon
												name="person"
												size={22}
												className="!text-primary-500 -ml-[2px]"
											/>
											<View className="flex-1 flex-row items-center gap-2">
												<ThemedText className="text-[15px] font-google-sans-semibold !text-primary-500">
													{totalPassengers}
												</ThemedText>
												<View className="flex-row items-center gap-1 flex-wrap flex-1">
													<ThemedText
														numberOfLines={1}
														className="text-[15px] font-google-sans-semibold !text-neutral-950"
													>
														{passengerSummary}
													</ThemedText>
													{(hasAnimal || hasBike) && (
														<View className="flex-row items-center gap-1">
															<ThemedText className="text-[15px] font-google-sans-semibold !text-neutral-950">
																+
															</ThemedText>
															{hasAnimal && (
																<Icon
																	name="pet_supplies"
																	size={16}
																	className="!text-neutral-950"
																/>
															)}
															{hasAnimal && hasBike && (
																<ThemedText className="text-[15px] font-google-sans-semibold !text-neutral-950">
																	+
																</ThemedText>
															)}
															{hasBike && (
																<Icon
																	name="pedal_bike"
																	size={16}
																	className="!text-neutral-950"
																/>
															)}
														</View>
													)}
												</View>
											</View>
										</View>
										<View className="mt-0.5">
											<ThemedText className="text-[13px] font-google-sans-medium !text-neutral-500">
												Aggiungi passeggeri, animali e biciclette
											</ThemedText>
										</View>
									</Pressable>
								</View>
							)}
						</View>

						{/* Legal Info */}
						<View className="mt-8 flex-row gap-2 pb-8">
							<Icon
								name="info"
								size={18}
								weight={300}
								className="!text-neutral-500 -mt-0.5"
							/>
							<ThemedText className="flex-1 text-[12px] font-google-sans-medium !text-neutral-500 !leading-tight">
								Prima di procedere con l&apos;acquisto consulta le{" "}
								<ThemedText className="!text-primary-500 underline">
									Modifiche della Circolazione Programmata
								</ThemedText>
							</ThemedText>
						</View>
					</ScrollView>

					<View className="-mx-5 px-5 py-6 bg-white border-t border-neutral-100 mt-auto">
						<View className="flex-row gap-3 items-stretch">
							<Pressable
								onPress={() => {
									Keyboard.dismiss();
									setActiveInput(null);
									setShowTravelType(false);
									setShowFiltersSheet(true);
								}}
								className="h-14 w-14 shrink-0 self-stretch items-center justify-center rounded-2xl bg-white border border-neutral-200"
							>
								<Icon
									name="page_info"
									size={22}
									className="!text-primary-500"
								/>
							</Pressable>
							<MainButton
								title="Ricerca viaggio"
								onPress={() => {
									Keyboard.dismiss();
									setActiveInput(null);
									setGlobalSelectionList(passengersList);
									setTimeout(() => {
										router.push({
											pathname: "/search-results",
											params: {
												from: fromText,
												to: toText,
												dateStr: departureDate.toISOString(),
												noChanges: noChanges ? "true" : "false",
												bike: bikes > 0 ? "true" : "false",
												travelType: travelType,
												sortOrder,
												passengerText:
													`${adults > 0 ? `${adults} Adult${adults > 1 ? "i" : "o"}` : ""}${youths > 0 ? ` ${youths} Ragazz${youths > 1 ? "i" : "o"}` : ""}${children > 0 ? ` ${children} Bambin${children > 1 ? "i" : "i"}` : ""}`.trim(),
												passengerNamesText: passengersList
													.filter((p) => p.itemType === "passenger")
													.map((p, idx) =>
														p.firstName || p.lastName
															? `${p.firstName || ""} ${p.lastName || ""}`.trim()
															: `Passeggero ${idx + 1}`,
													)
													.join(", "),
											},
										});
									}, 50);
								}}
								disabled={!fromText || !toText}
								className="flex-1"
								style={{ marginBottom: insets.bottom }}
							/>
						</View>
					</View>
				</View>

				{/* Calendar Bottom Sheet */}
				<BottomSheet
					isVisible={showCalendar}
					onClose={() => setShowCalendar(false)}
					title="Data e ora"
					heightPercentage={0.9}
				>
					<View className="flex-1 justify-between flex-col pb-2">
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
										className="!text-neutral-950"
										weight={200}
									/>
								</Pressable>
								<ThemedText className="text-[14px] font-google-sans-medium !text-neutral-950 capitalize">
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
										className="!text-neutral-950"
										weight={200}
									/>
								</Pressable>
							</View>

							{/* Days Header */}
							<View className="flex-row px-0 py-2">
								{["LUN", "MAR", "MER", "GIO", "VEN", "SAB", "DOM"].map((d) => (
									<ThemedText
										key={d}
										className="text-[13px] font-google-sans-medium !text-neutral-400 w-[14.28%] text-center"
									>
										{d}
									</ThemedText>
								))}
							</View>

							{/* Days Grid */}
							<View className="px-0 flex-row flex-wrap h-[312px]">
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
													<View className="absolute inset-y-1 left-0 right-0 bg-primary-600/10" />
												)}
												{d.isStart && !d.isEnd && (
													<View className="absolute inset-y-1 left-1/2 right-0 bg-primary-600/10" />
												)}
												{d.isEnd && !d.isStart && (
													<View className="absolute inset-y-1 left-0 right-1/2 bg-primary-600/10" />
												)}

												<View
													className={`w-10 h-10 items-center justify-center relative z-10 ${
														d.isSelected
															? "rounded-full bg-primary-600"
															: d.isStart || d.isEnd
																? "rounded-full border-2 border-primary-600 bg-white"
																: ""
													} ${d.isPast ? "opacity-50" : ""}`}
												>
													<ThemedText
														className={`text-[13px] font-google-sans-bold ${
															d.isSelected
																? "!text-white"
																: d.isPast
																	? "!text-neutral-500"
																	: "!text-neutral-950"
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
							<View className="border-t border-neutral-100 mt-4 pt-4 px-4">
								{/* Labels */}
								<View className="flex-row items-center gap-2 mb-2.5 px-1">
									<View style={{ flex: 1 }}>
										<ThemedText className="text-[13px] font-google-sans-medium !text-neutral-500">
											Andata
										</ThemedText>
									</View>
									{/* Spazio vuoto per la freccia */}
									<View style={{ width: 20 }} />
									<View
										style={{ flex: 1 }}
										className="flex-row flex-start justify-between items-center"
									>
										<ThemedText className="text-[13px] font-google-sans-medium !text-neutral-500">
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
												<ThemedText className="text-[11px] font-google-sans-semibold !text-rose-600">
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
										className={`flex-row items-center justify-center gap-2 rounded-2xl px-3 border ${
											activeCalendarTab === "andata"
												? "border-primary-600 bg-white"
												: "border-neutral-100 bg-neutral-50"
										}`}
										style={{ flex: 1, height: 48, alignItems: "center" }}
									>
										<ThemedText className="text-[15px] font-google-sans-semibold !text-neutral-950">
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
										<View className="bg-neutral-200 rounded-2xl px-2 py-1">
											<ThemedText className="text-[14px] font-google-sans-semibold !text-neutral-800">
												{`${departureDate.getHours()}:${departureDate.getMinutes().toString().padStart(2, "0")}`}
											</ThemedText>
										</View>
									</Pressable>

									{/* Freccia — sempre presente, invisibile senza ritorno */}
									<Icon
										name="arrow_forward"
										size={20}
										className="!text-neutral-400"
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
										className={`rounded-2xl border px-3 flex-row items-center gap-3 ${
											hasReturn
												? activeCalendarTab === "ritorno"
													? "border-primary-600 bg-white"
													: "border-neutral-100 bg-neutral-50"
												: "border-[#DCEBEB] bg-[#F0F7F7]"
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
													<ThemedText className="text-[15px] font-google-sans-semibold !text-neutral-950">
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
													<View className="bg-neutral-200 rounded-2xl px-2 py-1">
														<ThemedText className="text-[14px] font-google-sans-semibold !text-neutral-800">
															{`${returnDate.getHours()}:${returnDate.getMinutes().toString().padStart(2, "0")}`}
														</ThemedText>
													</View>
												</View>
											</>
										) : (
											<View className="flex-row items-center justify-center gap-1">
												<Icon
													name="add"
													size={20}
													className="!text-primary-500"
												/>
												<ThemedText className="text-[15px] font-google-sans-semibold !text-primary-500">
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
									<ThemedText className="text-[14px] font-google-sans-medium !text-neutral-950">
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
														? "bg-primary-600 border-primary-600"
														: "bg-white border-neutral-200"
												} ${isDisabled ? "opacity-50" : ""}`}
												style={{ width: 80 }}
											>
												<ThemedText
													className={`text-[15px] font-google-sans-bold ${
														isSelected
															? "!text-white"
															: isDisabled
																? "!text-neutral-300"
																: "!text-neutral-800"
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
						<View className="mt-auto pt-2">
							<MainButton
								title="Conferma"
								onPress={() => setShowCalendar(false)}
							/>
						</View>
					</View>
				</BottomSheet>

				<BottomSheet
					isVisible={showFiltersSheet}
					onClose={() => {
						setShowFiltersSheet(false);
						setShowTravelType(false);
					}}
					title="Filtri"
				>
					<View className="gap-6">
						{!isSubscriptionOrCarnet && (
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
											{travelType}
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
										{["Tutte", "Frecce", "Intercity", "Regionali"].map(
											(type) => (
												<Pressable
													key={type}
													onPress={() => {
														setTravelType(type);
														setShowTravelType(false);
													}}
													className="flex-row items-center justify-between px-4 py-2"
												>
													<ThemedText
														className={`text-[15px] ${travelType === type ? "font-google-sans-semibold !text-neutral-950" : "font-google-sans-regular !text-neutral-500"}`}
													>
														{type}
													</ThemedText>
													<Icon
														name="check"
														size={20}
														className={`!text-primary-500 ${travelType === type ? "opacity-100" : "opacity-0"}`}
													/>
												</Pressable>
											),
										)}
									</View>
								</DropdownMenu>

								<View className="flex-row items-center justify-between py-0.5">
									<ThemedText className="text-[15px] font-google-sans-medium !text-neutral-950">
										Solo treni diretti
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
						)}

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
								setShowFiltersSheet(false);
							}}
						/>
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
									<ThemedText className="text-[14px] font-google-sans-bold !text-primary-600 uppercase">
										{getInitials(USER_DATA.firstName, USER_DATA.lastName)}
									</ThemedText>
								</View>
								<View className="ml-4 flex-1">
									<View className="flex-row items-center justify-between">
										<ThemedText className="text-[16px] font-google-sans-bold !text-neutral-950 uppercase">
											{USER_DATA.firstName} {USER_DATA.lastName}
										</ThemedText>
										<Icon
											name={isPassengerExpanded ? "expand_less" : "expand_more"}
											size={24}
											className="!text-neutral-950"
										/>
									</View>
									<ThemedText className="text-[14px] font-google-sans-medium !text-neutral-500 mt-1">
										Adulto · CF/X-GO: {USER_DATA.loyaltyCode}
									</ThemedText>
									{!isPassengerExpanded && (
										<ThemedText className="text-[14px] font-google-sans-medium !text-neutral-500 mt-0.5">
											{USER_DATA.email} · {USER_DATA.phone}
										</ThemedText>
									)}
								</View>
							</Pressable>

							{isPassengerExpanded && (
								<View className="mb-6">
									<View className="flex-row items-center justify-between mb-4">
										<ThemedText className="text-[15px] font-google-sans-bold !text-neutral-950">
											Dettagli passeggero
										</ThemedText>
										<ThemedText className="text-[14px] font-google-sans-bold !text-primary-600">
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
												className="rounded-2xl border border-neutral-200 p-3 bg-white flex-row items-center justify-between"
											>
												<View>
													<ThemedText className="text-[11px] font-google-sans-medium !text-neutral-400 mb-0.5">
														{field.label}
													</ThemedText>
													<ThemedText className="text-[15px] font-google-sans-bold !text-neutral-950 uppercase">
														{field.value}
													</ThemedText>
												</View>
												<Icon
													name="cancel"
													size={20}
													className="!text-neutral-300"
												/>
											</View>
										))}
									</View>
									<ThemedText className="text-[12px] font-google-sans-medium !text-neutral-400 mt-4">
										* Dati obbligatori
									</ThemedText>
								</View>
							)}
						</ScrollView>

						<View className="px-6 py-6 border-t border-neutral-100 bg-white">
							<MainButton
								title="Conferma"
								onPress={() => setShowPassengers(false)}
							/>
						</View>
					</Animated.View>
				)}

				{/* Passengers Full Screen Modal */}
				<Modal
					visible={showPassengersSheet}
					animationType="slide"
					presentationStyle="fullScreen"
					onRequestClose={() => setShowPassengersSheet(false)}
				>
					<View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
						{/* Header */}
						<View className="bg-white px-4 pb-3 pt-2 flex-row items-center justify-between">
							<View className="flex-1 items-start justify-center">
								<Pressable
									onPress={() => setShowPassengersSheet(false)}
									className="p-1 -ml-1"
								>
									<Icon name="close" size={26} className="!text-neutral-900" />
								</Pressable>
							</View>
							<View className="flex-[2] items-center justify-center">
								<ThemedText className="text-[18px] font-google-sans-bold !text-primary-500 text-center">
									Passeggeri
								</ThemedText>
							</View>
							<View className="flex-1" />
						</View>

						<KeyboardAvoidingView
							className="flex-1 bg-white"
							behavior={Platform.OS === "ios" ? "padding" : undefined}
							keyboardVerticalOffset={0} /* force reload */
						>
							<ScrollView
								className="flex-1"
								contentContainerStyle={{ padding: 20, paddingBottom: 140 }}
							>
								{/* Aggiungi */}
								<ThemedText className="text-[16px] font-google-sans-bold !text-primary-500 mb-2">
									Aggiungi
								</ThemedText>

								<Pressable
									onPress={addPassenger}
									className="flex-col bg-[#F0F7F7] border border-[#DCEBEB] rounded-xl p-4 mb-3 active:opacity-70"
								>
									<View className="flex-row items-start justify-between">
										<Icon
											name="person_outline"
											size={24}
											className="!text-primary-500 -ml-0.5"
										/>
										<Icon name="add" size={24} className="!text-primary-500" />
									</View>
									<ThemedText className="text-[16px] font-google-sans-semibold !text-primary-500">
										Persona
									</ThemedText>
								</Pressable>

								<View className="flex-row gap-3 mb-8">
									<Pressable
										onPress={addBike}
										className="flex-1 flex-col bg-[#F0F7F7] border border-[#DCEBEB] rounded-xl p-4 active:opacity-70"
									>
										<View className="flex-row items-start justify-between">
											<Icon
												name="pedal_bike"
												size={24}
												className="!text-primary-500 ml-0.5"
											/>
											<Icon
												name="add"
												size={24}
												className="!text-primary-500"
											/>
										</View>
										<ThemedText className="text-[16px] font-google-sans-semibold !text-primary-500">
											Bicicletta
										</ThemedText>
									</Pressable>
									<Pressable
										onPress={addAnimal}
										className="flex-1 flex-col bg-[#F0F7F7] border border-[#DCEBEB] rounded-xl p-4 active:opacity-70"
									>
										<View className="flex-row items-start justify-between">
											<Icon
												name="pet_supplies"
												size={24}
												className="!text-primary-500"
											/>
											<Icon
												name="add"
												size={24}
												className="!text-primary-500"
											/>
										</View>
										<ThemedText className="text-[16px] font-google-sans-semibold !text-primary-500">
											Animale
										</ThemedText>
									</Pressable>
								</View>

								{/* Riepilogo */}
								<View className="flex-row items-center justify-between mb-2 mt-4">
									<ThemedText className="text-[16px] font-google-sans-bold !text-primary-500">
										Riepilogo
									</ThemedText>
									<View className="flex-row items-center gap-3">
										{passengersList.filter((p) => p.itemType === "passenger")
											.length > 0 && (
											<View className="flex-row items-center gap-1">
												<Icon
													name="person_outline"
													size={18}
													className="!text-neutral-600"
												/>
												<ThemedText className="text-[14px] font-google-sans-bold !text-neutral-700">
													{
														passengersList.filter(
															(p) => p.itemType === "passenger",
														).length
													}
												</ThemedText>
											</View>
										)}
										{passengersList.filter((p) => p.type === "Bicicletta")
											.length > 0 && (
											<View className="flex-row items-center gap-1">
												<Icon
													name="pedal_bike"
													size={18}
													className="!text-neutral-600"
												/>
												<ThemedText className="text-[14px] font-google-sans-bold !text-neutral-700">
													{
														passengersList.filter(
															(p) => p.type === "Bicicletta",
														).length
													}
												</ThemedText>
											</View>
										)}
										{passengersList.filter((p) => p.type === "Animale").length >
											0 && (
											<View className="flex-row items-center gap-1">
												<Icon
													name="pet_supplies"
													size={18}
													className="!text-neutral-600"
												/>
												<ThemedText className="text-[14px] font-google-sans-bold !text-neutral-700">
													{
														passengersList.filter((p) => p.type === "Animale")
															.length
													}
												</ThemedText>
											</View>
										)}
									</View>
								</View>

								{passengersList.map((item, idx) => {
									const isExpanded = expandedPassengerId === item.id;
									const hasName = !!(item.firstName || item.lastName);
									const passengerIndex =
										passengersList
											.filter((p) => p.itemType === "passenger")
											.findIndex((p) => p.id === item.id) + 1;

									return (
										<View
											key={item.id}
											className="flex-col py-4 border-b border-neutral-100"
										>
											<Pressable
												className="flex-row items-center justify-between"
												onPress={() =>
													setExpandedPassengerId(isExpanded ? null : item.id)
												}
											>
												<View className="flex-row items-center flex-1">
													{item.itemType === "passenger" ? (
														item.isMock && hasName ? (
															<View className="h-12 w-12 rounded-full bg-[#008888] items-center justify-center mr-4">
																<ThemedText className="!text-white font-google-sans-bold text-[16px]">
																	{getInitials(
																		item.firstName || "",
																		item.lastName || "",
																	)}
																</ThemedText>
															</View>
														) : (
															<View className="h-12 w-12 rounded-full bg-[#008888] items-center justify-center mr-4">
																<Icon
																	name="person_outline"
																	size={24}
																	className="!text-white"
																/>
															</View>
														)
													) : (
														<View className="h-12 w-12 rounded-full border border-[#008888] items-center justify-center mr-4 bg-white">
															<Icon
																name={
																	item.type === "Bicicletta"
																		? "pedal_bike"
																		: "pet_supplies"
																}
																size={24}
																className="!text-[#008888]"
															/>
														</View>
													)}
													<View>
														<ThemedText className="text-[16px] font-google-sans-bold !text-neutral-950">
															{hasName
																? `${item.firstName || ""} ${item.lastName || ""}`.trim()
																: item.itemType === "passenger"
																	? `Passeggero ${passengerIndex}`
																	: item.name}
														</ThemedText>
														<ThemedText className="text-[13px] font-google-sans-regular !text-neutral-500">
															{item.itemType === "service"
																? "Servizio aggiuntivo"
																: item.type}
														</ThemedText>
													</View>
												</View>
												{item.itemType === "passenger" ? (
													<Animated.View
														style={{
															transform: [
																{ rotate: isExpanded ? "180deg" : "0deg" },
															],
														}}
													>
														<Icon
															name="expand_more"
															size={24}
															className="!text-neutral-800"
														/>
													</Animated.View>
												) : (
													<Pressable
														onPress={(e) => {
															e.stopPropagation();
															setPassengersList((prev) =>
																prev.filter((p) => p.id !== item.id),
															);
														}}
														className="p-2 -mr-2"
													>
														<Icon
															name="delete"
															size={24}
															className="!text-[#c1152c]"
														/>
													</Pressable>
												)}
											</Pressable>
											{isExpanded && (
												<View className="mt-4">
													{item.itemType === "passenger" && (
														<>
															<ThemedText className="text-[14px] font-google-sans-bold !text-neutral-950 mb-3">
																Dettagli passeggero
															</ThemedText>
															<View className="flex-row gap-2 mb-2">
																<PassengerInput
																	label="Nome"
																	value={item.firstName || ""}
																	onChangeText={(text) =>
																		setPassengersList((prev) =>
																			prev.map((p) =>
																				p.id === item.id
																					? { ...p, firstName: text }
																					: p,
																			),
																		)
																	}
																	focusedInputId={focusedPassengerInputId}
																	setFocusedInputId={setFocusedPassengerInputId}
																	inputId={`${item.id}-firstName`}
																	autoCapitalize="words"
																/>
																<PassengerInput
																	label="Cognome"
																	value={item.lastName || ""}
																	onChangeText={(text) =>
																		setPassengersList((prev) =>
																			prev.map((p) =>
																				p.id === item.id
																					? { ...p, lastName: text }
																					: p,
																			),
																		)
																	}
																	focusedInputId={focusedPassengerInputId}
																	setFocusedInputId={setFocusedPassengerInputId}
																	inputId={`${item.id}-lastName`}
																	autoCapitalize="words"
																/>
															</View>

															<View className="flex-row gap-2 mb-2">
																<PassengerInput
																	label="Data di nascita"
																	value={item.birthDate || ""}
																	onChangeText={(text) =>
																		setPassengersList((prev) =>
																			prev.map((p) =>
																				p.id === item.id
																					? { ...p, birthDate: text }
																					: p,
																			),
																		)
																	}
																	focusedInputId={focusedPassengerInputId}
																	setFocusedInputId={setFocusedPassengerInputId}
																	inputId={`${item.id}-birthDate`}
																/>
																<PassengerInput
																	label="CartaFRECCIA"
																	value={item.loyaltyCode || ""}
																	onChangeText={(text) =>
																		setPassengersList((prev) =>
																			prev.map((p) =>
																				p.id === item.id
																					? { ...p, loyaltyCode: text }
																					: p,
																			),
																		)
																	}
																	focusedInputId={focusedPassengerInputId}
																	setFocusedInputId={setFocusedPassengerInputId}
																	inputId={`${item.id}-loyaltyCode`}
																	keyboardType="numeric"
																/>
															</View>

															<View className="flex-row gap-2 mb-4">
																<PassengerInput
																	label="Numero di telefono"
																	value={item.phone || ""}
																	onChangeText={(text) =>
																		setPassengersList((prev) =>
																			prev.map((p) =>
																				p.id === item.id
																					? { ...p, phone: text }
																					: p,
																			),
																		)
																	}
																	focusedInputId={focusedPassengerInputId}
																	setFocusedInputId={setFocusedPassengerInputId}
																	inputId={`${item.id}-phone`}
																	keyboardType="phone-pad"
																/>
																<PassengerInput
																	label="Email"
																	value={item.email || ""}
																	onChangeText={(text) =>
																		setPassengersList((prev) =>
																			prev.map((p) =>
																				p.id === item.id
																					? { ...p, email: text }
																					: p,
																			),
																		)
																	}
																	focusedInputId={focusedPassengerInputId}
																	setFocusedInputId={setFocusedPassengerInputId}
																	inputId={`${item.id}-email`}
																	keyboardType="email-address"
																	autoCapitalize="none"
																/>
															</View>
														</>
													)}

													<View
														className={`flex-row justify-end items-center gap-2`}
													>
														{!item.isMock && (
															<Pressable
																className="flex-row items-center bg-rose-50 px-3 py-2 rounded-lg"
																onPress={() => {
																	setPassengersList((prev) =>
																		prev.filter((p) => p.id !== item.id),
																	);
																	setExpandedPassengerId(null);
																}}
															>
																<Icon
																	name="delete"
																	size={18}
																	className="!text-rose-500 mr-1"
																/>
																<ThemedText className="text-[14px] font-google-sans-medium !text-rose-500">
																	Rimuovi
																</ThemedText>
															</Pressable>
														)}
														{item.itemType === "passenger" && (
															<Pressable
																className="flex-row items-center bg-neutral-100 px-3 py-2 rounded-lg"
																onPress={() => {
																	setPassengersList((prev) =>
																		prev.map((p) =>
																			p.id === item.id
																				? {
																						...p,
																						firstName: "",
																						lastName: "",
																						birthDate: "",
																						loyaltyCode: "",
																						phone: "",
																						email: "",
																					}
																				: p,
																		),
																	);
																}}
															>
																<Icon
																	name="clear_all"
																	size={18}
																	className="!text-neutral-700 mr-1"
																/>
																<ThemedText className="text-[14px] font-google-sans-medium !text-neutral-700">
																	Svuota
																</ThemedText>
															</Pressable>
														)}
														{item.itemType === "passenger" && (
															<Pressable
																className="flex-row items-center bg-[#E0F2F1] px-4 py-2 rounded-lg"
																onPress={() => setExpandedPassengerId(null)}
															>
																<Icon
																	name="bookmark"
																	size={18}
																	className="!text-primary-600 mr-1"
																/>
																<ThemedText className="text-[14px] font-google-sans-medium !text-primary-600">
																	Salva
																</ThemedText>
															</Pressable>
														)}
													</View>
												</View>
											)}
										</View>
									);
								})}
							</ScrollView>
						</KeyboardAvoidingView>

						<View className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-neutral-100 pb-10">
							<MainButton
								title="Conferma"
								onPress={() => setShowPassengersSheet(false)}
							/>
						</View>
					</View>
					<BottomSheet
						isVisible={showAddPassengerSheet}
						onClose={() => setShowAddPassengerSheet(false)}
						title="Passeggeri"
					>
						{/* Passengers Rows */}
						<View className="mb-8">
							<View className="flex-row items-center justify-between py-7 border-b border-neutral-100">
								<ThemedText className="text-[16px] font-google-sans-medium !text-neutral-950">
									Adulti
								</ThemedText>
								<View className="flex-row items-center gap-4">
									<Pressable
										onPress={() => setNewAdults(Math.max(0, newAdults - 1))}
										className={`h-10 w-10 items-center justify-center rounded-full ${
											newAdults <= 0 ? "bg-neutral-200" : "bg-primary-500"
										}`}
									>
										<Icon name="remove" size={24} className="!text-white" />
									</Pressable>
									<ThemedText className="text-[16px] font-google-sans-bold w-4 text-center">
										{newAdults}
									</ThemedText>
									<Pressable
										onPress={() => setNewAdults(newAdults + 1)}
										className="h-10 w-10 items-center justify-center rounded-full bg-primary-500"
									>
										<Icon name="add" size={24} className="!text-white" />
									</Pressable>
								</View>
							</View>

							<View className="flex-row items-center justify-between py-7 border-b border-neutral-100">
								<ThemedText className="text-[16px] font-google-sans-medium !text-neutral-950">
									Ragazzi
								</ThemedText>
								<View className="flex-row items-center gap-4">
									<Pressable
										onPress={() => setNewYouths(Math.max(0, newYouths - 1))}
										className={`h-10 w-10 items-center justify-center rounded-full ${
											newYouths <= 0 ? "bg-neutral-200" : "bg-primary-500"
										}`}
									>
										<Icon name="remove" size={24} className="!text-white" />
									</Pressable>
									<ThemedText className="text-[16px] font-google-sans-bold w-4 text-center">
										{newYouths}
									</ThemedText>
									<Pressable
										onPress={() => setNewYouths(newYouths + 1)}
										className="h-10 w-10 items-center justify-center rounded-full bg-primary-500"
									>
										<Icon name="add" size={24} className="!text-white" />
									</Pressable>
								</View>
							</View>

							<View className="flex-row items-center justify-between py-7 border-b border-neutral-100">
								<View className="flex-row items-center">
									<ThemedText className="text-[16px] font-google-sans-medium !text-neutral-950">
										Bambini
									</ThemedText>
									<ThemedText className="ml-2 text-[14px] font-google-sans-medium !text-neutral-500">
										(0-4 anni non compiuti)
									</ThemedText>
								</View>
								<View className="flex-row items-center gap-4">
									<Pressable
										onPress={() => setNewChildren(Math.max(0, newChildren - 1))}
										className={`h-10 w-10 items-center justify-center rounded-full ${
											newChildren <= 0 ? "bg-neutral-200" : "bg-primary-500"
										}`}
									>
										<Icon name="remove" size={24} className="!text-white" />
									</Pressable>
									<ThemedText className="text-[16px] font-google-sans-bold w-4 text-center">
										{newChildren}
									</ThemedText>
									<Pressable
										onPress={() => setNewChildren(newChildren + 1)}
										className="h-10 w-10 items-center justify-center rounded-full bg-primary-500"
									>
										<Icon name="add" size={24} className="!text-white" />
									</Pressable>
								</View>
							</View>
						</View>

						<MainButton
							title={`Aggiungi ${newAdults + newYouths + newChildren} ${
								newAdults + newYouths + newChildren === 1
									? "passeggero"
									: "passeggeri"
							}`}
							onPress={() => {
								if (newAdults + newYouths + newChildren > 0) {
									setPassengersList((prev) => {
										const newItems: SelectionItem[] = [];
										const currentPassCount = prev.filter(
											(p) => p.itemType === "passenger",
										).length;
										let nextIndex = currentPassCount + 1;

										for (let i = 0; i < newAdults; i++) {
											newItems.push({
												id: Math.random().toString(),
												itemType: "passenger",
												type: "Adulto",
												name: `Passeggero ${nextIndex++}`,
											});
										}
										for (let i = 0; i < newYouths; i++) {
											newItems.push({
												id: Math.random().toString(),
												itemType: "passenger",
												type: "Ragazzo",
												name: `Passeggero ${nextIndex++}`,
											});
										}
										for (let i = 0; i < newChildren; i++) {
											newItems.push({
												id: Math.random().toString(),
												itemType: "passenger",
												type: "Bambino",
												name: `Passeggero ${nextIndex++}`,
											});
										}

										return [...prev, ...newItems];
									});
									setShowAddPassengerSheet(false);
								}
							}}
							disabled={newAdults + newYouths + newChildren === 0}
							className="mb-8"
						/>
					</BottomSheet>
				</Modal>
			</View>
		</TouchableWithoutFeedback>
	);
}
