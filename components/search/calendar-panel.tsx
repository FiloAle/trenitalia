import { BottomSheet } from "@/components/modals/bottom-sheet";
import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { MainButton } from "@/components/ui/main-button";
import { useState, useRef, useEffect } from "react";
import { View, Pressable, FlatList, Alert, Dimensions } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const isToday = (date: Date) => {
	const now = new Date();
	return (
		date.getDate() === now.getDate() &&
		date.getMonth() === now.getMonth() &&
		date.getFullYear() === now.getFullYear()
	);
};

interface CalendarPanelProps {
	isVisible: boolean;
	onClose: () => void;
	departureDate: Date;
	setDepartureDate: (date: Date) => void;
	returnDate: Date;
	setReturnDate: (date: Date) => void;
	hasReturn: boolean;
	setHasReturn: (val: boolean) => void;
	initialTab?: "andata" | "ritorno";
}

export function CalendarPanel({
	isVisible,
	onClose,
	departureDate,
	setDepartureDate,
	returnDate,
	setReturnDate,
	hasReturn,
	setHasReturn,
	initialTab = "andata",
}: CalendarPanelProps) {
	const [activeCalendarTab, setActiveCalendarTab] = useState<"andata" | "ritorno">(initialTab);
	const [currentMonth, setCurrentMonth] = useState(initialTab === "andata" ? departureDate : returnDate);
	
	const [initialCalendarState, setInitialCalendarState] = useState<{
		departureDate: string;
		returnDate: string;
		hasReturn: boolean;
	} | null>(null);

	const hourScrollRef = useRef<FlatList>(null);

	useEffect(() => {
		if (isVisible) {
			setInitialCalendarState({
				departureDate: departureDate.toISOString(),
				returnDate: returnDate.toISOString(),
				hasReturn: hasReturn,
			});
			setActiveCalendarTab(initialTab);
			setCurrentMonth(initialTab === "andata" ? departureDate : returnDate);

			const h = initialTab === "andata" ? departureDate.getHours() : returnDate.getHours();
			setTimeout(() => {
				hourScrollRef.current?.scrollToOffset({
					offset: h * 88,
					animated: true,
				});
			}, 400);
		} else {
			setInitialCalendarState(null);
		}
	}, [isVisible, initialTab]);

	useEffect(() => {
		if (isVisible) {
			const h = activeCalendarTab === "andata" ? departureDate.getHours() : returnDate.getHours();
			setTimeout(() => {
				hourScrollRef.current?.scrollToOffset({
					offset: h * 88,
					animated: true,
				});
			}, 400);
		}
	}, [isVisible, activeCalendarTab]);

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
			(hasReturn && !isSameDateToMinutes(initialCalendarState.returnDate, returnDate)));

	const handleCancelCalendar = () => {
		if (initialCalendarState) {
			setDepartureDate(new Date(initialCalendarState.departureDate));
			setReturnDate(new Date(initialCalendarState.returnDate));
			setHasReturn(initialCalendarState.hasReturn);
		}
		onClose();
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
				{ cancelable: true }
			);
		} else {
			handleCancelCalendar();
		}
	};

	const formatDate = (date: Date) => {
		const monthIdx = date.getMonth();
		const monthName = [
			"Gen", "Feb", "Mar", "Apr", "Mag", "Giu",
			"Lug", "Ago", "Set", "Ott", "Nov", "Dic"
		][monthIdx];
		return `${date.getDate()} ${monthName} - ${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
	};

	const generateDays = () => {
		const year = currentMonth.getFullYear();
		const month = currentMonth.getMonth();
		const firstDay = new Date(year, month, 1).getDay();
		const daysInMonth = new Date(year, month + 1, 0).getDate();

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

	return (
		<>
				{/* Calendar Bottom Sheet */}
				<BottomSheet
					isVisible={isVisible}
					onClose={handleCancelPress}
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
								onPress={onClose}
							/>
						</View>
					</View>
				</BottomSheet>
		</>
	);
}
