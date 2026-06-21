import { BottomSheet } from "@/components/modals/bottom-sheet";
import { CalendarPanel } from "@/components/search/calendar-panel";
import { PassengersPanel } from "@/components/search/passengers-panel";
import { JourneySearchBar } from "@/components/search/journey-search-bar";
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
import { StickyFooter } from "@/components/select-offer/sticky-footer";
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
	const [showPassengersSheet, setShowPassengersSheet] = useState(false);
	const [showTravelType, setShowTravelType] = useState(false);
	const [showFiltersSheet, setShowFiltersSheet] = useState(false);
	const [travelType, setTravelType] = useState("Tutte");
	const [sortOrder, setSortOrder] = useState("Orario di partenza");
	const [pendingSortOrder, setPendingSortOrder] =
		useState("Orario di partenza");
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

	const openCalendar = (tab: "andata" | "ritorno", isAddReturn = false) => {
		setActiveCalendarTab(tab);

		if (isAddReturn) {
			const next = new Date(departureDate);
			next.setHours(next.getHours() + 1);
			next.setMinutes(0);
			setReturnDate(next);
			setHasReturn(true);
		}

		setShowCalendar(true);
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
			} else {
				setActiveInput(null);
				Keyboard.dismiss();
			}
		} else {
			setToText(station);
			if (!fromText) {
				setActiveInput("from");
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
									<JourneySearchBar
										fromText={fromText}
										setFromText={setFromText}
										toText={toText}
										setToText={setToText}
										activeInput={activeInput}
										setActiveInput={setActiveInput}
										autoFocusFrom={true}
									/>
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

					<StickyFooter
						buttonTitle="Ricerca viaggio"
						buttonClassName="flex-1"
						disabled={!fromText || !toText}
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
						leftContent={
							<Pressable
								onPress={() => {
									Keyboard.dismiss();
									setActiveInput(null);
									setShowTravelType(false);
									setShowFiltersSheet(true);
								}}
								className="h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white border border-neutral-200 mr-3"
							>
								<Icon name="page_info" size={22} className="!text-primary-500" />
							</Pressable>
						}
					/>
				</View>

				<CalendarPanel
					isVisible={showCalendar}
					onClose={() => setShowCalendar(false)}
					departureDate={departureDate}
					setDepartureDate={setDepartureDate}
					returnDate={returnDate}
					setReturnDate={setReturnDate}
					hasReturn={hasReturn}
					setHasReturn={setHasReturn}
					initialTab={activeCalendarTab}
				/>

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
				<PassengersPanel
					isVisible={showPassengersSheet}
					onClose={() => setShowPassengersSheet(false)}
					passengersList={passengersList}
					setPassengersList={setPassengersList}
				/>
			</View>
		</TouchableWithoutFeedback>
	);
}
